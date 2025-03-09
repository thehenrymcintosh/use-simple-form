
type ValueMapper<INPUT extends Record<any, any>, OUTPUT extends { [inputKey in keyof INPUT]: any }> = <KEY extends keyof INPUT>(key: KEY, value: INPUT[KEY]) => OUTPUT[KEY];

export const mapObject = <I extends Record<any, any>, O extends Record<any, any>>(inputObject: I, map: ValueMapper<I, O>): O => {
    return Object.fromEntries(
        Object.entries(inputObject).map(([key, value]) => [key, map(key, value)])
    ) as O;
}
