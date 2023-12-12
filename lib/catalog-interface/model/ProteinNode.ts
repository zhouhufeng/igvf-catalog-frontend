import { GraphNode } from "@/lib/services/GraphService";
import BaseNode from "./_BaseNode";
import { api } from "@/lib/utils/api";
import { TranscriptNodeData } from "@/lib/services/NodeService";


export default class ProteinNode extends BaseNode {
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
            let proteins = await api.proteins.query({ protein_id: this.id });

            return this.toGraphNode(Array.isArray(proteins) ? proteins[0] : proteins);
        } catch (error) {
            return null;
        }
    }

    async getAdjacent(): Promise<GraphNode[] | null> {
        try {
            const geneNodes = (await api.genesFromProteins.query({ protein_id: this.id })).map(gene => ({ gene }));
            const transcriptNodes = (await api.transcriptsFromProteins.query({ protein_id: this.id, verbose: "true" })).map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] }));

            return [...geneNodes, ...transcriptNodes];
        } catch (error) {
            return null;
        }
    }
}
