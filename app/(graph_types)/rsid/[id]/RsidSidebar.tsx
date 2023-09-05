"use client";

import useLayout from "@/lib/hooks/useLayout";
import { RsVariant } from "@/utils/db";

export default function RsidSidebar({
    variants,
    rsid
}: {
    variants: RsVariant[];
    rsid: string;
}) {
    const { contentHeight } = useLayout();

    return (
        <div className="flex flex-col border-r border-slate-400 pt-6 pr-6 pl-6" style={{ height: contentHeight, }}>
            <h1 className="text-3xl font-medium pb-6">{rsid} variants</h1>
            {variants.map((v) => (
                <div className="bg-white p-4 shadow-md rounded-xl" key={v._id}>
                    <h2 className="text-xl font-semibold">{v.rsid}</h2>
                    {/* <p className="text-gray-600">Annotations: {JSON.stringify(v.annotations)}</p> */}
                    <p className="text-gray-600">Chromosome: {v.chr}</p>
                    <p className="text-gray-600">Position: {v["pos:long"]}</p>
                </div>
            ))}
        </div>
    );
}
