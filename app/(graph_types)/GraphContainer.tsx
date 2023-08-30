"use client";

import { GraphNode } from "@/lib/services/GraphService";
import { ArcherContainer, ArcherElement } from 'react-archer';
import { RelationType } from "react-archer/lib/types";

function GeneNodeContent({
  gene
}: {
  gene: GraphNode['gene']
}) {
  if (!gene) return null;

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{gene.gene_name}</h1>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Gene Type:</span> {gene.gene_type ?? 'Unknown'}
      </div>
      {/* {gene.alias && (
        <div className="text-gray-700 mb-2">
          <span className="font-bold">Alias:</span> {gene.alias.join(', ')}
        </div>
      )} */}
      <div className="text-gray-700 mb-2">
        <span className="font-bold">ID:</span> {gene._id}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Chromosome:</span> {gene.chr}
      </div>
      {gene.start != null && gene.end != null && (
        <div className="text-gray-700 mb-2">
          <span className="font-bold">Start:</span> {gene.start} <span className="font-bold">End:</span> {gene.end}
        </div>
      )}
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Source:</span> {gene.source}
      </div>
    </>
  );
}

function ProteinNodeContent({
  protein
}: {
  protein: GraphNode['protein']
}) {
  if (!protein) return null;

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{protein.name}</h1>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">ID:</span> {protein._id}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Source:</span> {protein.source}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Source URL:</span> {protein.source_url}
      </div>
      {/* {protein.dbxrefs && (
        <div className="text-gray-700 mb-2">
          <span className="font-bold">DB Xrefs:</span> {protein.dbxrefs.join(', ')}
        </div>
      )} */}
    </>
  );
}

function TranscriptNodeContent({
  transcript
}: {
  transcript: GraphNode['transcript']
}) {
  if (!transcript) return null;

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{transcript.transcript_name}</h1>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Gene Name:</span> {transcript.gene_name}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">ID:</span> {transcript._id}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Transcript Type:</span> {transcript.transcript_type}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Chromosome:</span> {transcript.chr}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Start:</span> {transcript.start}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">End:</span> {transcript.end}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Source:</span> {transcript.source}
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-bold">Version:</span> {transcript.version}
      </div>
    </>
  );
}

function DisplayGraphNode({
  node
}: {
  node: GraphNode;
}) {

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-black m-1">
      {(() => {
        if (node.gene) return <GeneNodeContent gene={node.gene} />
        if (node.protein) return <ProteinNodeContent protein={node.protein} />
        if (node.transcript) return <TranscriptNodeContent transcript={node.transcript} />

        return null;
      })()}
    </div>
  )
}

export default function GraphContainer({
  edges,
  root
}: {
  edges: GraphNode[];
  root: GraphNode;
}) {
  const genes = edges.filter((edge) => edge.gene);
  const proteins = edges.filter((edge) => edge.protein);
  const transcripts = edges.filter((edge) => edge.transcript);

  return (
    <ArcherContainer>
      <div className="p-6">
        <h1 className="text-3xl font-medium pb-6">Graph</h1>
        <div className="flex flex-row items-center gap-x-60">
          <ArcherElement
            id="rootNode"
            relations={[
              // {
              //   targetId: 'geneContainer',
              //   targetAnchor: 'left',
              //   sourceAnchor: 'right',
              // },
              {
                targetId: 'proteinContainer',
                targetAnchor: 'left',
                sourceAnchor: 'right',
                style: { strokeColor: 'black' }
              },
              {
                targetId: 'transcriptContainer',
                targetAnchor: 'left',
                sourceAnchor: 'right',
                style: { strokeColor: 'black' }
              },
            ]}
          >
            <div>
              <DisplayGraphNode node={root} />
            </div>
          </ArcherElement>
          <div className="gap-y-2">
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
                <div>
                  <h2 className="text-2xl">Genes</h2>
                  <div className="flex flex-row">
                    {genes.map(n => <DisplayGraphNode key={n.gene?._id} node={n} />)}
                  </div>
                </div>
              </ArcherElement>
            ) : null}
            {proteins.length > 0 ? (
              <ArcherElement
                id="proteinContainer"
              >
                <div>
                  <h2 className="text-2xl">Proteins</h2>
                  <div className="flex flex-row">
                    {proteins.map(n => <DisplayGraphNode key={n.protein?._id} node={n} />)}
                  </div>
                </div>
              </ArcherElement>
            ) : null}
            {transcripts.length > 0 ? (
              <ArcherElement
                id="transcriptContainer"
              >
                <div>
                  <h2 className="text-2xl">Transcripts</h2>
                  <div className="flex flex-row">
                    {transcripts.map(n => <DisplayGraphNode key={n.transcript?._id} node={n} />)}
                  </div>
                </div>
              </ArcherElement>
            ) : null}
          </div>
        </div>
      </div>
    </ArcherContainer>
  );
}
