import { TelegramEventHandler } from '@structures/EventHandler'
import { CommandManager } from '@managers/CommandManager'
import type { Message } from 'telegramsjs'

export default new TelegramEventHandler({
	name: 'message',
	once: false,
	async execute(message) {
		// if (message.author?.isBot) return
		const commands = CommandManager.toArray()
		const alwaysExecuteCommands = [...commands].filter(x => x.alwaysExecute)
		if (alwaysExecuteCommands.length > 0) {
			for (const command of alwaysExecuteCommands) {
				await command.execute(message)
			}
		}

		const args = (message.content ?? '').split(/ +/g)
		let commandName = args.shift()!
		if (commandName.startsWith('/')) commandName = commandName.slice(1)

		const command = commands.find(cmd => cmd.names.includes(commandName))
		if (!command) return

		await command.execute(message)
	}
})
