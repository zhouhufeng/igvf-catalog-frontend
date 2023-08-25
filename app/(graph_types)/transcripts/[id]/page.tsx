import SetNavigation from "@/components/SetNavigation";
import GraphService from "@/lib/services/GraphService";
import NodeService from "@/lib/services/NodeService";
import { api } from "@/utils/trpc";

export default async function Page({
    params: { id },
}: {
    params: { id: string; };
}) {
    const transcriptData = await NodeService.getTranscriptData(id);
    const edges = await GraphService.getTranscriptEdges(id);

    return (
        <div>
            <SetNavigation title={transcriptData._id} />
            <h1 className="text-3xl font-medium">{transcriptData.transcript_name}</h1>
        </div>
    )
}
