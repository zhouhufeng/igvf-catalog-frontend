import { GeneNodeData, GraphNode } from "@/lib/types/derived-types";
import BaseNode from "./_BaseNode";
import TranscriptNode from "./TranscriptNode";
import ProteinNode from "./ProteinNode";
import { ParsedProperties } from "@/lib/types/graph-model-types";


export default class GeneNode extends BaseNode {
    data: GeneNodeData;
    parsed: ParsedProperties;
    constructor(data: GeneNodeData) {
        super(data);
        this.data = data;
        this.parsed = {
            id: data._id
        }
    }

    serialize(): GraphNode {
        return {
            gene: this.data
        }
    }

    getDisplayName(): string {
        return "Gene " + this.data?.gene_name || "";
    }

    static async get(id: string): Promise<GeneNode | null> {
        try {
            // let genes = await api.genes.query({ gene_id: "ENSG00000160336" });

            const genes = await fetch(`https://api.catalog.igvf.org/api/genes/${id}`).then(r => r.json());

            return new GeneNode(Array.isArray(genes) ? genes[0] : genes)
        } catch (error) {
            return null;
        }
    }

    static async getAdjacent(): Promise<BaseNode[] | null> {
        try {
            // const proteinNodes = (await api.proteinsFromGenes.query({ gene_name: this.id })).map(protein => ({ protein }));
            // const transcriptNodes = (await api.transcriptsFromGenes.query({ gene_name: this.id, verbose: "true" })).map(transcript => ({ transcript: (transcript.transcript as TranscriptNodeData[])[0] }));
            // const diseaseNodes = (await api.diseasesFromGenes.query({ gene_name: this.id })).map(disease => ({ disease }));

            // return [...proteinNodes, ...transcriptNodes, ...diseaseNodes];

            const transcriptNodes = [
                {
                    "source": "GENCODE",
                    "source_url": "https://www.gencodegenes.org/human/",
                    "version": "v43",
                    "transcript": [
                        {
                            "_id": "ENST00000558928",
                            "transcript_type": "nonsense_mediated_decay",
                            "chr": "chr15",
                            "start": 89608788,
                            "end": 89628780,
                            "transcript_name": "KIF7-203",
                            "gene_name": "KIF7",
                            "source": "GENCODE",
                            "version": "v43",
                            "source_url": "https://www.gencodegenes.org/human/"
                        }
                    ]
                },
                {
                    "source": "GENCODE",
                    "source_url": "https://www.gencodegenes.org/human/",
                    "version": "v43",
                    "transcript": [
                        {
                            "_id": "ENST00000394412",
                            "transcript_type": "protein_coding",
                            "chr": "chr15",
                            "start": 89627976,
                            "end": 89655467,
                            "transcript_name": "KIF7-201",
                            "gene_name": "KIF7",
                            "source": "GENCODE",
                            "version": "v43",
                            "source_url": "https://www.gencodegenes.org/human/"
                        }
                    ]
                },
                {
                    "source": "GENCODE",
                    "source_url": "https://www.gencodegenes.org/human/",
                    "version": "v43",
                    "transcript": [
                        {
                            "_id": "ENST00000696512",
                            "transcript_type": "protein_coding",
                            "chr": "chr15",
                            "start": 89627976,
                            "end": 89663086,
                            "transcript_name": "KIF7-205",
                            "gene_name": "KIF7",
                            "source": "GENCODE",
                            "version": "v43",
                            "source_url": "https://www.gencodegenes.org/human/"
                        }
                    ]
                },
                {
                    "source": "GENCODE",
                    "source_url": "https://www.gencodegenes.org/human/",
                    "version": "v43",
                    "transcript": [
                        {
                            "_id": "ENST00000677187",
                            "transcript_type": "retained_intron",
                            "chr": "chr15",
                            "start": 89628050,
                            "end": 89633532,
                            "transcript_name": "KIF7-204",
                            "gene_name": "KIF7",
                            "source": "GENCODE",
                            "version": "v43",
                            "source_url": "https://www.gencodegenes.org/human/"
                        }
                    ]
                },
                {
                    "source": "GENCODE",
                    "source_url": "https://www.gencodegenes.org/human/",
                    "version": "v43",
                    "transcript": [
                        {
                            "_id": "ENST00000445906",
                            "transcript_type": "nonsense_mediated_decay",
                            "chr": "chr15",
                            "start": 89648502,
                            "end": 89655451,
                            "transcript_name": "KIF7-202",
                            "gene_name": "KIF7",
                            "source": "GENCODE",
                            "version": "v43",
                            "source_url": "https://www.gencodegenes.org/human/"
                        }
                    ]
                }
            ].map(e => new TranscriptNode(e.transcript[0]))

            return [
                new ProteinNode({
                    "_id": "Q2M1P5",
                    "name": "KIF7_HUMAN",
                    "dbxrefs": [
                    ],
                    "source": "UniProtKB/Swiss-Prot",
                    "source_url": "https://www.uniprot.org/help/downloads"
                }),
                ...transcriptNodes
            ]
        } catch (error) {
            return null;
        }
    }
}
