import { ParsedProperties } from "@/lib/types/graph-model-types";
import BaseNode from "./_BaseNode";
import {
    RsVariant,
    getDrugsLinkedToRsidKey,
    getGenesLinkedToRsidKey,
    getProteinsLinkedToRsidKey,
    getStudiesLinkedToRsidKey,
    getVariantByRsid
} from "@/lib/utils/db";
import { GraphNode, VariantNodeData } from "@/lib/types/derived-types";
import GeneNode from "./GeneNode";


export default class VariantNode extends BaseNode {
    data: VariantNodeData;
    parsed: ParsedProperties;
    constructor(data: VariantNodeData) {
        super(data);
        this.data = data;
        this.parsed = {
            id: data._id
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
        const rsData: RsVariant[] = await getVariantByRsid(id);

        return new VariantNode(rsData[0]);
    }

    static async getAdjacent(id: string): Promise<BaseNode[] | null> {
        try {
            // const geneEdges = (await getGenesLinkedToRsidKey(id)).map(gene => ({ gene }));
            // const proteinEdges = (await getProteinsLinkedToRsidKey(id)).map(protein => ({ protein }));
            // const drugEdges = (await getDrugsLinkedToRsidKey(id)).map(drug => ({ drug }));
            // const studyEdges = (await getStudiesLinkedToRsidKey(id)).map(study => ({ study }));
            // return [...geneEdges, ...proteinEdges, ...drugEdges, ...studyEdges];

            return [
                new GeneNode({
                    gene_name: "GO:0008150",
                    gene_type: "go",
                    source: "go",
                    _id: "GO:0008150",
                    chr: "",
                    start: null,
                    end: null,
                    hgnc: null,
                    alias: null,
                    source_url: null,
                    version: null
                })
            ];
        } catch (error) {
            return null;
        }
    }
}
