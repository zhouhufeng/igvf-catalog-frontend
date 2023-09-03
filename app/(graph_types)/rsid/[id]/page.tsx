import { notFound } from 'next/navigation';

import SetNavigation from "@/components/SetNavigation";
import { RsVariant, getVariantByRsid } from "@/utils/db";
import { RsidSidebar } from "./RsidSidebar";
import GraphService from "@/lib/services/GraphService";
import GraphContainer from "../../GraphContainer";

export default async function RsidPage({
    params: { id },
}: {
    params: { id: string; };
}) {
    const rsData: RsVariant[] = await getVariantByRsid(id);

    if (!rsData.length) {
        notFound();
    }

    const rsEdgePromises = rsData.map(rsid => GraphService.getRsidEdges(rsid._id))

    const rsEdges = await Promise.all(rsEdgePromises);

    if (!rsEdges) {
        notFound();
    }

    return (
        <div className="flex-1 flex flex-row">
            <SetNavigation title={id} />
            <div className="w-1/4">
                <RsidSidebar
                    variants={rsData}
                    rsid={id}
                />
            </div>
            <div className="w-3/4">
                {rsData.map((rsVariant, index) => {
                    const edges = rsEdges[index] || [];

                    return (
                        <div>
                            <GraphContainer
                                key={rsVariant._id}
                                edges={edges}
                                root={{ variant: rsVariant }}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
