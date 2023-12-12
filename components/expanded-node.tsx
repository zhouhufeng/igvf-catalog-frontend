"use client";

import { GeneNodeData, ProteinNodeData, TranscriptNodeData } from "@/lib/services/NodeService";
import { GeneEnsemblById, GeneGenecardsByName, ProteinUniprotById, ProteinUniprotByName, PubMedLink } from "./extLinks";
import { RsVariant } from "@/lib/utils/db";
import { VariantAnnotation } from "./variant-annotation";
import { GraphNode } from "@/lib/services/GraphService";
import { selectColors, selectDashedTypes, selectEdgeThickness, BASE_THICKNESS } from "@/app/_redux/slices/settingsSlice";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

function GeneNode({
    data
}: {
    data: GeneNodeData;
}) {

    return (
        <div>
            <div className="bg-white p-4 shadow-md rounded-xl">
                <h2 className="text-xl font-semibold">{data.gene_name} <GeneGenecardsByName name={data.gene_name} /></h2>
                <p className="text-gray-500">{data.gene_type || 'Unknown Type'}</p>
                {data.alias && (
                    <div className="mt-2">
                        <p className="text-gray-700">Aliases:</p>
                        <ul className="list-disc pl-4">
                            {data.alias.map((alias, index) => (
                                <li key={index}>
                                    <span className="line-clamp-1">{alias}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <p className="text-gray-600 mt-2"><GeneEnsemblById id={data._id} /></p>
                <p className="text-gray-600">Chromosome: {data.chr}</p>
                <p className="text-gray-600">Start: {data.start || 'N/A'}</p>
                <p className="text-gray-600">End: {data.end || 'N/A'}</p>
                <p className="text-gray-600">Source: {data.source}</p>
            </div>
        </div>
    );
}

function ProteinNode({
    data
}: {
    data: ProteinNodeData;
}) {

    return (
        <div>
            <div className="bg-white p-4 shadow-md rounded-xl">
                <h2 className="text-xl font-semibold">{data.name} <ProteinUniprotByName name={data.name} /></h2>
                {data.dbxrefs && (
                    <div className="mt-2">
                        <p className="text-gray-700">Aliases:</p>
                        <ul className="list-disc pl-4">
                            {data.dbxrefs.map((alias, index) => (
                                <li key={index}>
                                    <span className="line-clamp-1">{alias.name}</span>
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

function TranscriptNode({
    data
}: {
    data: TranscriptNodeData;
}) {

    return (
        <div>
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

function VariantNode({
    data
}: {
    data: RsVariant;
}) {

    return (
        <div>
            <div className="bg-white p-4 shadow-md rounded-xl" key={data._id}>
                <h2 className="text-xl font-semibold">{data.rsid}</h2>
                <p className="text-gray-600">Chromosome: {data.chr}</p>
                <p className="text-gray-600">Position: {data["pos:long"]}</p>
                {data.ref && <p className="text-gray-600">Ref: {data.ref}</p>}
                {data.alt && <p className="text-gray-600">Alt: {data.alt}</p>}
                <div>
                    <VariantAnnotation annotations={data.annotations} />
                </div>
            </div>
        </div>
    );
}

function DrugNode({
    data
}: {
    data: GraphNode['drug']
}) {
    if (!data) return null;

    return (
        <>
            <Link href={`/drugs/${data._id}`}>
                <h1 className="text-2xl font-bold mb-2">{data.drug_name}</h1>
            </Link>
            <div className="text-gray-700 mb-2 truncate">
                <span className="font-bold">Drug Ontology Terms:</span> {data.drug_ontology_terms.join(', ')}
            </div>
            <div className="text-gray-700 mb-2 truncate">
                <span className="font-bold">Source:</span> {data.source}
            </div>
            <div className="text-gray-700 mb-2 truncate">
                <span className="font-bold">Source URL:</span> {data.source_url}
            </div>
        </>
    )
}

function StudyNode({
    data
}: {
    data: GraphNode['study']
}) {
    if (!data) return null;

    return (
        <>
            <Link href={`/studys/${data._id}`}>
                <h1 className="text-2xl font-bold mb-2">{data.trait_reported}</h1>
            </Link>
            <div className="text-gray-700 mb-2 truncate">
                <span className="font-bold">Title:</span> {data.pub_title}
            </div>
            <div className="text-gray-700 mb-2 truncate">
                <span className="font-bold">Journal:</span> {data.pub_journal}
            </div>
            <div className="text-gray-700 mb-2 truncate">
                <span className="font-bold">Source:</span> {data.source}
            </div>
            <div className="text-gray-700 mb-2 truncate">
                <PubMedLink pmid={data.pmid} />
            </div>
        </>
    )
}

export default function ExpandedNode({
    node
}: {
    node: GraphNode;
}) {
    const [outlineColor, setOutlineColor] = useState("rgb(148 163 184)");
    const [dashed, setDashed] = useState(false);
    const [edgeThickness, setEdgeThickness] = useState(1);
    const [hovering, setHovering] = useState(false);

    const _colorMap = useSelector(selectColors);
    const _dashedTypes = useSelector(selectDashedTypes);
    const _edgeThickness = useSelector(selectEdgeThickness);
    const key = Object.keys(node)[0] as keyof GraphNode;

    useEffect(() => {
        if (!_colorMap[key]) return setOutlineColor("rgb(148 163 184)");
        setOutlineColor(_colorMap[key]);
        setDashed(_dashedTypes.includes(key));
        setEdgeThickness(_edgeThickness);
    }, [_colorMap, _dashedTypes, _edgeThickness, key]);

    return (
        <div
            className="bg-white rounded-lg shadow-lg p-4 m-1 w-72 hover:shadow-xl"
            style={{
                outlineColor,
                outlineStyle: dashed ? 'dashed' : 'solid',
                outlineWidth: (edgeThickness / BASE_THICKNESS) + (hovering ? 0.5 : 0) + 0.5
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {(() => {
                if (node.gene) return <GeneNode data={node.gene} />;
                if (node.protein) return <ProteinNode data={node.protein} />;
                if (node.transcript) return <TranscriptNode data={node.transcript} />;
                if (node.drug) return <DrugNode data={node.drug} />;
                if (node.study) return <StudyNode data={node.study} />;
                if (node.variant) return <VariantNode data={node.variant} />;

                return null;
            })()}
        </div>
    )
}