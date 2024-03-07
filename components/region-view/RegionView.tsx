'use client';

import useDeserializedNode from "@/lib/catalog-interface/hooks/useDeserializedNode";
import { GraphNode } from "@/lib/types/derived-types";
import { trpc } from "@/lib/utils/api";

export default function RegionView({
    parentNode,
}: {
    parentNode: GraphNode;
}) {
    const model = useDeserializedNode(parentNode);

    const regulatoryRegion = trpc.regulatoryRegions.useQuery({
        region: "",
    })

    return (
        <div>

        </div>
    );
}
