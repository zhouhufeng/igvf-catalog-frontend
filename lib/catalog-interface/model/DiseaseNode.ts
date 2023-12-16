import { DiseaseNodeData, GeneNodeData, GraphNode, OntologyTerm } from "@/lib/types/derived-types";
import BaseNode from "./_BaseNode";
import { ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";
import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";
import GeneNode from "./GeneNode";


export default class DiseaseNode extends BaseNode {
    data: DiseaseNodeData;
    parsed: ParsedProperties;
    constructor(data: OntologyTerm) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data.term_id,
            displayName: "Disease " + this.data.term_name,
        }
    }

    serialize(): GraphNode {
        return {
            disease: this.data
        }
    }

    static async get(id: string): Promise<DiseaseNode | null> {
        try {
            // let disease = await api.ontologyTerm.query({ term_id: id });
            throw new Error("Disease get not implemented");
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(id: string): Promise<BaseNode[] | null> {
        try {
            const preGenes = (await api.genesFromDiseases.query({ disease_id: id })).map(gene => (gene.gene as string));
            
            const geneNodes = await Promise.all(preGenes.map(async  (id_path) => {
                const [_, gene_id] = id_path.split('/');
                const geneNode = await GeneNode.get(gene_id);
                if (!geneNode) throw new Error(`Gene ${gene_id} not found`);
                return geneNode.serialize();
            }));

            return [
                ...geneNodes
            ].map(catalog.deserialize);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
