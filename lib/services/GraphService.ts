import { api } from "@/lib/utils/api";
import { DiseaseNodeData, DrugNodeData, GeneNodeData, ProteinNodeData, StudyNodeData, TranscriptNodeData, VariantNodeData } from "./NodeService";
import { getDrugsLinkedToRsidKey, getGenesLinkedToRsidKey, getProteinsLinkedToRsidKey, getStudiesLinkedToRsidKey } from "@/lib/utils/db";

export interface GraphNode {
    gene?: GeneNodeData;
    protein?: ProteinNodeData;
    transcript?: TranscriptNodeData;
    drug?: DrugNodeData;
    variant?: VariantNodeData;
    study?: StudyNodeData;
    disease?: DiseaseNodeData;
}

export default class GraphService {
    static async getGeneEdges(gene_id: string): Promise<GraphNode[] | null> {
        try {
            const proteinNodes = (await api.proteinsFromGenes.query({ gene_id })).map(protein => ({ protein }));
            const transcriptNodes = (await api.transcriptsFromGenes.query({ gene_id, verbose: "true" })).map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] }));
            const diseaseNodes = (await api.diseasesFromGenes.query({ gene_id })).map(disease => ({ disease }));

            return [...proteinNodes, ...transcriptNodes, ...diseaseNodes];
        } catch (error) {
            return null;
        }
    }

    static async getProteinEdges(protein_id: string): Promise<GraphNode[] | null> {
        try {
            const geneNodes = (await api.genesFromProteins.query({ protein_id })).map(gene => ({ gene }));
            const transcriptNodes = (await api.transcriptsFromProteins.query({ protein_id, verbose: "true" })).map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] }));

            return [...geneNodes, ...transcriptNodes];
        } catch (error) {
            return null;
        }
    }

    static async getTranscriptEdges(transcript_id: string): Promise<GraphNode[] | null> {
        try {
            const geneNodes = (await api.genesFromTranscripts.query({ transcript_id, verbose: "true" })).map(gene => ({ gene: gene.gene as unknown as GeneNodeData }));
            const proteinNodes = (await api.proteinsFromTranscripts.query({ transcript_id, verbose: "true" })).map(protein => ({ protein: protein.protein as unknown as ProteinNodeData }));

            return [...geneNodes, ...proteinNodes];
        } catch (error) {
            return null;
        }
    }

    static async getRsidEdges(rsidNodeId: string): Promise<GraphNode[] | null> {
        try {
            const geneEdges = (await getGenesLinkedToRsidKey(rsidNodeId)).map(gene => ({ gene }));
            const proteinEdges = (await getProteinsLinkedToRsidKey(rsidNodeId)).map(protein => ({ protein }));
            const drugEdges = (await getDrugsLinkedToRsidKey(rsidNodeId)).map(drug => ({ drug }));
            const studyEdges = (await getStudiesLinkedToRsidKey(rsidNodeId)).map(study => ({ study }));
            return [...geneEdges, ...proteinEdges, ...drugEdges, ...studyEdges];
        } catch (error) {
            return null;
        }
    }
}
