import { GeneNodeData, GraphNode, ProteinNodeData, TranscriptNodeData } from "@/lib/types/derived-types";
import { GetAdjacentOptions, ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";

import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";
import BaseNode from "./_BaseNode";

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

    static async getAdjacent(
        id: string,
        options?: GetAdjacentOptions
    ): Promise<BaseNode[] | null> {
        try {
            const queries = {
                gene: () => api.genesFromTranscripts.query({ transcript_id: id, verbose: "true", page: options?.page })
                    .then(genes => genes.map(gene => ({ gene: gene.gene as unknown as GeneNodeData }))),
                protein: () => api.proteinsFromTranscripts.query({ transcript_id: id, verbose: "true", page: options?.page })
                    .then(proteins => proteins.map(protein => ({ protein: protein.protein as unknown as ProteinNodeData })))
            };

            const results = await Promise.all(
                Object.entries(queries)
                    .filter(([type]) => !options?.type || options.type === type)
                    .map(([, query]) => query())
            );

            return results.flat().map(catalog.deserialize);
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
