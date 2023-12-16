import { GeneNodeData, GraphNode, OntologyTerm, TranscriptNodeData } from "@/lib/types/derived-types";
import BaseNode from "./_BaseNode";
import { ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";
import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";
import { single } from "@/lib/utils/utils";


export default class GeneNode extends BaseNode {
    data: GeneNodeData;
    parsed: ParsedProperties;
    constructor(data: GeneNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data._id,
            displayName: "Gene " + this.data._id,
        }
    }

    serialize(): GraphNode {
        return {
            gene: this.data
        }
    }

    static async get(id: string): Promise<GeneNode | null> {
        try {
            let genes = await api.genes.query({ gene_id: id });

            return new GeneNode(Array.isArray(genes) ? genes[0] : genes)
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(id: string): Promise<BaseNode[] | null> {
        try {
            const proteinNodes = (await api.proteinsFromGenes.query({ gene_id: id })).map(protein => ({ protein }));
            const transcriptNodes = (await api.transcriptsFromGenes.query({ gene_id: id, verbose: "true" })).map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] }));
            const diseaseNodes = (await api.diseasesFromGenes.query({ gene_id: id, verbose: "true" })).map(disease => ({ disease: { ...disease, ...single(disease['ontology term'] as unknown as OntologyTerm[]) } }));
            const variantNodes = (await api.variantsFromGenes.query({ gene_id: id, verbose: "true" })).map(variant => ({ variant: variant["sequence variant"] }));

            return [
                ...proteinNodes,
                ...transcriptNodes,
                ...diseaseNodes,
                ...variantNodes
            ].map(catalog.deserialize);
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
