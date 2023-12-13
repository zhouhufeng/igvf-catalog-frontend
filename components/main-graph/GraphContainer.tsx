"use client";

import { useAppSelector } from "@/app/_redux/hooks";
import { TableGraphNode, selectGraphPath } from "@/app/_redux/slices/graphSlice";
import { groupTableGraphNodes } from "@/lib/catalog-interface/helpers/format-graph-nodes";
import { GraphNode } from "@/lib/types/derived-types";
import { useMemo } from "react";
import NodeCollection from "./NodeCollection";


export default function GraphContainer({
  path,
  initialEdges,
}: {
  path: string[];
  initialEdges: GraphNode[];
}) {
  const reduxEdges = useAppSelector(state => selectGraphPath(state, path));
  const edges: TableGraphNode[] = reduxEdges ? Object.values(reduxEdges) : initialEdges.map(e => {
    return {
      children: {},
      isExpanded: false,
      isLoading: false,
      ...e
    }
  });

  const groupedEdges = useMemo(() => groupTableGraphNodes(edges), [edges])

  return (
    <div className="overflow-scroll space-y-4">
      {groupedEdges.map(g => (
        <NodeCollection 
          key={g.node_type}
          group={g}
          parentPath={path}
        />
      ))}
    </div>
  );
}
