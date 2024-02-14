import {
    GraphNode as ReagraphGraphNode,
    GraphEdge as ReagraphGraphEdge,
} from "reagraph";

export interface LiveGraphData {
    nodes: ReagraphGraphNode[];
    edges: ReagraphGraphEdge[];
}
