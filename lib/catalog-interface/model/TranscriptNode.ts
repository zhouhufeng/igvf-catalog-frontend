import { GeneNodeData, GraphNode, ProteinNodeData, TranscriptNodeData } from "@/lib/types/derived-types";
import BaseNode from "./_BaseNode";
import { api } from "@/lib/utils/api";
import { ParsedProperties } from "@/lib/types/graph-model-types";
import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";


export default class TranscriptNode extends BaseNode {
    data: TranscriptNodeData;
    parsed: ParsedProperties;
    constructor(data: TranscriptNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data._id,
            displayName: "Transcript " + this.data._id,
        }
    }

    serialize(): GraphNode {
        return {
            transcript: this.data
        }
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
        const geneNodes = (await api.genesFromTranscripts.query({ transcript_id: id, verbose: "true" })).map(gene => ({ gene: gene.gene as unknown as GeneNodeData }));
        const proteinNodes = (await api.proteinsFromTranscripts.query({ transcript_id: id, verbose: "true" })).map(protein => ({ protein: protein.protein as unknown as ProteinNodeData }));

        return [...geneNodes, ...proteinNodes].map(catalog.deserialize);
    }
}
