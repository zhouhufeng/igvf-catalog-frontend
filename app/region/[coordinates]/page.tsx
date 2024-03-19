import GraphContainer from "@/components/main-graph/GraphContainer";
import GraphHydrator from "@/components/redux-hydrators/GraphHydrator";
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

    if (!nodes) {
        notFound();
    }

    return (
        <div className="px-6">
            <div className="my-3">
                <h1 className='text-3xl font-bold text-gray-600 line-clamp-1'>Region {coordinates}</h1>
            </div>
            <GraphHydrator
                graphKey={coordinates}
                serializedEdges={nodes}
            />
            <GraphContainer
                path={[coordinates]}
                initialEdges={nodes}
            />
        </div>
    );
}
