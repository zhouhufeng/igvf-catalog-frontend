import BaseNode from "./_BaseNode";
import { api } from "@/lib/utils/api";
import { GraphNode, ProteinNodeData, TranscriptNodeData } from "@/lib/types/derived-types";
import { ParsedProperties } from "@/lib/types/graph-model-types";
import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";


export default class ProteinNode extends BaseNode {
    data: ProteinNodeData;
    parsed: ParsedProperties;
    constructor(data: ProteinNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data._id,
            displayName: "Protein " + this.data._id,
        }
    }

    serialize(): GraphNode {
        return {
            protein: this.data
        }
    }

    static async get(id: string): Promise<BaseNode | null> {
        try {
            let proteins = await api.proteins.query({ protein_id: id });

            return new ProteinNode(Array.isArray(proteins) ? proteins[0] : proteins);
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(id: string): Promise<BaseNode[] | null> {
        try {
            const geneNodes = (await api.genesFromProteins.query({ protein_id: id })).map(gene => ({ gene }));
            const transcriptNodes = (await api.transcriptsFromProteins.query({ protein_id: id, verbose: "true" })).map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] }));

            return [...geneNodes, ...transcriptNodes].map(catalog.deserialize);
        } catch (error) {
            return null;
        }
    }
}
