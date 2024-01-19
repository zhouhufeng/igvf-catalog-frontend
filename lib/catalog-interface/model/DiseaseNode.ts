import { DiseaseNodeData, GeneNodeData, GraphNode, OntologyTerm } from "@/lib/types/derived-types";
import { GetAdjacentOptions, ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";

import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";
import BaseNode from "./_BaseNode";
import GeneNode from "./GeneNode";

export default class DiseaseNode extends BaseNode {
    data: DiseaseNodeData;
    parsed: ParsedProperties;
    constructor(data: DiseaseNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data.term_id,
            displayName: this.data.term_name,
        }
    }

    serialize(): GraphNode {
        return {
            disease: this.data
        }
    }

    static async get(id: string): Promise<DiseaseNode | null> {
        try {
            let disease = await api.ontologyTerm.query({ term_id: id, });
            if (disease.length == 0) return null;

            let diseaseNode = disease[0] as DiseaseNodeData;

            const [geneObj] = await api.genesFromDiseases.query({ disease_id: id });

            if (geneObj) {
                const [_, gene_id] = (geneObj.gene as string).split('/');
                const geneNode = await GeneNode.get(gene_id);
                if (!geneNode) throw new Error(`Gene ${gene_id} not found`);
                const node = geneNode.serialize()

                diseaseNode = {
                    ...diseaseNode,
                    ...geneObj,
                    gene: node.gene
                }
            }

            return new DiseaseNode(diseaseNode);
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(
        id: string,
        options?: GetAdjacentOptions
    ): Promise<BaseNode[] | null> {
        try {
            const preGenes = (await api.genesFromDiseases.query({ disease_id: id, page: options?.page }));

            const geneNodes = await Promise.all(preGenes.map(async (geneObj) => {
                const [_, gene_id] = (geneObj.gene as string).split('/');
                const geneNode = await GeneNode.get(gene_id);
                if (!geneNode) throw new Error(`Gene ${gene_id} not found`);
                return geneNode.serialize()
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
