import { DrugNodeData, GeneNodeData, GraphNode, ProteinNodeData, VariantNodeData } from "@/lib/types/derived-types";
import { GetAdjacentOptions, ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";
import { single } from "@/lib/utils/utils";

import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";
import BaseNode from "./_BaseNode";

export default class VariantNode extends BaseNode {
    data: VariantNodeData;
    parsed: ParsedProperties;
    constructor(data: VariantNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data.rsid?.[0] || "",
            displayName: "Variant " + this.data.rsid?.[0],
        }
    }

    serialize(): GraphNode {
        return {
            variant: this.data
        }
    }

    getDisplayName(): string {
        return "Variant " + this.data?._id || "";
    }

    static async get(id: string): Promise<BaseNode> {
        const rsData = await api.variants.query({ rsid: id });

        return new VariantNode(rsData[0]);
    }

    static async getAdjacent(
        id: string,
        options?: GetAdjacentOptions
    ): Promise<BaseNode[] | null> {
        try {
            const variant_id = preprocess(await api.variants.query({ rsid: id }))._id;

            const queries = {
                gene: () => api.genesFromVariants.query({ variant_id, verbose: "true" })
                    .then(genes => genes.map(v => ({ gene: v.gene as GeneNodeData }))),
                protein: () => api.proteinsFromVariants.query({ variant_id, verbose: "true" })
                    .then(proteins => proteins.map(v => ({ protein: single(v.protein as unknown as ProteinNodeData) }))),
                drug: () => api.drugsFromVariants.query({ variant_id, verbose: "true" })
                    .then(drugs => drugs.map(v => ({ drug: single(v.drug as unknown as DrugNodeData) })))
            };

            const results = await Promise.all(
                Object.entries(queries)
                    .filter(([type]) => !options?.type || options.type === type)
                    .map(([, query]) => query())
            );

            return results.flat().map(catalog.deserialize);
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
