import React, { useState } from 'react';
import { flexRender, useReactTable } from "@tanstack/react-table";
import { useDispatch } from 'react-redux';
import { motion } from "framer-motion";

import { setPathChildren, toggleExpandAtPath } from '@/app/_redux/slices/graphSlice';
import { catalog } from '@/lib/catalog-interface/catalog';

type LoadingStatus = "idle" | "loading" | "loaded" | "error";

export default function CollectionTableRow({
    row,
    path
}: {
    row: ReturnType<ReturnType<typeof useReactTable<any>>['getRowModel']>['rows'][number];
    path: string[],
}) {
    const dispatch = useDispatch();
    const [status, setStatus] = useState<LoadingStatus>("idle");

    const toggleExpand = async () => {
        if (row.original.expanded || row.original.populated) return dispatch(toggleExpandAtPath({ path }));

        const id = path[path.length - 1];

        try {
            setStatus("loading");
            const model = catalog.node(id);
            const data = await model.getAdjacent(id);

            if (!data) throw new Error("Couldn't load adjacent nodes");

            const serialized = data.map(n => n.serialize());

            dispatch(toggleExpandAtPath({ path }));
            dispatch(setPathChildren({ path, data: serialized }));
            setStatus("loaded");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    }

    return (
        <>
            {row.getVisibleCells().map(cell => {
                if (cell.column.id === 'expand') {
                    return (
                        <td key={cell.id} className="px-2 py-3">
                            {path.length > 2 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 absolute -translate-x-10 -translate-y-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            ) : null}
                            <DropdownButton
                                onClick={toggleExpand}
                                expanded={row.original.expanded}
                                loadingStatus={status}
                            />
                        </td>
                    );
                } else {
                    return (
                        <td
                            key={cell.id}
                            style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                            }}
                            className="px-2 py-3"
                        >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    );
                }
            })}
        </>
    );
};

function DropdownButton({
    onClick,
    expanded,
    loadingStatus
}: {
    onClick: () => void;
    expanded: boolean;
    loadingStatus: LoadingStatus;
}) {
    return (
        <motion.svg
            onClick={loadingStatus !== 'loading' ? onClick : undefined}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 ${loadingStatus === 'loading' ? 'opacity-50' : 'cursor-pointer'}`}
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
        >
            {loadingStatus === 'error' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            )}
        </motion.svg>
    );
}
