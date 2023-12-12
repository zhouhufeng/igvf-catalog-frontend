import { GraphNode } from "@/lib/services/GraphService";
import BaseNode from "./_BaseNode";
import { api } from "@/lib/utils/api";
import { TranscriptNodeData } from "@/lib/services/NodeService";


export default class GeneNode extends BaseNode {
    id: string;
    constructor(id: string) {
        super(id);
        this.id = id;
    }

    toGraphNode(data: any) {
        return { gene: data }
    }

    async get(): Promise<GraphNode | null> {
        try {
            let genes = await api.genes.query({ gene_id: this.id });

            return this.toGraphNode(Array.isArray(genes) ? genes[0] : genes)
        } catch (error) {
            return null;
        }
    }

    async getAdjacent(): Promise<GraphNode[] | null> {
        try {
            const proteinNodes = (await api.proteinsFromGenes.query({ gene_id: this.id })).map(protein => ({ protein }));
            const transcriptNodes = (await api.transcriptsFromGenes.query({ gene_id: this.id, verbose: "true" })).map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] }));
            const diseaseNodes = (await api.diseasesFromGenes.query({ gene_id: this.id })).map(disease => ({ disease }));

            return [...proteinNodes, ...transcriptNodes, ...diseaseNodes];
        } catch (error) {
            return null;
        }
    }
}
