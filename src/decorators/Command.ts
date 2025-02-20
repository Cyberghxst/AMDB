import type { EventHandlers as ClientEvents, Message } from 'telegramsjs'
import { CommandManager } from '@managers/CommandManager'
import type { Container } from '@structures/Container'
import type { ThisArg } from '@structures/ThisArg'
import type { Return } from '@structures/Return'

/**
 * Constant values representing an argument type.
 */
export enum ArgType {
	Boolean,
	Float,
	Integer,
	Text
}

/**
 * A structure representing a command argument.
 * @example
 * '/name arg1 arg2'
 */
export interface CommandArgument {
	/**
	 * The name of the argument.
	 */
	name: string
	/**
	 * A brief description about the argument.
	 */
	description: string
	/**
	 * The type of this argument.
	 */
	type: ArgType
}

/**
 * A structure representing a command.
 */
export interface BaseCommand<T = string | string[]> {
	/**
	 * The name(s) that can identify this command.
	 */
	names: T
	/**
	 * The name of the event this command
	 * should be executed within.
	 */
	type: keyof ClientEvents
	/**
	 * The arguments this may require.
	 */
	args?: CommandArgument[]
	/**
	 * Whether mark this command
	 * as an always execute callback.
	 */
	alwaysExecute?: true
	/**
	 * Whether mark this command
	 * as an match command.
	 */
	match?: T extends RegExp ? true : never
}

/**
 * The executor of a command.
 */
export type CommandExecutor = (
	this: ThisArg,
	message: Message,
	args?: unknown[]
) => Promise<Return> | Return

/**
 * Represents a compiled command.
 */
export interface CompiledCommand<T = string | string[]> extends BaseCommand<T> {
	execute: CommandExecutor
}

/**
 * Takes the function below and compiles to an actual command.
 * @param data - The command data.
 * @returns {(target: Container, key: string, descriptor: PropertyDescriptor): void}
 */
export function Command(data: BaseCommand) {
	return (target: Container, key: string, descriptor: PropertyDescriptor) => {
		if (!target.commands) target.commands = []

		const executor = descriptor.value as CommandExecutor
		CommandManager.addCommand({ ...data, execute: executor })
	}
}
