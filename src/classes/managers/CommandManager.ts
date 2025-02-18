import type { CompiledCommand } from '@decorators/Command'
import { Container } from '@structures/Container'
import { recursiveCollectFilePaths } from '@utils/recursiveCollectFilePaths'
import { join } from 'path'

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
	 * Load commands from the given directory.
	 * @param dir - The dir to load the commands from.
	 * @returns {boolean}
	 */
	static load(dir = join(__dirname, '..', '..', 'commands')) {
		const paths = recursiveCollectFilePaths(dir, f => f.endsWith('.js'))
		const commands: (typeof Container)[] = paths.map(
			path => require(path).default
		)
		for (const x of commands) {
			new x()
		}

		return CommandManager.commands.size > 0
	}

	/**
	 * Returns the cached commands as array.
	 * @returns {CompiledCommand[]}
	 */
	static toArray(): CompiledCommand[] {
		return Array.from(CommandManager.commands.values())
	}
}
