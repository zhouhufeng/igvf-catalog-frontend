import NodeService from "@/lib/services/NodeService";
import { RouterOutputs } from "../utils/api";
import { DrugNode, RsVariant, StudyNode } from "../utils/db";


export type GeneNodeData = NonNullable<Awaited<ReturnType<typeof NodeService.getGeneData>>>;
export type ProteinNodeData = NonNullable<Awaited<ReturnType<typeof NodeService.getProteinData>>>;
export type TranscriptNodeData = NonNullable<Awaited<ReturnType<typeof NodeService.getTranscriptData>>>;
export type DrugNodeData = DrugNode;
export type VariantNodeData = RsVariant;
export type StudyNodeData = StudyNode;
export type DiseaseNodeData = RouterOutputs['diseasesFromGenes'][0];

export interface GraphNode {
    gene?: GeneNodeData;
    protein?: ProteinNodeData;
    transcript?: TranscriptNodeData;
    drug?: DrugNodeData;
    variant?: VariantNodeData;
    study?: StudyNodeData;
    disease?: DiseaseNodeData;
}

export type NodeType = keyof GraphNode;
export const NodeTypes = ["gene", "protein", "transcript", "drug", "variant", "study", "disease"] as NodeType[];
