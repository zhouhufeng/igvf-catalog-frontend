import { TableGraphNode } from "@/app/_redux/slices/graphSlice";
import { GraphNode, NodeType, NodeTypes } from "@/lib/types/derived-types";

export interface NodeTypeGroup {
    node_type: NodeType;
    nodes: TableGraphNode[];
}

export function groupTableGraphNodes(nodes: TableGraphNode[]): NodeTypeGroup[] {
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
