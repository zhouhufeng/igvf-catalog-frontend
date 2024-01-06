"use client";

import { notFound, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import storyList from "../content";
import { useAppDispatch } from "@/app/_redux/hooks";
import InputDisplay from "./InputDisplay";

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
    const [curStep, setCurStep] = useState(0);

    const handleKeyChange = (key: string, value: any) => {
        setData({
            ...data,
            [key]: value,
        });
    }

    const handleSubmit = () => {
        for (const input of story.steps) {
            if (!data[input.key]) {
                alert(`Fill in "${input.title}"`);
                return;
            }
        }
        story.submit(data, dispatch, router);
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-start">
            <div className="p-3 w-full max-w-6xl">
                <h1 className="text-3xl font-bold">{story.title}</h1>
                <h2 className="text-xl py-2">{story.description}</h2>
                <div className="flex flex-col border border-black rounded-lg space-y-4 pb-2">
                    {story.steps.map((step, idx) => (
                        <InputDisplay
                            key={step.key}
                            step={step}
                            value={data[step.key]}
                            open={idx === curStep}
                            idx={idx}
                            lastIdx={story.steps.length - 1}
                            onChange={handleKeyChange}
                            setStep={setCurStep}
                        />
                    ))}
                </div>
            </div>
            <p>You may have to expand the table to reach your results.</p>
            <button
                onClick={handleSubmit}
                className="bg-primary text-white p-2 rounded-lg mt-2"
            >
                Submit
            </button>
        </div>
    )
}
