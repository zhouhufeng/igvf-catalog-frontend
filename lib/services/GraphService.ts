import { RouterInputs, RouterOutputs, api } from "@/utils/trpc";
import { DrugNodeData, GeneNodeData, ProteinNodeData, TranscriptNodeData, VariantNodeData } from "./NodeService";
import { getDrugsLinkedToRsidKey, getProteinsLinkedToRsidKey } from "@/utils/db";

export interface GraphNode {
    gene?: GeneNodeData;
    protein?: ProteinNodeData;
    transcript?: TranscriptNodeData;
    drug?: DrugNodeData;
    variant?: VariantNodeData;
}

export default class GraphService {
    static async getGeneEdges(gene_id: string): Promise<GraphNode[] | null> {
        try {
            const proteinNodes = (await api.proteinsFromGeneID.query({ gene_id })).map(protein => ({ protein }));
            const transcriptNodes = (await api.transcriptsFromGeneID.query({ gene_id })).map(transcript => ({ transcript }));

            return [...proteinNodes, ...transcriptNodes];
        } catch (error) {
            return null;
        }
    }

    static async getProteinEdges(protein_id: string): Promise<GraphNode[] | null> {
        try {
            const geneNodes = (await api.genesFromProteinID.query({ protein_id })).map(gene => ({ gene }));
            const transcriptNodes = (await api.transcriptsFromProteinID.query({ protein_id })).map(transcript => ({ transcript }));

            return [...geneNodes, ...transcriptNodes];
        } catch (error) {
            return null;
        }
    }

    static async getTranscriptEdges(transcript_id: string): Promise<GraphNode[] | null> {
        try {
            const geneNodes = (await api.genesFromTranscriptsByID.query({ transcript_id })).map(gene => ({ gene }));
            const proteinNodes = (await api.proteinsFromTranscriptID.query({ transcript_id })).map(protein => ({ protein }));

            return [...geneNodes, ...proteinNodes];
        } catch (error) {
            return null;
        }
    }

    static async getRsidEdges(rsidNodeId: string): Promise<GraphNode[] | null> {
        try {
            const proteinEdges = (await getProteinsLinkedToRsidKey(rsidNodeId)).map(protein => ({ protein }));
            const drugEdges = (await getDrugsLinkedToRsidKey(rsidNodeId)).map(drug => ({ drug }));

            return [...proteinEdges, ...drugEdges];
        } catch (error) {
            return null;
        }
    }
}
