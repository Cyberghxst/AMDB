import { Container } from '@structures/Container'
import { BaseCommand, CommandExecutor } from './Command'
import { CommandManager } from '@managers/CommandManager'

/**
 * Takes the function below and compiles to an actual command.
 * @param data - The command data.
 * @returns {(target: Container, key: string, descriptor: PropertyDescriptor): void}
 */
export function AlwaysExecuteCommand(data: Omit<BaseCommand, 'names'>) {
	return (target: Container, key: string, descriptor: PropertyDescriptor) => {
		if (!target.commands) target.commands = []

		const executor = descriptor.value as CommandExecutor
		CommandManager.addCommand({
			...data,
			names: [],
			alwaysExecute: true,
			execute: executor
		})
	}
}
