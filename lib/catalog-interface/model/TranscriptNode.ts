import { GraphNode } from "@/lib/services/GraphService";
import BaseNode from "./_BaseNode";
import { api } from "@/lib/utils/api";


export default class TranscriptNode extends BaseNode {
    id: string;
    constructor(id: string) {
        super(id);
        this.id = id;
    }

    toGraphNode(data: any): GraphNode {
        return { variant: data }
    }

    async get(): Promise<GraphNode | null> {
        try {
            let transcripts = await api.transcripts.query({ transcript_id: this.id });

            return this.toGraphNode(Array.isArray(transcripts) ? transcripts[0] : transcripts);
        } catch (error) {
            return null;
        }
    }

    async getAdjacent(): Promise<GraphNode[]> {
        return [
            {
                gene: {
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
                }
            }
        ];
    }
}
