import { DrugNode, RsVariant } from "@/utils/db";
import { api, RouterOutputs } from "@/utils/trpc";

export type GeneNodeData = RouterOutputs["geneID"];
export type ProteinNodeData = RouterOutputs["proteinID"];
export type TranscriptNodeData = RouterOutputs["transcriptID"];
export type DrugNodeData = DrugNode;
export type VariantNodeData = RsVariant;

export type NodeType = "gene" | "protein" | "transcript" | "drug" | "variant";

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
