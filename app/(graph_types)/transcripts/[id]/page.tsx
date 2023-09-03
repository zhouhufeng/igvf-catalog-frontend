import { notFound } from 'next/navigation';

import SetNavigation from "@/components/SetNavigation";
import GraphService from "@/lib/services/GraphService";
import NodeService from "@/lib/services/NodeService";
import { TranscriptSidebar } from "./TranscriptSidebar";
import GraphContainer from "../../GraphContainer";

export default async function Page({
    params: { id },
}: {
    params: { id: string; };
}) {
    const transcriptData = await NodeService.getTranscriptData(id);
    const edges = await GraphService.getTranscriptEdges(id);

    if (!transcriptData || !edges) {
        notFound();
    }

    return (
        <div className="flex-1 flex flex-row">
            <SetNavigation title={transcriptData._id} />
            <div className="w-1/4">
                <TranscriptSidebar data={transcriptData} />
            </div>
            <div className="w-3/4">
                <GraphContainer
                    edges={edges}
                    root={{ transcript: transcriptData }}
                />
            </div>
        </div>
    )
}
