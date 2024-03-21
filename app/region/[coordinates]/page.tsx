import GraphContainer from "@/components/main-graph/GraphContainer";
import GraphHydrator from "@/components/redux-hydrators/GraphHydrator";
import RegulatoryGraph from "@/components/regulatory-table/RegulatoryGraph";
import GenomicRegion, { normalizeRegionString } from "@/lib/catalog-interface/helpers/GenomicRegion";
import { notFound } from "next/navigation";

export default async function Page({
    params: {
        coordinates: originalCoordinates,
    },
}: {
    params: {
        coordinates: string;
    };
}) {
    const coordinates = normalizeRegionString(originalCoordinates);

    const region = new GenomicRegion(coordinates);
    const nodes = await region.getRegionNodes();
    const regions = await region.getRegulatoryRegions();

    if (!nodes) {
        notFound();
    }

    return (
        <div className="px-6 animate-in fade-in duration-300">
            <div className="my-3">
                <h1 className='text-3xl font-bold text-gray-600 line-clamp-1'>Region {coordinates}</h1>
            </div>
            <div className="border-t border-t-gray-600 my-4"></div>
            <h1 className="text-xl font-bold text-gray-600 mb-4">Regulatory Regions</h1>
            <div className="flex flex-row">
                <div className="pl-4">
                    <RegulatoryGraph
                        regions={regions}
                        stateKey={coordinates}
                    />
                </div>
            </div>
            <div className="border-t border-t-gray-600 my-4"></div>
            <h1 className="text-xl font-bold text-gray-600 mb-4">Objects in Region</h1>
            <div className="flex flex-row">
                <div className="pl-4">
                    <GraphContainer
                        path={[coordinates]}
                        initialEdges={nodes}
                    />
                </div>
            </div>
            <GraphHydrator
                graphKey={coordinates}
                serializedEdges={nodes}
            />
        </div>
    );
}
