export function debounce(func: (...args: any[]) => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: any[]) {
        const context = this;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

export function capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

export function single<T>(data: T[] | T) {
    return Array.isArray(data) ? data[0] : data;
}
