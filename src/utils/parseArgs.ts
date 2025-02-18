import { ArgType } from "@decorators/Command"

/**
 * Parses the arguments from string to the real type.
 * @param values - Args to be parsed.
 * @returns {unknown[]}
 */
export function parseArgs(values: string[], types: ArgType[]) {
    const parsedArgs: unknown[] = []
    
    for (let i = 0; i < values.length; i++) {
        const currentValue = values[i]
        const currentType = types[i]

        switch (currentType) {
            case ArgType.Text:
                parsedArgs.push(currentValue)
                break
            case ArgType.Boolean:
                parsedArgs.push(Boolean(currentValue))
                break
            case ArgType.Integer:
                parsedArgs.push(parseInt(currentValue))
                break
            case ArgType.Float:
                parsedArgs.push(parseFloat(currentValue))
                break
        }
    }

    return parsedArgs
}