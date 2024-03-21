import { useMemo } from "react";
import { GraphNode } from "../../types/derived-types";
import { catalog } from "../catalog";

export default function useDeserializedNode(node: GraphNode) {
    return useMemo(() => catalog.deserialize(node), [node]);
}
