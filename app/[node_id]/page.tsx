import { notFound } from 'next/navigation';

import SetNavigation from "@/components/SetNavigation";
import ExpandedNode from '@/components/expanded-node';
import GraphContainer from '@/components/GraphContainer';
import { catalog } from '@/lib/catalog-interface/catalog';

export default async function Page({
    params: {
        node_id,
    },
}: {
    params: {
        node_id: string;
    };
}) {
    const model = catalog.node(node_id);
    const nodeData = await model?.get();
    const edges = await model?.getAdjacent();

    if (!nodeData || !edges) {
        notFound();
    }

    return (
        <div className="flex-1 flex flex-row">
            <SetNavigation title={Object.values(nodeData)[0]._id} />
            <div className="flex flex-col border-r border-slate-400 pt-6 pr-6 pl-6 w-1/4 h-full">
                <ExpandedNode node={nodeData} />
            </div>
            <div className="w-3/4">
                <GraphContainer
                    edges={edges}
                    root={nodeData}
                />
            </div>
        </div>
    )
}
