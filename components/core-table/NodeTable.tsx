"use client";

import { catalog } from "@/lib/catalog-interface/catalog";
import { useMemo } from "react";
import CoreTable from "./CoreTable";
import { ColumnDef } from "@tanstack/react-table";
import { CoreTableStateData } from "./core-table-types";
import { GraphNode, NodeType } from "@/lib/types/derived-types";
import { useQuery } from "@tanstack/react-query";
import { groupGraphNodes } from "@/lib/catalog-interface/helpers/format-graph-nodes";
import Loading from "@/app/[node_id]/loading";
import BaseNode from "@/lib/catalog-interface/model/_BaseNode";

export default function NodeTable({
    node_id,
    depth
}: {
    node_id: string;
    depth?: number;
}) {
    const node = useMemo<{
        columns: ColumnDef<any, any>[];
        fetchNextTypePage: (type?: NodeType) => (page?: number) => Promise<CoreTableStateData<any>[]>;
        fetchInitialPage: () => Promise<GraphNode[]>;
        model: typeof BaseNode;
    }>(() => {
        const model = catalog.node(node_id);

        return {
            columns: model.getTableColumns(),
            fetchNextTypePage: (type?: NodeType) => async (page?: number) => {
                const resp = await model.getAdjacent(node_id, { page, type });
                if (!resp) throw new Error("Failed to fetch data");

                return resp.map<CoreTableStateData<any>>(r => ({
                    _tableKey: r.parsed.id,
                    ...r.data
                }));
            },
            fetchInitialPage: async () => {
                const resp = await model.getAdjacent(node_id);
                if (!resp) throw new Error("Failed to fetch data");

                return resp.map(r => r.serialize());
            },
            model
        }
    }, [node_id]);

    const { data } = useQuery({
        queryKey: ['initial', node],
        queryFn: async () => {
            const res = await node.fetchInitialPage();
            return groupGraphNodes(res);
        }
    });

    if (!data) return <div className="flex items-center justify-center w-[80vw] h-[80vh]">
        <Loading />
    </div>

    return (
        data.map((group, idx) => {
            const convert = group.nodes.map<CoreTableStateData<any>>(n => {
                const model = catalog.deserialize(n);

                return {
                    _tableKey: model.parsed.id,
                    ...model.data
                }
            });

            const cols = catalog.deserializeToStatic(group.nodes[0]).getTableColumns();

            return (
                <div key={group.node_type}>
                    {idx !== 0 && <div className="border-t border-t-gray-600 my-4"></div>}
                    <h1 className="text-xl font-bold text-gray-600 mb-4">
                        Linked
                        <span className="capitalize"> {group.node_type + "s"}</span>
                    </h1>
                    <CoreTable
                        key={group.node_type}
                        initialData={convert}
                        fetchNextPage={node.fetchNextTypePage(group.node_type)}
                        filterNodeType={group.node_type}
                        depth={depth ?? 0}
                        columns={cols}
                    />
                </div>
            )
        })
    )
}
