import { notFound } from 'next/navigation';

import SetNavigation from "@/components/SetNavigation";
import ExpandedNode from '@/components/expanded-node';
import GraphContainer from '@/components/main-graph/GraphContainer';
import { catalog } from '@/lib/catalog-interface/catalog';
import GraphHydrator from '@/components/redux-hydrators/GraphHydrator';

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
    const nodeModel = await model?.get(node_id);
    const edges = await model?.getAdjacent(node_id);

    if (!nodeModel || !edges) {
        notFound();
    }

    const serializedBaseNode = nodeModel.serialize();
    const serializedEdges = edges.map(e => e.serialize());
    const graphKey = catalog.deserialize(serializedBaseNode).parsed.id;

    return (
        <div className="flex-1 flex flex-col px-6">
            <SetNavigation title={nodeModel.parsed.id} />
            <GraphHydrator
                graphKey={graphKey}
                serializedEdges={serializedEdges}
            />
            <div className='my-3'>
                <h1 className='text-3xl font-bold text-gray-600'>{nodeModel.parsed.displayName}</h1>
            </div>
            <div className='flex flex-row'>
                <div className="flex flex-col border-r border-slate-400 pr-4 w-1/4">
                    <ExpandedNode node={serializedBaseNode} />
                </div>
                <div className="pl-4 -mt-4">
                    <GraphContainer
                        path={[graphKey]}
                        initialEdges={serializedEdges}
                    />
                </div>
            </div>
        </div>
    )
}
