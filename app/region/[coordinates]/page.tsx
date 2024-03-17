import GenomicRegion from "@/lib/catalog-interface/helpers/GenomicRegion";

export default async function Page({
    params: {
        coordinates,
    },
}: {
    params: {
        coordinates: string;
    };
}) {
    const region = new GenomicRegion(coordinates);
    const nodes = await region.getRegionNodes();

    return (
        <div>
            {JSON.stringify(nodes)}
        </div>
    );
}
