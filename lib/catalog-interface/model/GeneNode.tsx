import { GeneNodeData, GraphNode, OntologyTerm, TranscriptNodeData } from "@/lib/types/derived-types";
import { GetAdjacentOptions, ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";
import { single } from "@/lib/utils/utils";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";
import BaseNode from "./_BaseNode";

export default class GeneNode extends BaseNode {
    data: GeneNodeData;
    parsed: ParsedProperties;
    constructor(data: GeneNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data._id,
            displayName: "Gene " + this.data.gene_name,
        }
    }

    serialize(): GraphNode {
        return {
            gene: this.data
        }
    }

    static async get(id: string): Promise<GeneNode | null> {
        try {
            let genes = await api.genes.query({ gene_id: id });

            return new GeneNode(Array.isArray(genes) ? genes[0] : genes)
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
                protein: () => api.proteinsFromGenes.query({ gene_id: id, page: options?.page }).then(proteins => proteins.map(protein => ({ protein }))),
                transcript: () => api.transcriptsFromGenes.query({ gene_id: id, verbose: "true", page: options?.page }).then(transcripts => transcripts.map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] }))),
                disease: () => api.diseasesFromGenes.query({ gene_id: id, verbose: "true", page: options?.page }).then(diseases => diseases.map(disease => ({ disease: { ...disease, ...single(disease['ontology term'] as unknown as OntologyTerm[]) } }))),
                variant: () => api.variantsFromGenes.query({ gene_id: id, verbose: "true", page: options?.page }).then(variants => variants.map(variant => ({ variant: variant["sequence variant"] })))
            };

            const results = await Promise.all(
                Object.entries(queries)
                    .filter(([type]) => !options?.type || options.type === type)
                    .map(([, query]) => query())
            );

            // @ts-ignore
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
        const genes = await api.genes.query({ region }).then(v => (v as any[]).map(n => ({ gene: n })));

        return genes.map(catalog.deserialize);
    }

    static getTableColumns() {
        const columnHelper = createColumnHelper<GeneNodeData & { [key: string]: any; }>();

        return [
            columnHelper.accessor('region', {
                header: () => <span>Region</span>,
                cell: ({ row: { original } }) => {
                    const start = original.start || original['start:long'];
                    const end = original.end || original['end:long'];
                    const converted = `${original.chr}:${start}-${end}`;
                    return <Link href={`/region/${converted}`} className="underline text-brand">
                        {converted}
                    </Link>
                }
            }),
            columnHelper.accessor('gene_name', {
                header: () => <span>Name</span>,
            }),
            columnHelper.accessor("gene_type", {
                header: () => <span>Type</span>
            }),
            columnHelper.accessor("hgnc", {
                header: () => <span>HGNC</span>,
                cell: ({ row: { original } }) => original.hgnc?.split(":")[1]
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
            columnHelper.accessor("alias", {
                header: () => <span>Aliases</span>,
                cell: ({ row: { original } }) => original.alias?.join(", ") ?? "---"
            }),
        ]
    }
}
