import BaseNode from "../model/_BaseNode";
import { GraphNode } from "@/lib/types/derived-types";
import { GenomicCoordinates } from "../../types/exact-types/region-types";
import keys from "../definitions/key-to-model";

export default class GenomicRegion {
    coords: GenomicCoordinates;
    constructor(_coords: string) {
        this.coords = normalizeRegionString(_coords);
    }

    async getRegionNodes(): Promise<GraphNode[] | null> {
        const promises: Promise<BaseNode[] | null>[] = [];
        for (const { model } of keys) {
            promises.push(
                model.query({ region: this.coords })
            )
        }

        const all = await Promise.all(promises);

        return all
            .flat()
            .filter((node) => node !== null)
            .map((node) => node!.serialize());
    }
}

function normalizeRegionString(coordinates: string): GenomicCoordinates {
    const { chromosome, start, end } = parseRegionString(coordinates);

    return `chr${chromosome}:${start}-${end}`;
}

function parseRegionString(coordinates: string) {
    const regex = /^(chr)?(\d+):(\d+)-(\d+)$/;
    const match = coordinates.match(regex);

    if (match) {
        const [, , chromosome, start, end] = match;
        return {
            chromosome: parseInt(chromosome),
            start: parseInt(start),
            end: parseInt(end)
        };
    }

    throw new Error('Invalid region string format');
}
