import GraphNode from "../model/_BaseNode"
import DiseaseNode from "../model/DiseaseNode";

import GeneNode from "../model/GeneNode"
import ProteinNode from "../model/ProteinNode";
import TranscriptNode from "../model/TranscriptNode";
import VariantNode from "../model/VariantNode";

const prefixes: {
    prefix: string;
    model: typeof GraphNode; 
}[] = [
    {
        prefix: "ENSG",
        model: GeneNode
    },
    {
        prefix: "ENST",
        model: TranscriptNode
    },
    {
        prefix: "P",
        model: ProteinNode
    },
    {
        prefix: "Q",
        model: ProteinNode
    },
    {
        prefix: "rs",
        model: VariantNode
    },
    {
        prefix: "ORPHANET",
        model: DiseaseNode
    },
];

export default prefixes;
