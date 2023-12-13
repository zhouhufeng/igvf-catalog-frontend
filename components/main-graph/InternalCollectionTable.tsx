import { useMemo, useState } from "react";
import {
    SortingState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";

import { TableGraphNode } from "@/app/_redux/slices/graphSlice";
import { GraphNode, NodeType } from "@/lib/types/derived-types";
import { catalog } from "@/lib/catalog-interface/catalog";
import classNames from "classnames";

const columnHelper = createColumnHelper<TableGraphNode>();


export default function InternalCollectionTable({
    path,
    nodes,
    nodeType
}: {
    path: string[];
    nodes: TableGraphNode[];
    nodeType: NodeType;
}) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const data = useMemo(() => nodes.map(n => catalog.deserialize(n).data), [nodes]);

    const columns = useMemo(
        () => Object.keys(data[0] || {}).map((key) => (
            columnHelper.accessor(key as any, {
                cell: info => info.getValue(),
                header: () => <span>{catalog.lookupName(key, nodeType)}</span>,
            })
        )),
        [data]
    );

    const table = useReactTable<TableGraphNode>({
        data,
        columns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="border border-black rounded-lg w-fit">
            <table className="table-auto">
                <thead className="border-b border-black">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                    }}
                                    className="p-2 cursor-pointer"
                                >
                                    <div
                                        className={classNames(
                                            { 'cursor-pointer select-none': header.column.getCanSort() }
                                        )}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {{
                                            asc: '🔼 ',
                                            desc: '🔽 ',
                                        }[header.column.getIsSorted() as string] ?? null}
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    style={{
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                    }}
                                    className="p-2"
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
