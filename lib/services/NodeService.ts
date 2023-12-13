import { RsVariant, getVariantByRsid } from "@/lib/utils/db";
import { api } from "@/lib/utils/api";

export default class NodeService {
    static async getGeneData(id: string) {
        try {
            let genes = await api.genes.query({ gene_id: id });

            return Array.isArray(genes) ? genes[0] : genes;
        } catch (error) {
            return null;
        }
    }

    static async getProteinData(id: string) {
        try {
            let proteins = await api.proteins.query({ protein_id: id });

            return Array.isArray(proteins) ? proteins[0] : proteins;
        } catch (error) {
            return null;
        }
    }

    static async getTranscriptData(id: string) {
        try {
            let transcripts = await api.transcripts.query({ transcript_id: id });

            return Array.isArray(transcripts) ? transcripts[0] : transcripts;
        } catch (error) {
            return null;
        }
    }

    static async getVariantData(id: string) {
        const rsData: RsVariant[] = await getVariantByRsid(id);

        return rsData[0];
    }
}
