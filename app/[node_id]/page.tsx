import NodeTable from '@/components/core-table/NodeTable';
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
        node_id: _node_id,
    },
}: {
    params: {
        node_id: string;
    };
}) {
    const node_id = decodeURIComponent(_node_id);
    const model = catalog.node(node_id);
    const nodeModel = await model?.get(node_id);

    if (!nodeModel) {
        notFound();
    }

    const serializedBaseNode = nodeModel.serialize();

    return (
        <div className="px-6 animate-in fade-in duration-300">
            <SetNavigation title={nodeModel.parsed.id} />
            <div className='my-3 flex flex-row justify-between'>
                <h1 className='text-3xl font-bold text-gray-600 line-clamp-1'>{`${nodeModel.parsed.id !== node_id ? `${node_id} // ` : ""}  ${nodeModel.parsed.displayName}`}</h1>
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
                    <NodeTable node_id={node_id} />
                </div>
            </div>
        </div>
    )
}
