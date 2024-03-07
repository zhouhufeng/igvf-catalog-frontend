"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { Filter, addFilter, editFilterAtIdx, removeFilterAtIdx, selectFilters } from "@/app/_redux/slices/querySlice";
import { NodeTypes } from "@/lib/types/derived-types";
import EditableFilter from "./EditableFilter";
import classNames from "classnames";

const defaultFilter: Filter = {
    nodeType: "variant",
    fieldPath: "",
    condition: "eq",
    value: 0,
};

export default function FilterDisplay() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(selectFilters);

    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newFilter, setNewFilter] = useState<Filter>(defaultFilter);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAdd = () => setIsAdding(true);

    const handleSave = () => {
        dispatch(addFilter(newFilter));
        setIsAdding(false);
        setNewFilter(defaultFilter);
    }

    const handleCancel = () => {
        setIsAdding(false);
        setNewFilter(defaultFilter);
    }

    const renderFilters = () => (isAdding || filters.length > 0) ? filters.map((filter, idx) =>
        <EditableFilter
            key={filter.nodeType + filter.fieldPath + idx}
            filter={filter}
            onUpdate={(filter) => {
                dispatch(editFilterAtIdx({ idx, filter }));
            }}
            onCancel={() => {
                dispatch(removeFilterAtIdx(idx));
            }}
        />
    ) : (
        <div className="flex-1 flex flex-col items-center justify-center h-full space-y-4">
            <h1 className="text-2xl">No Filters Yet</h1>
            <p>Filters allow you to control what data is displayed.</p>
            <button className="px-8 py-2 border border-black rounded-full" onClick={handleAdd}>
                Add Filter
            </button>
        </div>
    );

    return (
        <>
            <button className="px-8 py-2 border border-black rounded-full font-bold" onClick={handleOpen}>
                Filter
            </button>
            {open ? (
                <Modal title="Filters" onClose={handleClose}>
                    <div className="space-y-4 h-5/6">
                        {isAdding ? (
                            <div className="border-b border-black pb-4 mb-4">
                                <EditableFilter
                                    filter={newFilter}
                                    onUpdate={setNewFilter}
                                    onCancel={handleCancel}
                                    onSave={handleSave}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-row justify-end mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={handleAdd}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                        )}
                        {renderFilters()}
                    </div>
                </Modal>
            ) : null}
        </>
    )
}
