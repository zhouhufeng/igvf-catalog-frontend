"use client";

import { useAppDispatch } from "@/app/_redux/hooks";
import { setTitle } from "@/app/_redux/slices/uiSlice";
import { useEffect } from "react";

export default function SetNavigation({
    title
}: {
    title?: string;
}) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (title) {
            dispatch(setTitle(title));
        }

        return () => {
            if (title) {
                dispatch(setTitle(null));
            }
        }
    }, []);

    return null;
}
