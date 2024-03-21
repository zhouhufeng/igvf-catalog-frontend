import { GraphNode, NodeType } from "../types/derived-types";
import keys from './definitions/key-to-model';
import nameDictionary from "./definitions/name-dictionary";
import prefixes from "./definitions/prefix-to-model";
import BaseNode from "./model/_BaseNode";

class Catalog {
    node(id: string) {
        id = decodeURIComponent(id);
        const model = prefixes.find(p => {
            if ('prefix' in p) {
                return id.startsWith(p.prefix);
            }
            if ('regex' in p) {
                return p.regex.test(id);
            }
            return false;
        });

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
