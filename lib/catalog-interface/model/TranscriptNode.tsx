import { GeneNodeData, GraphNode, ProteinNodeData, TranscriptNodeData } from "@/lib/types/derived-types";
import { GetAdjacentOptions, ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";
import BaseNode from "./_BaseNode";

export default class TranscriptNode extends BaseNode {
    data: TranscriptNodeData;
    parsed: ParsedProperties;
    constructor(data: TranscriptNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data._id,
            displayName: "Transcript " + this.data._id,
        }
    }

    serialize(): GraphNode {
        return {
            transcript: this.data
        }
    }

    static async get(id: string): Promise<BaseNode | null> {
        try {
            let transcripts = await api.transcripts.query({ transcript_id: id });

            return new TranscriptNode(Array.isArray(transcripts) ? transcripts[0] : transcripts);
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(
        id: string,
        options?: GetAdjacentOptions
    ): Promise<BaseNode[] | null> {
        try {
            const queries = {
                gene: () => api.genesFromTranscripts.query({ transcript_id: id, verbose: "true", page: options?.page })
                    .then(genes => genes.map(gene => ({ gene: gene.gene as unknown as GeneNodeData }))),
                protein: () => api.proteinsFromTranscripts.query({ transcript_id: id, verbose: "true", page: options?.page })
                    .then(proteins => proteins.map(protein => ({ protein: protein.protein as unknown as ProteinNodeData })))
            };

            const results = await Promise.all(
                Object.entries(queries)
                    .filter(([type]) => !options?.type || options.type === type)
                    .map(([, query]) => query())
            );

            return results.flat().map(catalog.deserialize);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async query({
        region
    }: {
        region: string;
    }) {
        const transcripts = await api.transcripts.query({ region }).then(v => (v as any[]).map(n => ({ transcript: n })));

        return transcripts.map(catalog.deserialize);
    }

    static getTableColumns() {
        const columnHelper = createColumnHelper<TranscriptNodeData & { [key: string]: any; }>();

        return [
            columnHelper.accessor('region', {
                header: () => <span>Region</span>,
                cell: ({ row: { original } }) => {
                    const converted = `${original.chr}:${original.start}-${original.end}`;
                    return <Link href={`/region/${converted}`} className="underline text-brand">
                        {converted}
                    </Link>
                }
            }),
            columnHelper.accessor('_id', {
                header: () => <span>Transcript ID</span>,
                cell: (cell) =>
                    <Link href={"/" + cell.getValue()} className="underline text-brand">
                        {cell.getValue()}
                    </Link>
            }),
            columnHelper.accessor('transcript_name', {
                header: () => <span>Transcript Name</span>,
            }),
            columnHelper.accessor("gene_name", {
                header: () => <span>Gene Name</span>,
                cell: (cell) =>
                    <Link href={"/" + cell.getValue()} className="underline text-brand">
                        {cell.getValue()}
                    </Link>
            }),
            columnHelper.accessor("source", {
                header: () => <span>Source</span>,
                cell: ({ row: { original } }) =>
                    original.source_url ? (
                        <a href={original.source_url} target="_blank" className="underline text-brand">{original.source}</a>
                    ) : original.source
            }),
            columnHelper.accessor("version", {
                header: () => <span>Version</span>,
            }),
        ]
    }
}
