import type { CompiledCommand } from '@decorators/Command'

/**
 * The command manager.
 */
export class CommandManager {
	static commands = new Map<number, CompiledCommand>()
	/**
	 * Adds a command to the registry.
	 * @param command - The command to add.
	 * @returns {void}
	 */
	static addCommand(command: CompiledCommand) {
		CommandManager.commands.set(CommandManager.commands.size, command)
	}

	/**
	 * Get a command from the registry.
	 * @param cb - The callback to match.
	 * @returns {?CompiledCommand}
	 */
	static getCommand(cb: (command: CompiledCommand) => boolean) {
		return CommandManager.toArray().find(cb) ?? null
	}

	/**
	 * Returns the cached commands as array.
	 * @returns {CompiledCommand[]}
	 */
	static toArray(): CompiledCommand[] {
		return Array.from(CommandManager.commands.values())
	}
}
