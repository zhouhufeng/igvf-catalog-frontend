"use client";

import SetNavigation from "@/components/SetNavigation";
import LiveGraph from "@/components/live-graph/LiveGraph";
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
        <div className="px-6 opacity-0 animate-fadeIn">
            <SetNavigation title={nodeModel.parsed.id} />
            <div className='my-3 flex flex-row justify-between'>
                <h1 className='text-3xl font-bold text-gray-600 line-clamp-1'>{nodeModel.parsed.displayName}</h1>
            </div>
            <div>
                <LiveGraph startNode={nodeModel.serialize()} />
            </div>
        </div>
    )
}
