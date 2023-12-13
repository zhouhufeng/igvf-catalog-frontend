import { apiBaseUrl } from "@/lib/utils/api";
import { NodeType } from "../types/derived-types";

const nameLookup: { [key: string]: string } = {
    "_id": "ID",
    "transcript_type": "Transcript Type",
    "chr": "Chromosome",
    "start": "Start",
    "end": "End",
    "transcript_name": "Transcript Name",
    "gene_name": "Gene Name",
    "source": "Source",
    "version": "Version",
    "source_url": "Source URL",
    // ... TOOD: add more
}

export default class TableService {
    static async getTableData(sourceId: string, destType: NodeType) {
        throw new Error("need to fix");
        const data: any[] = [];
        let pageNum = 0;
        while (true) {
            const nextPage = await fetch(`${apiBaseUrl}/s/${sourceId}/${destType}s?page=${pageNum++}`).then(res => res.json());
            if (nextPage.length === 0 || pageNum > 99) break;
            data.push(...nextPage);
        }
        return data;
    }

    static lookupName(key: string) { return nameLookup[key] || key; }
}
