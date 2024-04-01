import { TableGraphNode } from "@/app/_redux/slices/graphSlice";
import { GraphNode, NodeType, NodeTypes } from "@/lib/types/derived-types";
import { single } from "@/lib/utils/utils";

export interface TableNodeTypeGroup {
    node_type: NodeType;
    nodes: TableGraphNode[];
}

export function groupTableGraphNodes(nodes: TableGraphNode[]): TableNodeTypeGroup[] {
    const groups: { [key: string]: TableGraphNode[] } = {};

    nodes.forEach(node => {
        Object.keys(node).forEach(key => {
            if (!NodeTypes.includes(key as any)) return;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(node);
        });
    });

    return Object.keys(groups).map(key => ({
        node_type: key as NodeType,
        nodes: groups[key]
    }));
}

export interface NodeTypeGroup {
    node_type: NodeType;
    nodes: GraphNode[];
}

export function groupGraphNodes(nodes: GraphNode[]): NodeTypeGroup[] {
    const groups: { [key: string]: GraphNode[] } = {};

    nodes.forEach(node => {
        Object.keys(node).forEach(key => {
            if (!NodeTypes.includes(key as any)) return;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(node);
        });
    });

    return Object.keys(groups).map(key => ({
        node_type: key as NodeType,
        nodes: groups[key]
    }));
}

export function preprocess<T>(nodes: T[] | T) {
    const data: any = single(nodes);

    if (data._id && data._id.includes("/")) {
        data._id = data._id.split("/")[1];
    }

    return data;
}
