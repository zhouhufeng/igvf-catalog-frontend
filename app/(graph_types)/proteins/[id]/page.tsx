import SetNavigation from "@/components/SetNavigation";
import GraphService from "@/lib/services/GraphService";
import NodeService from "@/lib/services/NodeService";
import { api } from "@/utils/trpc";

export default async function Page({
    params: { id },
}: {
    params: { id: string; };
}) {
    const proteinData = await NodeService.getProteinData(id);
    const edges = await GraphService.getProteinEdges(id);

    return (
        <div>
            <SetNavigation title={proteinData._id} />
            <h1 className="text-3xl font-medium">{proteinData.name}</h1>
        </div>
    )
}
