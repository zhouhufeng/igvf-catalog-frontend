import { useState } from 'react';
import { Row, flexRender } from "@tanstack/react-table";
import { useDispatch } from 'react-redux';
import { motion } from "framer-motion";

import { CoreTableStateData } from './core-table-types';

type LoadingStatus = "idle" | "loading" | "loaded" | "error";

export default function TableRow<T>({
    row,
    depth
}: {
    row: Row<CoreTableStateData<T>>;
    depth: number;
}) {
    const dispatch = useDispatch();
    const [status, setStatus] = useState<LoadingStatus>("idle");

    const toggleExpand = async () => {
        
    }

    return (
        <>
            {row.getVisibleCells().map(cell => {
                if (cell.column.id === 'expand') {
                    return (
                        <td key={cell.id} className="px-2 py-2">
                            {depth > 1 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 absolute -translate-x-10 -translate-y-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            ) : null}
                            <DropdownButton
                                onClick={toggleExpand}
                                expanded={row.original._expanded}
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
                            className="px-2 py-2"
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
    expanded: boolean | undefined;
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
