"use client";

import { notFound, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import storyList from "../content";
import { useAppDispatch } from "@/app/_redux/hooks";

export default function Page({
    params: {
        slug
    }
}: {
    params: {
        slug: string;
    }
}) {
    const story = useMemo(() => storyList.find(s => s.slug === slug), [slug]);
    if (!story) notFound();

    const dispatch = useAppDispatch();
    const router = useRouter();
    const [data, setData] = useState<any>({});

    const handleKeyChange = (key: string, value: any) => {
        setData({
            ...data,
            [key]: value,
        });
    }

    const handleSubmit = () => {
        for (const input of story.steps) {
            if (!data[input.key]) {
                alert(`Please fill in ${input.title}`);
                return;
            }
        }

        story.submit(data, dispatch, router);
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-start">
            <div className="p-3 w-full max-w-6xl">
                <h1 className="text-3xl font-bold mb-6">{story.title}</h1>
            </div>
        </div>
    )
}
