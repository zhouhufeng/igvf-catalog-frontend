import { Filter } from "@/app/_redux/slices/querySlice";
import { GraphNode } from "@/lib/types/derived-types";

export type FilterCondition = "eq" | "neq" | "gt" | "gte" | "lt" | "lte";

export function checkFilter<T>(value1: T, value2: T, condition: FilterCondition): boolean {
    switch (condition) {
        case "eq":
            return value1 === value2;
        case "neq":
            return value1 !== value2;
        case "gt":
            return value1 > value2;
        case "gte":
            return value1 >= value2;
        case "lt":
            return value1 < value2;
        case "lte":
            return value1 <= value2;
        default:
            return false;
    }
}

export function checkFiltersOnNode(node: GraphNode, filters: Filter[]): boolean {
    for (const filter of filters) {
        const { fieldPath, nodeType, condition, value } = filter;

        if (!(nodeType in node)) continue;

        const pathParts = fieldPath.split('.');

        let fieldValue: any = node[nodeType];
        for (const part of pathParts) {
            if (fieldValue && typeof fieldValue === 'object' && part in fieldValue) {
                fieldValue = fieldValue[part];
            } else {
                return false;
            }
        }

        if (!checkFilter(fieldValue, value, condition)) {
            return false;
        }
    }
    return true;
}
