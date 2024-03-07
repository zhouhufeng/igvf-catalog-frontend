"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

import { GeneNodeData, ProteinNodeData, TranscriptNodeData, VariantNodeData } from "@/lib/types/derived-types";
import { DiseaseSourceLink, GeneEnsemblById, GeneGenecardsByName, ProteinUniprotById, ProteinUniprotByName, PubMedLink } from "./ui/extLinks";
import { VariantAnnotation } from "./VariantAnnotation";
import { GraphNode } from "@/lib/types/derived-types";
import { selectColors, selectDashedTypes, selectEdgeThickness, BASE_THICKNESS } from "@/app/_redux/slices/settingsSlice";

function GeneNodeDisplay({
    data
}: {
    data: GeneNodeData;
}) {

    return (
        <div>
            <div className="bg-white">
                <h2 className="text-xl font-semibold">{data.gene_name} <GeneGenecardsByName name={data.gene_name} /></h2>
                <p className="text-gray-500 truncate">{data.gene_type || 'Unknown Type'}</p>
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

function ProteinNodeDisplay({
    data
}: {
    data: ProteinNodeData;
}) {

    return (
        <div>
            <div className="bg-white">
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

function TranscriptNodeDisplay({
    data
}: {
    data: TranscriptNodeData;
}) {

    return (
        <div>
            <div className="bg-white">
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

function VariantNodeDisplay({
    data
}: {
    data: VariantNodeData;
}) {

    return (
        <div>
            <div className="bg-white" key={data._id}>
                <h2 className="text-xl font-semibold">{data.rsid}</h2>
                <p className="text-gray-600">Chromosome: {data.chr}</p>
                <p className="text-gray-600">Position: {data.pos}</p>
                {data.ref && <p className="text-gray-600">Ref: {data.ref}</p>}
                {data.alt && <p className="text-gray-600">Alt: {data.alt}</p>}
                <div>
                    <VariantAnnotation annotations={data.annotations} />
                </div>
            </div>
        </div>
    );
}

function DrugNodeDisplay({
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
                <span className="font-bold">Drug Ontology Terms:</span> {data.drug_ontology_terms?.join(', ')}
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

function StudyNodeDisplay({
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
                <PubMedLink pmid={data.pmid || ""} />
            </div>
        </>
    )
}

function DiseaseNodeDisplay({
    data
}: {
    data: GraphNode['disease']
}) {
    if (!data) return null;

    return (
        <>
            <div className="bg-white space-y-4">
                {data.gene ? <h2 className="font-bold text-gray-600">
                    Linked to gene&nbsp;
                    <Link href={`/${data.gene._id}`}>
                        {data.gene.gene_name}
                    </Link>
                </h2> : null}
                <h2 className="font-bold text-gray-600">Association Type: {data.association_type}</h2>
                <h2 className="font-bold text-gray-600">Association Status: {data.association_status}</h2>
                <h2 className="font-bold text-gray-600">Ontology: {data.term_id}</h2>
                {data.source && <h2 className="font-bold text-gray-600">Source: <DiseaseSourceLink source={data.source} /></h2>}
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
            className="bg-white rounded-lg shadow-lg p-4 m-1 hover:shadow-xl w-[18vw]"
            style={{
                outlineColor,
                outlineStyle: dashed ? 'dashed' : 'solid',
                outlineWidth: (edgeThickness / BASE_THICKNESS) + (hovering ? 0.5 : 0) + 0.5,
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {(() => {
                if (node.gene) return <GeneNodeDisplay data={node.gene} />;
                if (node.protein) return <ProteinNodeDisplay data={node.protein} />;
                if (node.transcript) return <TranscriptNodeDisplay data={node.transcript} />;
                if (node.drug) return <DrugNodeDisplay data={node.drug} />;
                if (node.study) return <StudyNodeDisplay data={node.study} />;
                if (node.variant) return <VariantNodeDisplay data={node.variant} />;
                if (node.disease) return <DiseaseNodeDisplay data={node.disease} />;

                return null;
            })()}
        </div>
    )
}
