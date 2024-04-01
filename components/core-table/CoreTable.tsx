"use client";

import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { selectFilters } from "@/app/_redux/slices/querySlice";
import { selectGraphPageSize, setGraphPageSize } from "@/app/_redux/slices/settingsSlice";
import { ColumnDef, Row, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { CoreTableStateData } from "./core-table-types";
import NodeTable from "./NodeTable";
import SplitTableSection from "./SplitTableSection";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { NodeType } from "@/lib/types/derived-types";
import { checkFiltersOnNode } from "@/lib/catalog-interface/helpers/apply-filter";

const SERVER_PAGE_SIZE = 25;

export default function CoreTable<T>({
    fetchNextPage,
    columns,
    filterNodeType,
    initialData,
    depth,
}: {
    fetchNextPage: (page?: number) => Promise<CoreTableStateData<T>[]>;
    columns: ColumnDef<CoreTableStateData<T>, any>[];
    filterNodeType?: NodeType;
    initialData?: CoreTableStateData<T>[];
    depth: number;
}) {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(selectFilters);
    const pageSize = useAppSelector(selectGraphPageSize);

    const [data, setData] = useState<CoreTableStateData<T>[]>(initialData ?? []);

    const [pageIndex, setPageIndex] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    useEffect(() => {
        (async () => {
            if (data.length === 0) {
                const newData = await fetchNextPage();
                setData(newData);
            } else if ((pageIndex + 1) * pageSize >= data.length) {
                const nextPageNumber = Math.floor(data.length / SERVER_PAGE_SIZE) + 1;

                const newData = await fetchNextPage(nextPageNumber);

                if (newData && newData.length > 0) {
                    setData(curData => [...curData, ...newData]);
                    setHasNext(true);
                } else {
                    setHasNext(false);
                }
            }
        })();
    }, [pageIndex, pageSize, data.length]);

    useEffect(() => {
        setPageIndex(0);
    }, [pageSize]);

    const currentPageData = useMemo(() => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        const first = data.slice(start, end);
        if (filterNodeType) {
            return first.filter(d => checkFiltersOnNode({ [filterNodeType]: d }, filters));
        }
        return first;
    }, [data, pageIndex, pageSize]);

    const table = useReactTable<CoreTableStateData<T>>({
        data: currentPageData,
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
            <div>
                {contents.elements}
            </div>
            <div className="flex flex-row items-center justify-between py-4 w-full max-w-[60vw]">
                <div></div>
                <div className="relative">
                    <div className="flex flex-row items-center justify-center space-x-4">
                        <Select value={pageSize.toString()} onValueChange={(v) => dispatch(setGraphPageSize(parseInt(v)))}>
                            <SelectTrigger>
                                <SelectValue placeholder="25" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={() => setPageIndex(old => Math.max(old - 1, 0))} disabled={pageIndex === 0}>Previous</Button>
                        <div className="flex flex-row items-center space-x-4">
                            <p className="whitespace-nowrap">Page {pageIndex + 1}</p>
                        </div>
                        <Button onClick={() => setPageIndex(old => old + 1)} disabled={(pageIndex + 1) * pageSize >= data.length}>Next</Button>
                    </div>
                    {!hasNext && <p className="absolute right-0 -bottom-[25px] text-sm text-slate-600">You've reached the end.</p>}
                </div>
            </div>
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
