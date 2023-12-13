import { GraphNode } from "../types/derived-types";
import prefixes from "./definitions/prefix-to-model";
import keys from './definitions/key-to-model';
import BaseNode from "./model/_BaseNode";


class Catalog {
    node(id: string) {
        const model = prefixes.find(p => id.toUpperCase().startsWith(p.prefix));

        if (!model) return null;

        return model.model;
    }

    deserialize(node: GraphNode): BaseNode {
        for (const { key, model } of keys) {
            if (key in node) {
                return new model(node[key]);
            }
        }
        return new BaseNode({});
    }
}

export const catalog = new Catalog();
