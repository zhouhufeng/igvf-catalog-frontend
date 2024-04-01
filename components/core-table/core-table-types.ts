export type CoreTableStateData<T> = T & {
    _tableKey: string;
    _expanded?: boolean;
};
