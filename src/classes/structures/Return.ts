/**
 * The possible return types a command can return.
 */
export enum ReturnType {
    CustomError,
    Error,
    Ok
}

/**
 * Represents the return of a command.
 */
export class Return<RT extends ReturnType = ReturnType, T = unknown> {
    /**
     * Creates a new command return.
     * @param type - The type of return.
     * @param value - The value to return.
     */
    constructor(private type: ReturnType, public value: T) {}

    /**
     * Check whether this return is a custom error.
     */
    public isCustomError(): this is Return<ReturnType.CustomError, string> {
        return this.type === ReturnType.CustomError && typeof this.value === 'string'
    }

    /**
     * Check whether this return is an error.
     */
    public isError(): this is Return<ReturnType.Error, Error> {
        return this.type === ReturnType.Error && this.value instanceof Error
    }

    /**
     * Check whether this return is ok.
     */
    public isOk(): this is Return<ReturnType.Ok, unknown> {
        return this.type === ReturnType.Ok
    }
}