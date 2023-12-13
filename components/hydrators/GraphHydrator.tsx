"use client";

import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { selectGraphPath, setRootKey } from "@/app/_redux/slices/graphSlice";
import { catalog } from "@/lib/catalog-interface/catalog";
import { GraphNode } from "@/lib/types/derived-types";
import { useEffect } from "react";


export default function GraphHydrator({
    graphKey,
    serializedEdges,
}: {
    graphKey: string;
    serializedEdges: GraphNode[];
}) {
    const dispatch = useAppDispatch();
    const curGraph = useAppSelector(state => selectGraphPath(state, []))

    useEffect(() => {
        if (curGraph) return;

        dispatch(setRootKey({
            key: graphKey,
            data: serializedEdges
        }))
    }, [])

    return null;
}
