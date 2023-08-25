import { RouterInputs, RouterOutputs, api } from "@/utils/trpc";

export interface GraphNode {
    gene?: RouterOutputs['genesFromProteinID'][0]
    protein?: RouterOutputs['proteinsFromGeneID'][0]
    transcript?: RouterOutputs['transcriptsFromGeneID'][0]
}

export default class GraphService {
    static async getGeneEdges(gene_id: string): Promise<GraphNode[]> {
        const proteinNodes = (await api.proteinsFromGeneID.query({ gene_id })).map(protein => ({ protein }));
        const transcriptNodes = (await api.transcriptsFromGeneID.query({ gene_id })).map(transcript => ({ transcript }));

        return [...proteinNodes, ...transcriptNodes];
    }

    static async getProteinEdges(protein_id: string) {
        const geneNodes = (await api.genesFromProteinID.query({ protein_id })).map(gene => ({ gene }));
        const transcriptNodes = (await api.transcriptsFromProteinID.query({ protein_id })).map(transcript => ({ transcript }));

        return [...geneNodes, ...transcriptNodes];
    }

    static async getTranscriptEdges(transcript_id: string) {
        const geneNodes = (await api.genesFromTranscriptsByID.query({ transcript_id })).map(gene => ({ gene }));
        const proteinNodes = (await api.proteinsFromTranscriptID.query({ transcript_id })).map(protein => ({ protein }));

        return [...geneNodes, ...proteinNodes];
    }
}
