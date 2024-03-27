import { DrugNodeData, GeneNodeData, GraphNode, ProteinNodeData, VariantNodeData } from "@/lib/types/derived-types";
import { GetAdjacentOptions, ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";
import { single } from "@/lib/utils/utils";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

import BaseNode from "../_BaseNode";
import { catalog } from "../../catalog";
import { preprocess } from "../../helpers/format-graph-nodes";

export default class VariantNode extends BaseNode {
    data: VariantNodeData;
    parsed: ParsedProperties;
    constructor(data: VariantNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data.rsid?.[0] || "",
            displayName: "Variant " + this.data.rsid?.[0],
        }
    }

    serialize(): GraphNode {
        return {
            variant: this.data
        }
    }

    getDisplayName(): string {
        return "Variant " + this.data?._id || "";
    }

    static async get(id: string): Promise<BaseNode | null> {
        const rsData = await api.variants.query({ rsid: id });

        return new VariantNode(rsData[0]);
    }

    static async getAdjacent(
        id: string,
        options?: GetAdjacentOptions
    ): Promise<BaseNode[] | null> {
        try {
            const variant_id = preprocess(await api.variants.query({ rsid: id }))._id;

            const queries = {
                gene: () => api.genesFromVariants.query({ variant_id, verbose: "true" })
                    .then(genes => genes.map(v => ({ gene: v.gene as GeneNodeData }))),
                protein: () => api.proteinsFromVariants.query({ variant_id, verbose: "true" })
                    .then(proteins => proteins.map(v => ({ protein: single(v.protein as unknown as ProteinNodeData) }))),
                drug: () => api.drugsFromVariants.query({ variant_id, verbose: "true" })
                    .then(drugs => drugs.map(v => ({ drug: single(v.drug as unknown as DrugNodeData) })))
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
        const variants = await api.variants.query({ region }).then(v => v.map(n => ({ variant: n })));

        return variants.map(catalog.deserialize);
    }

    static getTableColumns() {
        const columnHelper = createColumnHelper<VariantNodeData & { [key: string]: any; }>();

        return [
            columnHelper.accessor('region', {
                header: () => <span>Region</span>,
                cell: ({ row: { original } }) => {
                    const position = original.pos || original['pos:long']
                    return <Link href={`/region/${original.chr}:${position}-${position}`} className="underline text-brand">
                        {`${original.chr}:${position}`}
                    </Link>
                }
            }),
            columnHelper.accessor('rsid', {
                header: () => <span>rsID</span>,
                cell: ({ row: { original } }) => original.rsid?.join(", ") ?? "---"
            }),
            columnHelper.accessor("source", {
                header: () => <span>Source</span>,
                cell: ({ row: { original } }) =>
                    original.source_url ? (
                        <a href={original.source_url} target="_blank" className="underline text-brand">{original.source}</a>
                    ) : original.source
            }),
            columnHelper.accessor('spdi', {
                header: () => <span>SPDI</span>,
                cell: ({ row: { original } }) => original.rsid?.join(", ") ?? "---"
            }),
            // other columns accessed through expanded visualization
        ]
    }

    excludedColumns: null | string[] = ["alt", "ref", "_key", "_rev", "qual", "format"]
}
