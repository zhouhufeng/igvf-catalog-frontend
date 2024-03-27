import { GraphNode, ProteinNodeData, TranscriptNodeData } from "@/lib/types/derived-types";
import { GetAdjacentOptions, ParsedProperties } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";
import { createColumnHelper } from "@tanstack/react-table";

import { catalog } from "../catalog";
import { preprocess } from "../helpers/format-graph-nodes";
import BaseNode from "./_BaseNode";

export default class ProteinNode extends BaseNode {
    data: ProteinNodeData;
    parsed: ParsedProperties;
    constructor(data: ProteinNodeData) {
        super(data);
        this.data = preprocess(data);
        this.parsed = {
            id: this.data._id,
            displayName: "Protein " + this.data._id,
        }
    }

    serialize(): GraphNode {
        return {
            protein: this.data
        }
    }

    static async get(id: string): Promise<BaseNode | null> {
        try {
            let proteins = await api.proteins.query({ protein_id: id });

            return new ProteinNode(Array.isArray(proteins) ? proteins[0] : proteins);
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
                gene: () => api.genesFromProteins.query({ protein_id: id, page: options?.page }).then(genes => genes.map(gene => ({ gene }))),
                transcript: () => api.transcriptsFromProteins.query({ protein_id: id, verbose: "true", page: options?.page }).then(transcripts => transcripts.map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] })))
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

    static getTableColumns() {
        const columnHelper = createColumnHelper<ProteinNodeData & { [key: string]: any; }>();

        return [
            columnHelper.accessor('_id', {
                header: () => <span>Protein ID</span>
            }),
            columnHelper.accessor('name', {
                header: () => <span>Protein Name</span>
            }),
            columnHelper.accessor('full_name', {
                header: () => <span>Full Name</span>
            }),
            columnHelper.accessor('source', {
                header: () => <span>Source</span>,
                cell: ({ row: { original } }) =>
                    (original.source && original.source_url) ? (
                        <a href={original.source_url} target="_blank" className="underline text-brand">{original.source}</a>
                    ) : original.source ?? "---"
            }),
            // TODO: allow dbxrefs access
        ]
    }
}
