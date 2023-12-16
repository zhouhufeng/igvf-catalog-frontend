import { useMemo } from "react";
import {
    OnChangeFn,
    SortingState,
    Updater,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import classNames from "classnames";

import { TableGraphNode } from "@/app/_redux/slices/graphSlice";
import { NodeType } from "@/lib/types/derived-types";
import { catalog } from "@/lib/catalog-interface/catalog";
import CollectionTableRow from "./CollectionTableRow";
import { selectSorting, setSorting } from "@/app/_redux/slices/querySlice";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";

const columnHelper = createColumnHelper<any>();

export default function InternalCollectionTable({
    path,
    nodes,
    nodeType
}: {
    path: string[];
    nodes: TableGraphNode[];
    nodeType: NodeType;
}) {
    const sorting = useAppSelector(state => selectSorting(state, nodeType));
    const dispatch = useAppDispatch();

    const handleSetSorting: OnChangeFn<SortingState> = (onChangeFn) => {
        // @ts-ignore
        const newSort = onChangeFn(sorting);

        dispatch(setSorting({
            type: nodeType,
            state: newSort
        }));
    };

    const data = useMemo(() => nodes.map(n => {
        const node = catalog.deserialize(n);
        return {
            ...node.data,
            _id: node.parsed.id,
            expanded: n.isExpanded,
            populated: Object.keys(n.children).length > 0
        }
    }), [nodes]);

    const expandedColumn = useMemo(
        () => columnHelper.accessor('expand', {
            id: 'expand',
            header: () => null,
            cell: () => {
                return <button>
                    <p>X</p>
                </button>
            }
        }),
        []
    );

    const columns = useMemo(
        () =>
            [
                expandedColumn,
                ...Object.keys(data[0] || {}).filter(k => {
                    if (k === '_key') return false;
                    if (typeof data[0][k] !== 'string') return false;
                    return true;
                }).map((key) => (
                    columnHelper.accessor(key as any, {
                        cell: info => info.getValue(),
                        header: () => <span className="capitalize">{catalog.lookupName(key, nodeType)}</span>,
                    })
                ))
            ],
        [data]
    );

    const table = useReactTable<any>({
        data,
        columns,
        state: {
            sorting
        },
        onSortingChange: handleSetSorting,
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
                                    className="px-2 py-3 cursor-pointer"
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
                            <CollectionTableRow
                                row={row}
                                path={path.concat(row.original._id)}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
