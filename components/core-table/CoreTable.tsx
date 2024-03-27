"use client";

import { useAppSelector } from "@/app/_redux/hooks";
import { selectFilters } from "@/app/_redux/slices/querySlice";
import { selectGraphPageSize } from "@/app/_redux/slices/settingsSlice";
import { ColumnDef, Row, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { CoreTableStateData } from "./core-table-types";
import NodeTable from "./NodeTable";
import SplitTableSection from "./SplitTableSection";

const SERVER_PAGE_SIZE = 25;

export default function CoreTable<T>({
    fetchNextPage,
    columns,
    initialData,
    depth,
}: {
    fetchNextPage: (page: number) => Promise<CoreTableStateData<T>[]>;
    columns: ColumnDef<CoreTableStateData<T>, any>[];
    initialData?: CoreTableStateData<T>[];
    depth: number;
}) {
    const filters = useAppSelector(selectFilters);
    const pageSize = useAppSelector(selectGraphPageSize);

    const [data, setData] = useState<CoreTableStateData<T>[]>(initialData ?? []);

    const [pageIndex, setPageIndex] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    useEffect(() => {
        (async () => {
            if ((pageIndex + 1) * pageSize >= data.length) {
                const nextPageNumber = Math.floor(data.length / SERVER_PAGE_SIZE) + 1;

                const newData = await fetchNextPage(nextPageNumber);
                if (newData && newData.length > 0) {
                    setData([...data, ...newData]);
                } else {
                    setHasNext(false);
                }
            }
        })();
    }, [pageIndex, pageSize, data.length]);

    const table = useReactTable<CoreTableStateData<T>>({
        data,
        columns,
        // state: {
        //     sorting
        // },
        // onSortingChange: handleSetSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const rows = table.getRowModel();
    const headers = table.getHeaderGroups();

    const contents = useMemo(() => {
        const elements: React.ReactNode[] = [];
        let curRun: Row<CoreTableStateData<T>>[] = [];
        let count = 0;

        for (const el of rows.rows) {
            // if (!checkFiltersOnNode(node, filters)) continue;
            count++;

            curRun.push(el);

            if (el.original._expanded) {
                elements.push(
                    <SplitTableSection
                        key={"table-" + count}
                        rows={curRun}
                        headers={headers}
                        depth={depth}
                    />
                )
                elements.push(
                    <Indent
                        key={"graph-" + count}
                        show={depth > 0}
                    >
                        <NodeTable
                            node_id={el.original._tableKey}
                            depth={depth + 1}
                        />
                    </Indent>
                );

                curRun = [];
            }
        }

        if (curRun.length > 0) {
            elements.push(
                <SplitTableSection
                    key={"table-collection-end"}
                    rows={curRun}
                    headers={headers}
                    depth={depth}
                />
            )
        }

        if (elements.length === 0) {
            return {
                count: 0,
                elements: <p className="pl-1">No rows match your filters.</p>
            }
        }

        return { count, elements };
    }, [rows, filters]);

    return (
        <div className="pl-1">
            {contents.elements}
        </div>
    )
}

function Indent({
    children,
    show
}: {
    children: React.ReactNode;
    show: boolean;
}) {
    return (
        <div className={show ? "ml-4 pl-6 border-l border-black" : ""}>
            {children}
        </div>
    )
}
