"use client";

import { GeneEnsemblById, ProteinUniprotById, PubMedLink } from "@/components/extLinks";
import { GraphNode } from "@/lib/services/GraphService";
import { NodeType, NodeTypes } from "@/lib/services/NodeService";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArcherContainer, ArcherElement } from 'react-archer';
import { useSelector } from "react-redux";
import { BASE_THICKNESS, selectColors, selectDashedTypes, selectEdgeThickness } from "../app/_redux/slices/settingsSlice";
import ExpandedNode from "./expanded-node";

export default function GraphContainer({
  edges,
  root
}: {
  edges: GraphNode[];
  root: GraphNode;
}) {
  const colorMap = useSelector(selectColors);
  const dashedTypes = useSelector(selectDashedTypes);
  const edgeThickness = useSelector(selectEdgeThickness);

  const genes = edges.filter((edge) => edge.gene);
  const proteins = edges.filter((edge) => edge.protein);
  const transcripts = edges.filter((edge) => edge.transcript);
  const drugs = edges.filter((edge) => edge.drug);
  const studies = edges.filter((edge) => edge.study);

  const [openType, setOpenType] = useState<NodeType | null>(null);

  const handleCloseType = () => {
    window.location.hash = "";
  }

  const handleSetType = (type: NodeType) => {
    window.location.hash = type;
  }

  const [
    geneStrokeWidth,
    proteinStrokeWidth,
    transcriptStrokeWidth,
    drugStrokeWidth,
    studyStrokeWidth,
  ] = calculateStrokeWidths(
    [
      genes.length,
      proteins.length,
      transcripts.length,
      drugs.length,
      studies.length,
    ],
    edgeThickness / BASE_THICKNESS
  );

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.length === 0) return setOpenType(null);

      const hashContent = window.location.hash.substr(1);
      if (!(NodeTypes).includes(hashContent as any)) return setOpenType(null);
      setOpenType(hashContent as NodeType);
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (openType) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-medium pb-6">Graph</h1>
        <div>
          {(() => {
            if (openType === "gene") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Genes</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {genes.map(n => <ExpandedNode key={n.gene?._id} node={n} />)}
                  </div>
                </div>
              )
            }

            if (openType === "protein") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Proteins</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {proteins.map(n => <ExpandedNode key={n.protein?._id} node={n} />)}
                  </div>
                </div>
              )
            }

            if (openType === "transcript") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Transcripts</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {transcripts.map(n => <ExpandedNode key={n.transcript?._id} node={n} />)}
                  </div>
                </div>
              )
            }

            if (openType === "drug") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Drugs</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {drugs.map(n => <ExpandedNode key={n.drug?._id} node={n} />)}
                  </div>
                </div>
              )
            }

            if (openType === "study") {
              return (
                <div className="mb-6">
                  <div className="flex flex-row items-center gap-x-4">
                    <BackButton onClick={handleCloseType} />
                    <h2 className="text-2xl">Studies</h2>
                  </div>
                  <div className="grid grid-cols-3">
                    {studies.map(n => <ExpandedNode key={n.study?._id} node={n} />)}
                  </div>
                </div>
              )
            }

            return null;
          })()}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-scroll noScrollbar">
      <ArcherContainer>
        <div className="p-6">
          <h1 className="text-3xl font-medium pb-6">Graph</h1>
          <div className="flex flex-row items-center gap-x-20">
            <ArcherElement
              id="rootNode"
              relations={[
                {
                  "targetId": "geneContainer",
                  "targetAnchor": "left",
                  "sourceAnchor": "right",
                  "style": {
                    "strokeColor": colorMap['gene'] || 'black',
                    "strokeWidth": geneStrokeWidth,
                    "strokeDasharray": dashedTypes.includes('gene') ? '5,5' : undefined
                  }
                },
                {
                  "targetId": "proteinContainer",
                  "targetAnchor": "left",
                  "sourceAnchor": "right",
                  "style": {
                    "strokeColor": colorMap['protein'] || 'black',
                    "strokeWidth": proteinStrokeWidth,
                    "strokeDasharray": dashedTypes.includes('protein') ? '5,5' : undefined
                  }
                },
                {
                  "targetId": "transcriptContainer",
                  "targetAnchor": "left",
                  "sourceAnchor": "right",
                  "style": {
                    "strokeColor": colorMap['transcript'] || 'black',
                    "strokeWidth": transcriptStrokeWidth,
                    "strokeDasharray": dashedTypes.includes('transcript') ? '5,5' : undefined
                  }
                },
                {
                  "targetId": "drugContainer",
                  "targetAnchor": "left",
                  "sourceAnchor": "right",
                  "style": {
                    "strokeColor": colorMap['drug'] || 'black',
                    "strokeWidth": drugStrokeWidth,
                    "strokeDasharray": dashedTypes.includes('drug') ? '5,5' : undefined
                  }
                },
                {
                  "targetId": "studyContainer",
                  "targetAnchor": "left",
                  "sourceAnchor": "right",
                  "style": {
                    "strokeColor": colorMap['study'] || 'red',
                    "strokeWidth": studyStrokeWidth,
                    "strokeDasharray": dashedTypes.includes('study') ? '5,5' : undefined
                  }
                }
              ]}
            >
              <div>
                <ExpandedNode node={root} />
              </div>
            </ArcherElement>
            <div>
              {genes.length > 0 ? (
                <ArcherElement
                  id="geneContainer"
                  relations={[
                    {
                      targetId: 'root',
                      targetAnchor: 'right',
                      sourceAnchor: 'left',
                    },
                  ]}
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Genes ({genes.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('gene')} />
                      <TableButton type="gene" />
                    </div>
                    <div className="flex flex-row">
                      {genes.map(n => <ExpandedNode key={n.gene?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
              {proteins.length > 0 ? (
                <ArcherElement
                  id="proteinContainer"
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Proteins ({proteins.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('protein')} />
                      <TableButton type="protein" />
                    </div>
                    <div className="flex flex-row">
                      {proteins.map(n => <ExpandedNode key={n.protein?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
              {transcripts.length > 0 ? (
                <ArcherElement
                  id="transcriptContainer"
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Transcripts ({transcripts.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('transcript')} />
                      <TableButton type="transcript" />
                    </div>
                    <div className="flex flex-row">
                      {transcripts.map(n => <ExpandedNode key={n.transcript?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
              {drugs.length > 0 ? (
                <ArcherElement
                  id="drugContainer"
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Drugs ({drugs.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('drug')} />
                      <TableButton type="drug" />
                    </div>
                    <div className="flex flex-row">
                      {drugs.map(n => <ExpandedNode key={n.drug?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
              {studies.length > 0 ? (
                <ArcherElement
                  id="studyContainer"
                >
                  <div className="mb-6">
                    <div className="flex flex-row items-center gap-x-4">
                      <h2 className="text-2xl">Studies ({studies.length})</h2>
                      <ExpandIcon onClick={() => handleSetType('study')} />
                    </div>
                    <div className="flex flex-row">
                      {studies.map(n => <ExpandedNode key={n.study?._id} node={n} />)}
                    </div>
                  </div>
                </ArcherElement>
              ) : null}
            </div>
          </div>
        </div>
      </ArcherContainer>
    </div>
  );
}

function TableButton({
  type
}: {
  type: NodeType;
}) {
  const pathname = usePathname();

  let basepath = pathname;

  if (pathname.split('/').length > 3) {
    basepath = pathname.split('/').slice(0, 3).join('/');
  }

  return (
    <Link href={`${basepath}/${type}`} className="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
      </svg>
    </Link>
  );
}

function ExpandIcon({
  onClick
}: {
  onClick: () => void;
}) {


  return (
    <div onClick={onClick} className="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
      </svg>
    </div>
  );
}

function BackButton({
  onClick
}: {
  onClick: () => void;
}) {


  return (
    <div onClick={onClick} className="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg>
    </div>
  );
}

function calculateStrokeWidths(lengths: number[], scale: number = 1): number[] {
  const min = 1;
  const max = 4;

  const mid = (min + max) / 2;
  const delta = (max - min) / 2;

  const minLen = Math.min(...lengths);
  const maxLen = Math.max(...lengths);

  const diff = maxLen - minLen;

  if (diff === 0) return lengths.map(() => mid);

  return lengths.map((len) => {
    const ratio = (len - minLen) / diff;
    return min + ratio * delta * scale;
  });
}
