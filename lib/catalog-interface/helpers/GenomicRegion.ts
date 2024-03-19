import { GraphNode } from "@/lib/types/derived-types";
import { GenomicCoordinates } from "../../types/exact-types/region-types";
import { api } from "@/lib/utils/api";

export default class GenomicRegion {
    region: GenomicCoordinates;
    constructor(_coords: string) {
        this.region = normalizeRegionString(_coords);
    }

    async getRegionNodes(): Promise<GraphNode[] | null> {
        try {
            const { region } = this;
            const promises: Promise<GraphNode[] | null>[] = [
                api.genes.query({ region }).then(v => (v as any[]).map(n => ({ gene: n }))),
                api.variants.query({ region }).then(v => v.map(n => ({ variant: n }))),
                api.transcripts.query({ region }).then(v => (v as any[]).map(n => ({ transcript: n }))),
            ];

            const all = await Promise.all(promises);

            return all
                .flat()
                .filter((node) => node !== null) as GraphNode[];
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export function normalizeRegionString(coordinates: string): GenomicCoordinates {
    const { chromosome, start, end } = parseRegionString(coordinates);

    return `chr${chromosome}:${start}-${end}`;
}

function parseRegionString(coordinates: string) {
    coordinates = decodeURIComponent(coordinates);
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

    throw new Error('Invalid region string format: ' + coordinates);
}
