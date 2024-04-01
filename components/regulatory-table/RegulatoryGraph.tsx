"use client";

import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { selectSorting, setSorting } from "@/app/_redux/slices/querySlice";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, OnChangeFn, SortingState, useReactTable } from "@tanstack/react-table";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

import CollectionTableRow from "./RegulatoryGraphTableRow";
import { RegulatoryRegion } from "@/lib/types/derived-types";
import GenomicRegion from "@/lib/catalog-interface/helpers/GenomicRegion";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { selectGraphPageSize, setGraphPageSize } from "@/app/_redux/slices/settingsSlice";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();

export default function RegulatoryGraph({
    regions: _regions,
    stateKey,
}: {
    regions: RegulatoryRegion[];
    stateKey: string;
}) {
    const [regions, setRegions] = useState(_regions);
    const sorting = useAppSelector(state => selectSorting(state, stateKey));
    const pageSize = useAppSelector(selectGraphPageSize);
    const dispatch = useAppDispatch();

    const [pageIndex, setPageIndex] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    const fetchNextPage = async () => {
        const region = new GenomicRegion(stateKey);

        const nextPageNumber = Math.floor(regions.length / 25) + 1;

        const nextRegions = await region.getRegulatoryRegions(nextPageNumber);

        return nextRegions;
    }

    const handleSetSorting: OnChangeFn<SortingState> = (onChangeFn) => {
        // @ts-ignore
        const newSort = onChangeFn(sorting);

        dispatch(setSorting({
            type: stateKey,
            state: newSort
        }));
    };

    useEffect(() => {
        const fetchMoreDataIfNeeded = async () => {
            if ((pageIndex + 1) * pageSize >= data.length) {
                const newRegions = await fetchNextPage();
                if (newRegions && newRegions.length > 0) {
                    setRegions([...regions, ...newRegions]);
                } else {
                    setHasNext(false);
                }
            }
        };

        fetchMoreDataIfNeeded();
    }, [pageIndex, pageSize, regions.length]);

    const currentPageData = useMemo(() => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        return regions.slice(start, end).map(region => ({
            ...region,
            _id: region.source,
        }));
    }, [regions, pageIndex, pageSize]);

    const data = useMemo(() => regions.map(region => {
        return {
            ...region,
            _id: region.source
        }
    }), [regions]);

    const columns = useMemo(
        () =>
            [
                columnHelper.accessor('expand', {
                    header: () => null,
                    cell: () => {
                        return <button>
                            <p>X</p>
                        </button>
                    }
                }),
                columnHelper.accessor('region', {
                    header: () => <span>Region</span>,
                    cell: ({ row: { original } }) => {
                        const converted = `${original.chr}:${original.start}-${original.end}`;
                        return <Link href={`/region/${converted}`} className="underline text-brand">
                            {converted}
                        </Link>
                    }
                }),
                columnHelper.accessor('biochemical_activity', {
                    header: () => <span>Biochemical Activity</span>,
                }),
                columnHelper.accessor('biochemical_activity_description', {
                    header: () => <span>Biochemical Activity Description</span>
                }),
                columnHelper.accessor('type', {
                    header: () => <span>Type</span>
                }),
                columnHelper.accessor('source', {
                    header: () => <span>Source</span>
                }),
                columnHelper.accessor('source_url', {
                    header: () => <span>Source URL</span>,
                    cell: (cell) => <a href={cell.getValue()} target="_blank" className="underline text-brand">{cell.getValue()}</a>
                }),
            ],
        [data]
    );

    const table = useReactTable<any>({
        data: currentPageData,
        columns,
        state: {
            sorting,
            pagination: { pageIndex, pageSize },
        },
        onSortingChange: handleSetSorting,
        manualPagination: true,
        pageCount: Math.ceil(regions.length / pageSize),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div>
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
                                        className="px-2 py-2 cursor-pointer"
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
                                <CollectionTableRow row={row} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-row items-center justify-between py-4 w-full max-w-[90vw]">
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
                        <Button onClick={() => setPageIndex(old => old + 1)} disabled={(pageIndex + 1) * pageSize >= regions.length}>Next</Button>
                    </div>
                    {!hasNext && <p className="absolute right-0 -bottom-[25px] text-sm text-slate-600">You've reached the end.</p>}
                </div>
            </div>
        </div>
    );
}
