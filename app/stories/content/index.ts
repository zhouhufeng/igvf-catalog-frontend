import { useAppDispatch } from "@/app/_redux/hooks";
import { useRouter } from "next/navigation";

import { alleleFrequency } from "./coding-variants";

export type Input = {
    type: "float";
} | {
    type: "select";
    options: {
        key: string;
        name: string;
    }[];
} | {
    type: "string";
}

export interface UserStory<T> {
    slug: string;
    title: string;
    description: string;
    steps: {
        title: string;
        description: string;
        key: keyof T;
        inputType: Input;
    }[];
    submit: (data: T, dispatch: ReturnType<typeof useAppDispatch>, router: ReturnType<typeof useRouter>) => void;
}

const storyList = [
    alleleFrequency,
];

export default storyList;
