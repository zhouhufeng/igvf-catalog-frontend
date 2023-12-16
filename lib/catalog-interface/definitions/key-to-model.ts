import { GraphNode } from "@/lib/types/derived-types";
import BaseNode from "../model/_BaseNode"

import GeneNode from "../model/GeneNode"
import ProteinNode from "../model/ProteinNode";
import TranscriptNode from "../model/TranscriptNode";
import VariantNode from "../model/VariantNode";
import DiseaseNode from "../model/DiseaseNode";
import DrugNode from "../model/DrugNode";
import StudyNode from "../model/StudyNode";

const keys: {
    key: keyof GraphNode;
    model: typeof BaseNode;
}[] = [
    {
        key: "disease",
        model: DiseaseNode
    },
    {
        key: "drug",
        model: DrugNode
    },
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
        key: "study",
        model: StudyNode
    },
    {
        key: "variant",
        model: VariantNode
    },
];

export default keys;
