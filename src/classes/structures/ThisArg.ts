import { Return, ReturnType } from "./Return";

/**
 * Represents the "this" argument of a command.
 */
export class ThisArg {
    /**
     * @template {unknown} T
     * Returns an success value.
     * @param value - The value to return.
     * @returns {Return<ReturnType.Ok, T>}
     */
    ok<T = unknown>(value?: T) {
        return new Return(ReturnType.Ok, value)
    }

    /**
     * Returns a custom error message.
     * @param message - The message to return.
     * @returns {Return<ReturnType.CustomError, string>}
     */
    customError(message: string) {
        return new Return(ReturnType.CustomError, message)
    }

    /**
     * Returns an error.
     * @param error - The error instance to return.
     * @returns {Return<ReturnType.Error, Error>}
     */
    error(error: Error) {
        return new Return(ReturnType.Error, error)
    }
}