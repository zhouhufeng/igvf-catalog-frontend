import ExpandedNode from '@/components/ExpandedNode';
import FilterDisplay from '@/components/filters/FilterDisplay';
import GraphContainer from '@/components/main-graph/GraphContainer';
import GraphHydrator from '@/components/redux-hydrators/GraphHydrator';
import SetNavigation from "@/components/SetNavigation";
import { catalog } from '@/lib/catalog-interface/catalog';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    const graphKey = nodeModel.parsed.id;

    return (
        <div className="px-6 animate-in fade-in duration-300">
            <SetNavigation title={nodeModel.parsed.id} />
            <GraphHydrator
                graphKey={graphKey}
                serializedEdges={serializedEdges}
            />
            <div className='my-3 flex flex-row justify-between'>
                <h1 className='text-3xl font-bold text-gray-600 line-clamp-1'>{nodeModel.parsed.displayName}</h1>
                <div className='space-x-4'>
                    <Link href={`/${node_id}/live-graph`} className="px-8 py-3 border border-black rounded-full no-underline text-black font-bold">
                        Live Graph
                    </Link>
                    <FilterDisplay />
                </div>
            </div>
            <div className='flex flex-row'>
                <div className="flex flex-col border-r border-slate-400 pr-4">
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
