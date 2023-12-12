import BaseNode from "../model/_BaseNode"

import GeneNode from "../model/GeneNode"
import ProteinNode from "../model/ProteinNode";
import TranscriptNode from "../model/TranscriptNode";
import VariantNode from "../model/VariantNode";

const prefixes: {
    prefix: string;
    model: typeof BaseNode; 
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
        prefix: "rs",
        model: VariantNode
    },
];

export default prefixes;
