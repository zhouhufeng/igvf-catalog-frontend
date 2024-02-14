"use client";

import GraphTraverser from "@/lib/catalog-interface/GraphTraverser";
import { GraphNode } from "@/lib/types/derived-types";
import { LiveGraphData } from "@/lib/types/live-graph-types";
import { useEffect, useState } from "react";
import { GraphCanvas } from "reagraph";

export default function LiveGraph({
    startNode
}: {
    startNode: GraphNode;
}) {
    const [data, setData] = useState<LiveGraphData | null>(null);

    useEffect(() => {
        new GraphTraverser(startNode)
            .fetchGraphToDepth(3)
            .then(res => {
                setData(res);
            });
    }, []);

    if (!data) return <p>Loading...</p>

    return (
        <div style={{ height: 500, width: 500 }}>
            <GraphCanvas
                nodes={data.nodes}
                edges={data.edges}
            />
        </div>
    );
}

const nodes = [
    {
        id: '1',
        label: '1'
    },
    {
        id: '2',
        label: '2'
    }
];

const edges = [
    {
        source: '1',
        target: '2',
        id: '1-2',
        label: '1-2'
    },
    {
        source: '2',
        target: '1',
        id: '2-1',
        label: '2-1'
    }
];

const testData = {
    "nodes": [
        {
            "id": "P31946",
            "label": "Protein P31946"
        },
        {
            "id": "ENSG00000166913",
            "label": "Gene YWHAB"
        },
        {
            "id": "ENST00000353703",
            "label": "Transcript ENST00000353703"
        },
        {
            "id": "ENST00000372839",
            "label": "Transcript ENST00000372839"
        },
        {
            "id": "ENST00000479421",
            "label": "Transcript ENST00000479421"
        },
        {
            "id": "ENST00000631616",
            "label": "Transcript ENST00000631616"
        },
        {
            "id": "ENST00000428262",
            "label": "Transcript ENST00000428262"
        },
        {
            "id": "ENST00000445830",
            "label": "Transcript ENST00000445830"
        },
        {
            "id": "ENST00000633979",
            "label": "Transcript ENST00000633979"
        },
        {
            "id": "ENST00000477896",
            "label": "Transcript ENST00000477896"
        },
        {
            "id": "rs3761188",
            "label": "Variant rs3761188"
        },
        {
            "id": "rs7265519",
            "label": "Variant rs7265519"
        },
        {
            "id": "rs2425678",
            "label": "Variant rs2425678"
        },
        {
            "id": "rs2425679",
            "label": "Variant rs2425679"
        },
        {
            "id": "rs140133525",
            "label": "Variant rs140133525"
        },
        {
            "id": "rs55700114",
            "label": "Variant rs55700114"
        },
        {
            "id": "rs6103884",
            "label": "Variant rs6103884"
        },
        {
            "id": "rs12481468",
            "label": "Variant rs12481468"
        },
        {
            "id": "rs6031860",
            "label": "Variant rs6031860"
        },
        {
            "id": "rs2425677",
            "label": "Variant rs2425677"
        },
        {
            "id": "rs6094056",
            "label": "Variant rs6094056"
        },
        {
            "id": "rs1998033",
            "label": "Variant rs1998033"
        },
        {
            "id": "rs11484146",
            "label": "Variant rs11484146"
        },
        {
            "id": "rs6031855",
            "label": "Variant rs6031855"
        },
        {
            "id": "rs6031858",
            "label": "Variant rs6031858"
        },
        {
            "id": "rs143267654",
            "label": "Variant rs143267654"
        },
        {
            "id": "rs2425686",
            "label": "Variant rs2425686"
        },
        {
            "id": "rs6065765",
            "label": "Variant rs6065765"
        },
        {
            "id": "rs55797396",
            "label": "Variant rs55797396"
        },
        {
            "id": "rs57925246",
            "label": "Variant rs57925246"
        },
        {
            "id": "rs2425681",
            "label": "Variant rs2425681"
        },
        {
            "id": "rs6103895",
            "label": "Variant rs6103895"
        }
    ],
    "edges": [
        {
            "source": "P31946",
            "target": "ENSG00000166913",
            "id": "P31946-ENSG00000166913"
        },
        {
            "source": "P31946",
            "target": "ENST00000353703",
            "id": "P31946-ENST00000353703"
        },
        {
            "source": "P31946",
            "target": "ENST00000372839",
            "id": "P31946-ENST00000372839"
        },
        {
            "source": "ENSG00000166913",
            "target": "ENST00000479421",
            "id": "ENSG00000166913-ENST00000479421"
        },
        {
            "source": "ENSG00000166913",
            "target": "ENST00000631616",
            "id": "ENSG00000166913-ENST00000631616"
        },
        {
            "source": "ENSG00000166913",
            "target": "ENST00000428262",
            "id": "ENSG00000166913-ENST00000428262"
        },
        {
            "source": "ENSG00000166913",
            "target": "ENST00000445830",
            "id": "ENSG00000166913-ENST00000445830"
        },
        {
            "source": "ENSG00000166913",
            "target": "ENST00000633979",
            "id": "ENSG00000166913-ENST00000633979"
        },
        {
            "source": "ENSG00000166913",
            "target": "ENST00000477896",
            "id": "ENSG00000166913-ENST00000477896"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs3761188",
            "id": "ENSG00000166913-rs3761188"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs7265519",
            "id": "ENSG00000166913-rs7265519"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs2425678",
            "id": "ENSG00000166913-rs2425678"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs2425679",
            "id": "ENSG00000166913-rs2425679"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs140133525",
            "id": "ENSG00000166913-rs140133525"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs55700114",
            "id": "ENSG00000166913-rs55700114"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs6103884",
            "id": "ENSG00000166913-rs6103884"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs12481468",
            "id": "ENSG00000166913-rs12481468"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs6031860",
            "id": "ENSG00000166913-rs6031860"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs2425677",
            "id": "ENSG00000166913-rs2425677"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs6094056",
            "id": "ENSG00000166913-rs6094056"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs1998033",
            "id": "ENSG00000166913-rs1998033"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs11484146",
            "id": "ENSG00000166913-rs11484146"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs6031855",
            "id": "ENSG00000166913-rs6031855"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs6031858",
            "id": "ENSG00000166913-rs6031858"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs143267654",
            "id": "ENSG00000166913-rs143267654"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs2425686",
            "id": "ENSG00000166913-rs2425686"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs6065765",
            "id": "ENSG00000166913-rs6065765"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs55797396",
            "id": "ENSG00000166913-rs55797396"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs57925246",
            "id": "ENSG00000166913-rs57925246"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs2425681",
            "id": "ENSG00000166913-rs2425681"
        },
        {
            "source": "ENSG00000166913",
            "target": "rs6103895",
            "id": "ENSG00000166913-rs6103895"
        }
    ]
}
