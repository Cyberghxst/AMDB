import { TelegramEventHandler } from '@structures/EventHandler'
import type { CompiledCommand } from '@decorators/Command'
import { CommandManager } from '@managers/CommandManager'
import { parseArgs } from '@utils/parseArgs'
import { ThisArg } from '@structures/ThisArg'
import type { Message } from 'telegramsjs'

/**
 * Runs the given command.
 * @param command - The command to run.
 * @param message - The current message context.
 * @param args - The additional args to add.
 * @returns {Promise<Return>}
 */
const runCommand = async (command: CompiledCommand, message: Message, args?: unknown[]) => {
	const thisArg = new ThisArg()
	const result = await command.execute.call(thisArg, message, args)

	return result
}

export default new TelegramEventHandler({
	name: 'message',
	once: false,
	async execute(message) {
		if (message.author?.isBot ?? false) return
		const commands = CommandManager.toArray()
		const alwaysExecuteCommands = [...commands].filter(x => x.alwaysExecute)
		if (alwaysExecuteCommands.length > 0) {
			for (const command of alwaysExecuteCommands) {
				const res = await runCommand(command, message)
				if (res.isCustomError()) {
					await message.reply(res.value)
					break
				} else if (res.isError()) {
					await message.reply(res.value.message)
					break
				}
			}
		}

		const args = (message.content ?? '').split(/ +/g)
		if (args[0].startsWith('/')) {
			let commandName = args.shift()!.slice(1)
			const command = commands.find(cmd => cmd.names.includes(commandName))
			if (!command) return

			// Check if enough arguments are passed.
			if (command.args && command.args.length > args.length) {
				await message.reply(
					`Command "${command.names[0]}" requires ${command.args.length} args, but you provided ${args.length}!`
				)
				return
			}

			const parsedValues = parseArgs(
				args,
				(command.args ?? []).map(x => x.type)
			)
			const res = await runCommand(command, message)
			if (res.isCustomError()) {
				await message.reply(res.value)
			} else if (res.isError()) {
				await message.reply(res.value.message)
			}
		} else {
			const matchCommands = commands.filter(cmd => cmd.match)
			const matchCommand = matchCommands.find(cmd =>
				message.content!.match(cmd.names as unknown as RegExp)
			)
			if (!matchCommand) return

			const matches = message.content!.match(
				matchCommand.names as unknown as RegExp
			)
			const res = await runCommand(matchCommand, message, matches as string[])
			if (res.isCustomError()) {
				await message.reply(res.value)
			} else if (res.isError()) {
				await message.reply(res.value.message)
			}
		}
	}
})
