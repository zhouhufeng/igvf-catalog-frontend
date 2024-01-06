import { NodeType } from "./derived-types";


export interface ParsedProperties {
    id: string;
    displayName: string;
}

export interface GetAdjacentOptions {
    type?: NodeType,
    page?: number;
}
