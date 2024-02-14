import { GraphNode } from "../types/derived-types";
import { catalog } from "./catalog";


export default class GraphTraverser {
    startNode: GraphNode;
    constructor(_startNode: GraphNode) {
        this.startNode = _startNode;
    }

    async fetchGraphToDepth(depth: number) {
        let curDepth = 0;
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];
        const visited = new Set<string>();
        const queue: {
            node: GraphNode;
            depth: number;
        }[] = [
            {
                node: this.startNode,
                depth: 0
            }
        ];

        while (queue.length > 0) {
            const { node, depth: nodeDepth } = queue.shift()!;
            if (!nodes.some(n => catalog.deserialize(n).parsed.id === catalog.deserialize(node).parsed.id)) {
                nodes.push(node);
            }
            if (nodeDepth === depth) continue;

            const adjacentNodes = new (catalog.deserialize(node))
        }
    }
}

interface GraphEdge {
    source: string;
    target: string;
}
