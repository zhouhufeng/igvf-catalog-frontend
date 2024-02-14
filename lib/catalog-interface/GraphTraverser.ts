import { GraphNode } from "../types/derived-types";
import { catalog } from "./catalog";


export default class GraphTraverser {
    startNode: GraphNode;
    constructor(_startNode: GraphNode) {
        this.startNode = _startNode;
    }

    async fetchGraphToDepth(depth: number) {
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
            const model = catalog.deserialize(node);
            if (!nodes.some(n => catalog.deserialize(n).parsed.id === model.parsed.id)) {
                nodes.push(node);
            }
            if (nodeDepth === depth) continue;

            const adjacentNodes = await catalog.deserializeToStatic(node).getAdjacent(model.parsed.id);
            if (!adjacentNodes) continue;

            for (const adj of adjacentNodes) {
                if (!visited.has(adj.parsed.id)) {
                    visited.add(adj.parsed.id);
                    queue.push({
                        node: adj.serialize(),
                        depth: nodeDepth + 1
                    });
                    edges.push({
                        source: model.parsed.id,
                        target: adj.parsed.id
                    });
                }
            }
        }

        return {
            nodes,
            edges
        }
    }
}

interface GraphEdge {
    source: string;
    target: string;
}
