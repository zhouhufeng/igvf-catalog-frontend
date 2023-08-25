import { api, RouterOutputs } from "@/utils/trpc";

export type GeneNodeData = RouterOutputs["geneID"];
export type ProteinNodeData = RouterOutputs["proteinID"];
export type TranscriptNodeData = RouterOutputs["transcriptID"];

export default class NodeService {
    static async getGeneData(id: string) {
        return await api.geneID.query({ id });
    }

    static async getProteinData(id: string) {
        return await api.proteinID.query({ id });
    }

    static async getTranscriptData(id: string) {
        return await api.transcriptID.query({ id });
    }
}
