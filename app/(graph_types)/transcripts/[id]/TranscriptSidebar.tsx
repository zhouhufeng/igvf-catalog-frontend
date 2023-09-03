"use client";

import { GeneEnsemblById, GeneGenecardsByName } from "@/components/extLinks";
import useLayout from "@/lib/hooks/useLayout";
import { TranscriptNodeData } from "@/lib/services/NodeService";

export function TranscriptSidebar({
    data
}: {
    data: TranscriptNodeData;
}) {
    const { contentHeight } = useLayout();

    return (
        <div className="flex flex-col border-r border-slate-400 pt-6 pr-6 pl-6" style={{ height: contentHeight, }}>
            <h1 className="text-3xl font-medium pb-6">Transcript {data.gene_name}</h1>
            <div className="bg-white p-4 shadow-md rounded-xl">
                <p className="text-gray-600">Type: {data.transcript_type || 'Unknown Type'}</p>
                <p className="text-gray-600 mt-2"><GeneEnsemblById id={data._id} /></p>
                <p className="text-gray-600">Chromosome: {data.chr}</p>
                <p className="text-gray-600">Start: {data.start || 'N/A'}</p>
                <p className="text-gray-600">End: {data.end || 'N/A'}</p>
                <p className="text-gray-600">Source: {data.source}</p>
                <p className="text-gray-600">Version: {data.version}</p>
            </div>
        </div>
    );
}
