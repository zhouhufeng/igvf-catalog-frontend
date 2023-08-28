import SetNavigation from "@/components/SetNavigation";
import GraphService from "@/lib/services/GraphService";
import NodeService from "@/lib/services/NodeService";
import { api } from "@/utils/trpc";
import { GeneSidebar } from "./GeneSidebar";
import GraphContainer from "../../GraphContainer";

export default async function Page({
    params: { id },
}: {
    params: { id: string; };
}) {
    const geneData = await NodeService.getGeneData(id);
    const edges = await GraphService.getGeneEdges(id);

    return (
        <div className="flex-1 flex flex-row">
            <SetNavigation title={geneData._id} />
            <GeneSidebar data={geneData} />
            <GraphContainer
                edges={edges}
                root={{ gene: geneData }}
            />
        </div>
    )
}
