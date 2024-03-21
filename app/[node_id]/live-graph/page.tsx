"use client";

import SetNavigation from "@/components/SetNavigation";
// import LiveGraph from "@/components/live-graph/LiveGraph";
import LiveGraphSettingsBar from "@/components/live-graph/LiveGraphSettingsBar";
import { catalog } from '@/lib/catalog-interface/catalog';
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import Loading from "../loading";
import dynamic from "next/dynamic";

const LiveGraph = dynamic(() => import('@/components/live-graph/LiveGraph'), { ssr: false });

export default function Page({
    params: {
        node_id,
    },
}: {
    params: {
        node_id: string;
    };
}) {
    const { data: nodeModel, isPending } = useQuery({
        queryKey: ['node', node_id],
        queryFn: () => catalog.node(node_id)?.get(node_id),
    });

    if (!isPending && !nodeModel) notFound();

    if (!nodeModel) return <Loading />;

    return (
        <div className="flex flex-col justify-start h-full animate-in fade-in duration-300">
            <SetNavigation title={nodeModel.parsed.id} />
            <div className='my-3 flex flex-row justify-between px-6 space-x-4'>
                <h1 className='text-3xl font-bold text-gray-600 line-clamp-1'>{nodeModel.parsed.displayName} - Live Graph</h1>
                <LiveGraphSettingsBar />
            </div>
            <div className="relative flex-row flex-1 w-screen">
                <LiveGraph startNode={nodeModel.serialize()} />
            </div>
        </div>
    )
}
