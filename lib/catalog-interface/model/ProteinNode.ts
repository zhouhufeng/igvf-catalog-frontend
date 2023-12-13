import BaseNode from "./_BaseNode";
import { api } from "@/lib/utils/api";
import { GraphNode, ProteinNodeData } from "@/lib/types/derived-types";
import { ParsedProperties } from "@/lib/types/graph-model-types";
import GeneNode from "./GeneNode";


export default class ProteinNode extends BaseNode {
    data: ProteinNodeData;
    parsed: ParsedProperties;
    constructor(data: ProteinNodeData) {
        super(data);
        this.data = data;
        this.parsed = {
            id: data._id
        }
    }

    serialize(): GraphNode {
        return {
            protein: this.data
        }
    }

    getDisplayName(): string {
        return "Protein " + this.data?._id || "";
    }

    static async get(id: string): Promise<BaseNode | null> {
        try {
            let proteins = await api.proteins.query({ protein_id: id });

            return new ProteinNode(Array.isArray(proteins) ? proteins[0] : proteins);
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(): Promise<BaseNode[] | null> {
        try {
            // const geneNodes = (await api.genesFromProteins.query({ protein_id: this.id })).map(gene => ({ gene }));
            // const transcriptNodes = (await api.transcriptsFromProteins.query({ protein_id: this.id, verbose: "true" })).map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] }));

            // return [...geneNodes, ...transcriptNodes];

            return [
                new GeneNode({
                    gene_name: "GO:0008150",
                    gene_type: "go",
                    source: "go",
                    _id: "GO:0008150",
                    chr: "",
                    start: null,
                    end: null,
                    hgnc: null,
                    alias: null,
                    source_url: null,
                    version: null
                })
            ];
        } catch (error) {
            return null;
        }
    }
}
