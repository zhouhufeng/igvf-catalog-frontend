import { ParsedProperties } from "@/lib/types/graph-model-types";
import BaseNode from "./_BaseNode";
import { DrugNodeData, GeneNodeData, GraphNode, ProteinNodeData, VariantNodeData } from "@/lib/types/derived-types";
import { catalog } from "../catalog";
import { api } from "@/lib/utils/api";
import { preprocess } from "../helpers/format-graph-nodes";
import { single } from "@/lib/utils/utils";


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

    static async getAdjacent(id: string): Promise<BaseNode[] | null> {
        try {
            const variant_id = preprocess(await api.variants.query({ rsid: id }))._id;

            const geneEdges = (await api.genesFromVariants.query({ variant_id, verbose: "true" })).map(v => ({ gene: v.gene as GeneNodeData }));
            const proteinEdges = (await api.proteinsFromVariants.query({ variant_id, verbose: "true" })).map(v => ({ protein: single(v.protein as unknown as ProteinNodeData) }));
            const drugEdges = (await api.drugsFromVariants.query({ variant_id, verbose: "true" })).map(v => ({ drug: single(v.drug as unknown as DrugNodeData) }));

            return [...geneEdges, ...proteinEdges, ...drugEdges].map(catalog.deserialize);
        } catch (error) {
            return null;
        }
    }
}
