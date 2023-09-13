"use client";

import useLayout from "@/lib/hooks/useLayout";
import { RsVariant } from "@/utils/db";
import { VariantAnnotation } from "./VariantAnnotation";

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
            <h1 className="text-3xl font-medium pb-6">Variant</h1>
            {variants.map((v) => (
                <div className="bg-white p-4 shadow-md rounded-xl" key={v._id}>
                    <h2 className="text-xl font-semibold">{v.rsid}</h2>
                    {/* <p className="text-gray-600">Annotations: {JSON.stringify(v.annotations)}</p> */}
                    <p className="text-gray-600">Chromosome: {v.chr}</p>
                    <p className="text-gray-600">Position: {v["pos:long"]}</p>
                    {v.ref && <p className="text-gray-600">Ref: {v.ref}</p>}
                    {v.alt && <p className="text-gray-600">Alt: {v.alt}</p>}
                    <div>
                        <VariantAnnotation annotations={v.annotations} />
                    </div>
                </div>
            ))}
        </div>
    );
}
