import type { CompiledCommand } from '@decorators/Command'

/**
 * Represents a command container.
 */
export class Container {
	/**
	 * The commands stored in this container.
	 */
	commands: CompiledCommand[]
	constructor() {
		this.commands = []
	}
}
