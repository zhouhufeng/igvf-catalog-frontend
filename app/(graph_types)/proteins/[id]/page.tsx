import SetNavigation from "@/components/SetNavigation";
import GraphService from "@/lib/services/GraphService";
import NodeService from "@/lib/services/NodeService";
import { ProteinSidebar } from "./ProteinSidebar";
import GraphContainer from "../../GraphContainer";

export default async function Page({
    params: { id },
}: {
    params: { id: string; };
}) {
    const proteinData = await NodeService.getProteinData(id);
    const edges = await GraphService.getProteinEdges(id);

    return (
        <div className="flex-1 flex flex-row">
            <SetNavigation title={proteinData._id} />
            <div className="w-1/4">
                <ProteinSidebar data={proteinData} />
            </div>
            <div className="w-3/4">
                <GraphContainer
                    edges={edges}
                    root={{ protein: proteinData }}
                />
            </div>
        </div>
    )
}
