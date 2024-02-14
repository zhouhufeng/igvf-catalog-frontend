"use client";

import { GraphNode } from "@/lib/types/derived-types";
import { LiveGraphData } from "@/lib/types/live-graph-types";
import { useEffect, useState } from "react";
import { GraphCanvas } from 'reagraph';

export default function LiveGraph({
    startNode
}: {
    startNode: GraphNode;
}) {
    const [data, setData] = useState<LiveGraphData | null>(null);

    useEffect(() => {
        
    }, []);

    if (!data) return <p>Loading...</p>

    return (
        <div style={{ height: 500, width: 500, }}>
            <GraphCanvas
                nodes={data.nodes}
                edges={data.edges}
            />
        </div>
    );
}
