"use client";

import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { selectRootKey, setRootKey } from "@/app/_redux/slices/graphSlice";
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
    const curGraph = useAppSelector(state => selectRootKey(state, graphKey))

    useEffect(() => {
        if (curGraph) return;

        dispatch(setRootKey({
            key: graphKey,
            data: serializedEdges
        }))
    }, []);

    return null;
}
