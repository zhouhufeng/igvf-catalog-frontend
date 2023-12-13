import { GraphNode } from "@/lib/types/derived-types";
import BaseNode from "../model/_BaseNode"

import GeneNode from "../model/GeneNode"
import ProteinNode from "../model/ProteinNode";
import TranscriptNode from "../model/TranscriptNode";
import VariantNode from "../model/VariantNode";

const keys: {
    key: keyof GraphNode;
    model: typeof BaseNode;
}[] = [
    {
        key: "gene",
        model: GeneNode
    },
    {
        key: "transcript",
        model: TranscriptNode
    },
    {
        key: "protein",
        model: ProteinNode
    },
    {
        key: "variant",
        model: VariantNode
    },
];

export default keys;
