import { GraphNode } from "@/lib/services/GraphService";
import BaseNode from "./_BaseNode";
import { RsVariant, getDrugsLinkedToRsidKey, getGenesLinkedToRsidKey, getProteinsLinkedToRsidKey, getStudiesLinkedToRsidKey, getVariantByRsid } from "@/lib/utils/db";


export default class VariantNode extends BaseNode {
    id: string;
    constructor(id: string) {
        super(id);
        this.id = id;
    }

    toGraphNode(data: any): GraphNode {
        return { variant: data }
    }

    async get(): Promise<GraphNode> {
        const rsData: RsVariant[] = await getVariantByRsid(this.id);

        return this.toGraphNode(rsData[0]);
    }

    async getAdjacent(): Promise<GraphNode[] | null> {
        try {
            const geneEdges = (await getGenesLinkedToRsidKey(this.id)).map(gene => ({ gene }));
            const proteinEdges = (await getProteinsLinkedToRsidKey(this.id)).map(protein => ({ protein }));
            const drugEdges = (await getDrugsLinkedToRsidKey(this.id)).map(drug => ({ drug }));
            const studyEdges = (await getStudiesLinkedToRsidKey(this.id)).map(study => ({ study }));
            return [...geneEdges, ...proteinEdges, ...drugEdges, ...studyEdges];
        } catch (error) {
            return null;
        }
    }
}
