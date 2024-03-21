"use client";

import Loading from "@/app/[node_id]/loading";
import { useAppSelector } from "@/app/_redux/hooks";
import { selectColors, selectLiveGraphSettings } from "@/app/_redux/slices/settingsSlice";
import GraphTraverser from "@/lib/catalog-interface/GraphTraverser";
import { catalog } from "@/lib/catalog-interface/catalog";
import { GraphNode } from "@/lib/types/derived-types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GraphCanvas, InternalGraphNode } from "reagraph";

enum LoadingStatus {
    Loading,
    Loaded,
    Error
}

export default function LiveGraph({
    startNode
}: {
    startNode: GraphNode;
}) {
    const router = useRouter();
    const colors = useAppSelector(selectColors);
    const traverser = useMemo(() => new GraphTraverser(), []);
    // const [data, setData] = useState<LiveGraphData | null>(null);
    // const [status, setStatus] = useState(LoadingStatus.Loading);

    const _settings = useAppSelector(selectLiveGraphSettings);
    const [settings, setSettings] = useState(_settings);
    const [pendingSettingsChange, setPendingSettingsChange] = useState(false);

    const { data, isError, isPending } = useQuery({
        queryKey: ['live-graph', catalog.deserialize(startNode).parsed.id],
        queryFn: ({ signal }) => traverser.fetchGraphToDepth({
            startNode,
            settings,
            colors,
            signal
        }),
    });

    useEffect(() => {
        if (JSON.stringify(settings) !== JSON.stringify(_settings)) {
            if (traverser.responseIsCached(startNode, _settings)) {
                setSettings(_settings);
            } else {
                setPendingSettingsChange(true);
            }
        }
    }, [_settings]);

    const handleUpdateSettings = () => {
        setSettings(_settings);
        setPendingSettingsChange(false);
    };

    const handleNodeClick = (node: InternalGraphNode) => {
        router.push(`/${node.data.id}/live-graph`);
    }

    if (isError) return (
        <div className="flex flex-col items-center justify-center h-[80vh] animate-in fade-in duration-300">
            <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12 m-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <h1 className="text-2xl font-bold">An error occurred while fetching the graph.</h1>
                <p className="mt-2">Please try again later.</p>
            </div>
        </div>
    )

    if (!data || isPending) return (
        <div className="flex flex-col items-center justify-center h-[80vh] animate-in fade-in duration-300">
            <div className="flex flex-col items-center">
                <Loading />
                <h1 className="text-2xl font-bold">Reconstructing the graph from scratch for you. Hang tight...</h1>
                <p className="mt-2">This will take a moment for larger graphs.</p>
            </div>
        </div>
    )

    return (
        <>
            {pendingSettingsChange ? (
                <div className="absolute w-screen z-10 px-6 py-3 flex flex-row items-center justify-between border-t border-b border-gray-500 bg-white">
                    <h2 className="text-lg">You have pending settings changes.</h2>
                    <button
                        onClick={handleUpdateSettings}
                        className="bg-primary px-6 py-2 rounded-lg text-white"
                    >Apply and Reload</button>
                </div>
            ) : null}
            <GraphCanvas
                key={JSON.stringify(settings)}
                nodes={data.nodes}
                edges={data.edges}
                sizingType={settings.sizingType}
                clusterAttribute={settings.clusterStrategy === "unclustered" ? undefined : settings.clusterStrategy}
                onNodeClick={handleNodeClick}
            />
        </>
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
