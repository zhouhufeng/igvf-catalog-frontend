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

function convertToDBSPDI(regular: string): string {
    if (versionedRegex.test(regular)) return regular;
    const spdi = parseSPDI(regular);
    if (!spdi || !(spdi.sequence in CHR_MAP)) throw new Error("Invalid SPDI format");
    return `${CHR_MAP[spdi.sequence as keyof typeof CHR_MAP]}:${spdi.position-1}:${spdi.deletion}:${spdi.insertion}`;
}

const CHR_MAP = {
    '1': 'NC_000001.11',
    '2': 'NC_000002.12',
    '3': 'NC_000003.12',
    '4': 'NC_000004.12',
    '5': 'NC_000005.10',
    '6': 'NC_000006.12',
    '7': 'NC_000007.14',
    '8': 'NC_000008.11',
    '9': 'NC_000009.12',
    '10': 'NC_000010.11',
    '11': 'NC_000011.10',
    '12': 'NC_000012.12',
    '13': 'NC_000013.11',
    '14': 'NC_000014.9',
    '15': 'NC_000015.10',
    '16': 'NC_000016.10',
    '17': 'NC_000017.11',
    '18': 'NC_000018.10',
    '19': 'NC_000019.10',
    '20': 'NC_000020.11',
    '21': 'NC_000021.9',
    '22': 'NC_000022.11',
    'X': 'NC_000023.11',
    'Y': 'NC_000024.10'
}
