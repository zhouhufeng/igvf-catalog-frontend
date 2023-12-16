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
        try {
            let variants = await api.variants.query({ rsid: id });

            return Array.isArray(variants) ? variants[0] : variants;
        } catch (error) {
            return null;
        }
    }

    static async getDrugData(id: string) {
        try {
            let drugs = await api.drugs.query({ drug_id: id });

            return Array.isArray(drugs) ? drugs[0] : drugs;
        } catch (error) {
            return null;
        }
    }

    static async getStudyData(id: string) {
        try {
            let studies = await api.studies.query({ study_id: id });

            return Array.isArray(studies) ? studies[0] : studies;
        } catch (error) {
            return null;
        }
    }
}
