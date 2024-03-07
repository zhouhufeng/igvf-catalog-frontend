import { ColorMapType, LiveGraphSettings } from "@/app/_redux/slices/settingsSlice";

import { GraphNode } from "../types/derived-types";
import { LiveGraphData } from "../types/live-graph-types";
import { catalog } from "./catalog";
import BaseNode from "./model/_BaseNode";

export default class GraphTraverser {
    adjacentCache = new Map<string, Awaited<ReturnType<typeof BaseNode.getAdjacent>>>();
    rawNodesAndEdgesResponse = new Map<string, { nodes: GraphNode[], edges: GraphEdge[] }>();

    async getNodeAdjacent(node: GraphNode, model: BaseNode) {
        const adjacent = await catalog.deserializeToStatic(node).getAdjacent(model.parsed.id);

        if (this.adjacentCache.has(model.parsed.id)) {
            return this.adjacentCache.get(model.parsed.id)!;
        } else {
            this.adjacentCache.set(model.parsed.id, adjacent);
        }

        return adjacent;
    }

    async fetchGraphToDepth(startNode: GraphNode, settings: LiveGraphSettings, colors: ColorMapType) {
        const startModel = catalog.deserialize(startNode);
        const cacheKey = startModel.parsed.id + "-" + settings.loadDepth;

        if (this.rawNodesAndEdgesResponse.has(cacheKey)) {
            const { nodes, edges } = this.rawNodesAndEdgesResponse.get(cacheKey)!;
            return GraphTraverser.mapToRegraphFormat(nodes, edges, colors, settings);
        }
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];
        const visited = new Set<string>();
        const queue: {
            node: GraphNode;
            depth: number;
        }[] = [
                {
                    node: startNode,
                    depth: 0
                }
            ];

        visited.add(startModel.parsed.id);

        while (queue.length > 0) {
            const { node, depth: nodeDepth } = queue.shift()!;
            const model = catalog.deserialize(node);
            if (!nodes.some(n => catalog.deserialize(n).parsed.id === model.parsed.id)) {
                nodes.push(node);
            }
            if (nodeDepth === settings.loadDepth) continue;

            const adjacentNodes = await this.getNodeAdjacent(node, model);
            if (!adjacentNodes) continue;

            for (const adj of adjacentNodes) {
                if (!visited.has(adj.parsed.id)) {
                    visited.add(adj.parsed.id);
                    queue.push({
                        node: adj.serialize(),
                        depth: nodeDepth + 1
                    });
                }
                edges.push({
                    source: model.parsed.id,
                    target: adj.parsed.id
                });
            }
        }

        this.rawNodesAndEdgesResponse.set(cacheKey, { nodes, edges });

        return GraphTraverser.mapToRegraphFormat(nodes, edges, colors, settings);
    }

    async getStoredRawGraph(startNode: GraphNode, settings: LiveGraphSettings, colors: ColorMapType) {
        return this.fetchGraphToDepth(startNode, settings, colors);
    }

    responseIsCached(startNode: GraphNode, settings: LiveGraphSettings) {
        const startModel = catalog.deserialize(startNode);
        return this.rawNodesAndEdgesResponse.has(GraphTraverser.getCacheKey(startModel, settings));
    }

    static getCacheKey(startModel: BaseNode, settings: LiveGraphSettings) {
        return `${startModel.parsed.id}-${settings.loadDepth}`;
    }

    static mapToRegraphFormat(nodes: GraphNode[], edges: GraphEdge[], colors: ColorMapType, settings: LiveGraphSettings) {
        let edgesSet = new Set<string>();

        const mappedEdges = edges.map<LiveGraphData['edges'][0]>(e => ({
            source: e.source,
            target: e.target,
            id: `${e.source}-${e.target}`,
        }));

        const targetConnections = new Map<string, number>();
        mappedEdges.forEach(edge => {
            const target = edge.target;
            if (targetConnections.has(target)) {
                targetConnections.set(target, targetConnections.get(target)! + 1);
            } else {
                targetConnections.set(target, 1);
            }
        });

        const denseTargets = new Set<string>();

        const sortedTargets = Array.from(targetConnections.entries()).sort((a, b) => b[1] - a[1]);

        for (let i = 0; i < Math.min(7, sortedTargets.length); i++) {
            denseTargets.add(sortedTargets[i][0]);
        }

        const dedupedEdges = mappedEdges.filter(e => {
            if (edgesSet.has(e.id)) {
                return false;
            } else {
                edgesSet.add(e.id);
                return true;
            }
        })

        return {
            nodes: nodes.map(n => {
                const model = catalog.deserialize(n);
                return {
                    id: model.parsed.id,
                    label: model.parsed.displayName,
                    fill: colors[catalog.modelToKey(model)] ?? undefined,
                    data: {
                        rootNode: catalog.modelToKey(model),
                        density: denseTargets.has(model.parsed.id) ? "dense" : "sparse",
                    },
                }
            }),
            edges: dedupedEdges
        } as LiveGraphData;
    }
}

interface GraphEdge {
    source: string;
    target: string;
}
