import { GraphNode } from "@/lib/services/GraphService";


export default class BaseNode {
    constructor(id: string) {
        if (this.constructor === BaseNode) {
            throw new Error("Cannot instantiate BaseNode");
        }
    }

    toGraphNode(data: any): any {
        throw new Error("Not implemented");
    }

    async get(): Promise<GraphNode | null> {
        throw new Error("Not implemented");
    }

    async getAdjacent(): Promise<GraphNode[] | null> {
        throw new Error("Not implemented");
    }
}
