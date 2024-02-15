"use client";

import SetNavigation from "@/components/SetNavigation";
import LiveGraph from "@/components/live-graph/LiveGraph";
import LiveGraphSettingsBar from "@/components/live-graph/LiveGraphSettingsBar";
import { catalog } from '@/lib/catalog-interface/catalog';
import { notFound } from "next/navigation";

export default async function Page({
    params: {
        node_id,
    },
}: {
    params: {
        node_id: string;
    };
}) {
    const nodeModel = await catalog.node(node_id)?.get(node_id);

    if (!nodeModel) notFound();

    return (
        <div className="opacity-0 animate-fadeIn flex flex-col justify-start h-full">
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
