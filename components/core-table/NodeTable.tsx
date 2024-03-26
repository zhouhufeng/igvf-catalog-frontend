import { catalog } from "@/lib/catalog-interface/catalog";
import { useMemo } from "react";
import CoreTable from "./CoreTable";
import { ColumnDef } from "@tanstack/react-table";
import { CoreTableStateData } from "./core-table-types";


export default function NodeTable({
    node_id: _node_id,
    depth
}: {
    node_id: string;
    depth?: number;
}) {
    const node = useMemo<{
        columns: ColumnDef<any, any>[];
        fetchNextPage: (page: number) => Promise<CoreTableStateData<any>[]>;
    }>(() => {
        const node_id = decodeURIComponent(_node_id);
        const model = catalog.node(node_id);

        return {
            columns: model.getTableColumns(),
            fetchNextPage: async (page: number) => {
                const resp = await model.getAdjacent(node_id, { page });
                if (!resp) throw new Error("Failed to fetch data");

                return resp.map<CoreTableStateData<any>>(r => ({
                    _tableKey: r.parsed.id,
                    ...r.data
                }));
            }
        }
    }, [_node_id]);

    return (
        <CoreTable
            columns={node.columns}
            fetchNextPage={node.fetchNextPage}
            depth={depth || 0}
        />
    )
}
