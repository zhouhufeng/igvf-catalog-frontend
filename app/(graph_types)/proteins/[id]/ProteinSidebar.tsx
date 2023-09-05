"use client";

import { GeneEnsemblById, GeneGenecardsByName, ProteinUniprotById, ProteinUniprotByName } from "@/components/extLinks";
import useLayout from "@/lib/hooks/useLayout";
import { ProteinNodeData } from "@/lib/services/NodeService";

export function ProteinSidebar({
    data
}: {
    data: ProteinNodeData;
}) {
    const { contentHeight } = useLayout();

    return (
        <div className="flex flex-col border-r border-slate-400 pt-6 pr-6 pl-6" style={{ height: contentHeight, }}>
            <h1 className="text-3xl font-medium pb-6">Protein {data.name}</h1>
            <div className="bg-white p-4 shadow-md rounded-xl">
                <h2 className="text-xl font-semibold">{data.name} <ProteinUniprotByName name={data.name} /></h2>
                {data.dbxrefs && (
                    <div className="mt-2">
                        <p className="text-gray-700">Aliases:</p>
                        <ul className="list-disc pl-4">
                            {data.dbxrefs.map((alias, index) => (
                                <li key={index}>
                                    <span className="line-clamp-1">{alias}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <p className="text-gray-600 mt-2"><ProteinUniprotById id={data._id} /></p>
                <p className="text-gray-600">Data source: <a href={data.source_url}>{data.source}</a></p>
            </div>
        </div>
    );
}
