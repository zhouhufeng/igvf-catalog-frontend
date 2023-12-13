import { GraphNode, TranscriptNodeData } from "@/lib/types/derived-types";
import BaseNode from "./_BaseNode";
import { api } from "@/lib/utils/api";
import { ParsedProperties } from "@/lib/types/graph-model-types";
import GeneNode from "./GeneNode";


export default class TranscriptNode extends BaseNode {
    data: TranscriptNodeData;
    parsed: ParsedProperties;
    constructor(data: TranscriptNodeData) {
        super(data);
        this.data = data;
        this.parsed = {
            id: data._id
        }
    }

    serialize(): GraphNode {
        return {
            transcript: this.data
        }
    }

    getDisplayName(): string {
        return "Transcript " + this.data?._id || "";
    }

    static async get(id: string): Promise<BaseNode | null> {
        try {
            let transcripts = await api.transcripts.query({ transcript_id: id });

            return new TranscriptNode(Array.isArray(transcripts) ? transcripts[0] : transcripts);
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(id: string): Promise<BaseNode[] | null> {
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
    }
}
