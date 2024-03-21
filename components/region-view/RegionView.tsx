'use client';

import useDeserializedNode from "@/lib/catalog-interface/hooks/useDeserializedNode";
import { GraphNode } from "@/lib/types/derived-types";
import { useQuery } from '@tanstack/react-query';

export default function RegionView({
    parentNode,
}: {
    parentNode: GraphNode;
}) {
    const model = useDeserializedNode(parentNode);

    const regulatoryRegion = useQuery({
        queryKey: ['regulatoryRegion', model?.parsed.id],
        queryFn: async () => {
            // ...
        },
    })

    return (
        <div>

        </div>
    );
}
