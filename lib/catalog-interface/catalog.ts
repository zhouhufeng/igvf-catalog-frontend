import BaseNode from "./model/_BaseNode";
import prefixes from "./definitions/prefix-to-model";
import keys from './definitions/key-to-model';
import { GraphNode, NodeType } from "../types/derived-types";
import nameDictionary from "./definitions/name-dictionary";

class Catalog {
    node(id: string) {
        const model = prefixes.find(p => id.toUpperCase().startsWith(p.prefix.toUpperCase()));

        if (!model) throw new Error(`No model found for id ${id}. Add a model in prefix-to-model.ts`);

        return model.model;
    }

    deserialize(node: GraphNode): BaseNode {
        for (const { key, model } of keys) {
            if (key in node) {
                return new model(node[key]);
            }
        }
        throw new Error("No model found while deserializing node");
    }

    deserializeToStatic(node: GraphNode) {
        for (const { key, model } of keys) {
            if (key in node) {
                return model;
            }
        }
        throw new Error("No model found while deserializing node");
    }

    modelToKey(model: BaseNode) {
        for (const { key, model: m } of keys) {
            if (model instanceof m) {
                return key;
            }
        }
        throw new Error("No key found for model");
    }
    
    lookupName(key: string, node_type?: NodeType) {
        if (node_type && key === "_id") return node_type + " ID";
        return nameDictionary[key] || key;
    }
}

export const catalog = new Catalog();
