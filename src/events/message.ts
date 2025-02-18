import { enforceRequiredArgs } from '@utils/enforceRequiredArgs'
import { TelegramEventHandler } from '@structures/EventHandler'
import { CommandManager } from '@managers/CommandManager'
import { parseArgs } from '@utils/parseArgs'

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

		if (command.args && !enforceRequiredArgs(args, command.args.map(x => x.name))) {
			await message.reply(`${command.names[0]} requires ${command.args.length} arguments!`)
			return;
		}

		const parsedValues = parseArgs(args, (command.args ?? []).map(x => x.type))
		await command.execute(message, parsedValues)
	}
})
