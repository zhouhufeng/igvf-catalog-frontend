import NodeService from "@/lib/services/NodeService";
import { RouterOutputs } from "../utils/api";
import { DrugNode, RsVariant, StudyNode } from "../utils/db";


export type GeneNodeData = NonNullable<Awaited<ReturnType<typeof NodeService.getGeneData>>>;
export type ProteinNodeData = NonNullable<Awaited<ReturnType<typeof NodeService.getProteinData>>>;
export type TranscriptNodeData = NonNullable<Awaited<ReturnType<typeof NodeService.getTranscriptData>>>;
export type DrugNodeData = NonNullable<Awaited<ReturnType<typeof NodeService.getDrugData>>>;
export type VariantNodeData = NonNullable<Awaited<ReturnType<typeof NodeService.getVariantData>>>;
export type StudyNodeData = NonNullable<Awaited<ReturnType<typeof NodeService.getStudyData>>>;
export type DiseaseNodeData = RouterOutputs['diseasesFromGenes'][0] & OntologyTerm;

export type OntologyTerm = RouterOutputs['ontologyTerm'][0];

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
