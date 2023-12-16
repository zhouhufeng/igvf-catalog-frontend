"use client";

import { useMemo } from "react";

import { useAppSelector } from "@/app/_redux/hooks";
import { TableGraphNode, selectGraphNodes } from "@/app/_redux/slices/graphSlice";
import { groupTableGraphNodes } from "@/lib/catalog-interface/helpers/format-graph-nodes";
import { GraphNode } from "@/lib/types/derived-types";
import NodeCollection from "./NodeCollection";
import { motion } from "framer-motion";


export default function GraphContainer({
  path,
  initialEdges,
}: {
  path: string[];
  initialEdges: GraphNode[];
}) {
  const reduxEdges = useAppSelector(state => selectGraphNodes(state, path));
  const edges: TableGraphNode[] = reduxEdges ? Object.values(reduxEdges) : initialEdges.map(e => {
    return {
      children: {},
      isExpanded: false,
      ...e
    }
  });

  const groupedEdges = useMemo(() => groupTableGraphNodes(edges), [edges])

  return (
    <motion.div
      className="overflow-scroll space-y-4 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {groupedEdges.map(g => (
        <NodeCollection
          key={g.node_type}
          group={g}
          parentPath={path}
        />
      ))}
    </motion.div>
  );
}
