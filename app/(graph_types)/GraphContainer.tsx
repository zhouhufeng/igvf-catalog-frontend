"use client";

import { GraphNode } from "@/lib/services/GraphService";
import { ArcherContainer, ArcherElement } from 'react-archer';

function GeneNode({
  gene
}: {
  gene: GraphNode['gene']
}) {


  return (
    <h1>Gene Node</h1>
  );
}

function ProteinNode({
  protein
}: {
  protein: GraphNode['protein']
}) {


  return (
    <h1>Protein Node</h1>
  );
}

function TranscriptNode({
  transcript
}: {
  transcript: GraphNode['transcript']
}) {


  return (
    <h1>Transcript Node</h1>
  );
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
        <div>
          <div>
            {/* display the current node... */}
          </div>
          {/* ArcherElement... */}
          <div>
            {genes.length > 0 ? (
              <div className="mb-2">
                <h2 className="text-2xl">Genes</h2>
                {genes.map(e => <GeneNode key={e.gene?._id} gene={e.gene} />)}
              </div>
            ) : null}
            {proteins.length > 0 ? (
              <div className="mb-2">
                <h2 className="text-2xl">Proteins</h2>
                {proteins.map(e => <ProteinNode key={e.protein?._id} protein={e.protein} />)}
              </div>
            ) : null}
            {transcripts.length > 0 ? (
              <div className="mb-2">
                <h2 className="text-2xl">Transcripts</h2>
                {transcripts.map(e => <TranscriptNode key={e.transcript?._id} transcript={e.transcript} />)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </ArcherContainer>
  );
}
