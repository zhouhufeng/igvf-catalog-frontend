import { GeneNodeData, GraphNode, StudyNodeData } from "@/lib/types/derived-types";
import BaseNode from "./_BaseNode";
import { ParsedProperties } from "@/lib/types/graph-model-types";
import { preprocess } from "../helpers/format-graph-nodes";


export default class StudyNode extends BaseNode {
    data: StudyNodeData;
    parsed: ParsedProperties;
    constructor(data: GeneNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data._id,
            displayName: "Study " + this.data._id,
        }
    }

    serialize(): GraphNode {
        return {
            study: this.data
        }
    }

    static async get(id: string): Promise<StudyNode | null> {
        try {
            throw new Error("Study get not implemented.");
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(id: string): Promise<BaseNode[] | null> {
        try {
            throw new Error("Study get not implemented.");
        } catch (error) {
            return null;
        }
    }
}
