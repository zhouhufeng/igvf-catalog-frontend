import prefixes from "./definitions/prefix-to-model";


class Catalog {
    node(id: string) {
        const model = prefixes.find(p => id.toUpperCase().startsWith(p.prefix));

        if (!model) return null;

        return new model.model(id);
    }
}

export const catalog = new Catalog();
