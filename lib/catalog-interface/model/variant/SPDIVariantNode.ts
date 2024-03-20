import { VariantNodeData } from "@/lib/types/derived-types";
import { GetAdjacentOptions } from "@/lib/types/graph-model-types";
import { api } from "@/lib/utils/api";
import { single } from "@/lib/utils/utils";

import BaseNode from "../_BaseNode";
import VariantNode from "./VariantNode";

export default class SPDIVariantNode extends VariantNode {
    constructor(data: VariantNodeData) {
        super(data);
    }

    static async spdiToRsid(spdi: string): Promise<string> {
        const parsedSPDI = convertToDBSPDI(spdi);
        const queryResult = await api.variants.query({ spdi: parsedSPDI });

        if (!queryResult.length) throw new Error(`SPDI ${spdi} // ${parsedSPDI} not found`);

        const variant = single(queryResult);

        if (!variant.rsid) throw new Error(`No rsid found for SPDI ${spdi} // ${parsedSPDI}`);

        return variant.rsid[0];
    }

    static async get(id: string) {
        try {
            const rsid = await SPDIVariantNode.spdiToRsid(id);

            return super.get(rsid);
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(
        id: string,
        options?: GetAdjacentOptions
    ): Promise<BaseNode[] | null> {
        try {
            const rsid = await SPDIVariantNode.spdiToRsid(id);

            return super.getAdjacent(rsid, options);
        } catch (error) {
            return null;
        }
    }
}

interface Spdi {
    sequence: string;
    position: number;
    deletion: string;
    insertion: string;
}

const versionedRegex = /NC_\d+\.\d+:\d+:[A-Z]:[A-Z]/;
const simplifiedRegex = /^(\d+)_(\d+)_([A-Z])_([A-Z])$/;


function parseSPDI(spdi: string): Spdi | null {
    const match = spdi.match(simplifiedRegex);

    if (match) {
        return {
            sequence: match[1],
            position: parseInt(match[2], 10),
            deletion: match[3],
            insertion: match[4],
        };
    } else {
        console.error("Invalid SPDI format");
        return null;
    }
}

const SPDI_VERSION = "NC_000001.11";

function convertToDBSPDI(regular: string): string {
    if (versionedRegex.test(regular)) return regular;
    const spdi = parseSPDI(regular);
    if (!spdi) throw new Error("Invalid SPDI format");
    return `${SPDI_VERSION}:${spdi.position}:${spdi.deletion}:${spdi.insertion}`;
}
