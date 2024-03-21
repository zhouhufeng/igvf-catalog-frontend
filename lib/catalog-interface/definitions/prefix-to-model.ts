import BaseNode from "../model/_BaseNode";
import DiseaseNode from "../model/DiseaseNode";
import GeneNode from "../model/GeneNode";
import ProteinNode from "../model/ProteinNode";
import TranscriptNode from "../model/TranscriptNode";
import SPDIVariantNode from "../model/variant-group/SPDIVariantNode";
import VariantNode from "../model/variant-group/VariantNode";

type PrefixEl = {
    prefix: string;
    model: typeof BaseNode;
} | {
    regex: RegExp;
    model: typeof BaseNode;
}

const prefixes: PrefixEl[] = [
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
    {
        regex: /^\d+_\d+_[A-Z]_[A-Z]$/,
        model: SPDIVariantNode,
    },
    {
        regex: /NC_\d+\.\d+:\d+:[A-Z]:[A-Z]/,
        model: SPDIVariantNode,
    },
];

export default prefixes;
