
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
