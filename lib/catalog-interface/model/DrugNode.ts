import { DrugNodeData, GeneNodeData, GraphNode, TranscriptNodeData } from "@/lib/types/derived-types";
import BaseNode from "./_BaseNode";
import { ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";
import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";


export default class DrugNode extends BaseNode {
    data: DrugNodeData;
    parsed: ParsedProperties;
    constructor(data: GeneNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data._id,
            displayName: "Drug " + this.data._id,
        }
    }

    serialize(): GraphNode {
        return {
            drug: this.data
        }
    }

    static async get(id: string): Promise<DrugNode | null> {
        try {
            throw new Error("Drug get not implemented");
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(id: string): Promise<BaseNode[] | null> {
        try {
            throw new Error("Drug getAdjacent not implemented");
        } catch (error) {
            return null;
        }
    }
}
