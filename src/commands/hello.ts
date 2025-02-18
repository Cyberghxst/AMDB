import { AlwaysExecuteCommand } from '@decorators/AlwaysExecuteCommand'
import { ArgType, Command } from '@decorators/Command'
import { instagramGetUrl } from 'instagram-url-direct'
import { Container } from '@structures/Container'
import type { Message } from 'telegramsjs'

export default class Any extends Container {
	@Command({
		names: ['sp'],
		type: 'message',
		args: [
			{
				name: 'URL',
				description: 'The URL of the song to be downloaded.',
				type: ArgType.Text
			}
		]
	})
	async hello(message: Message, [url]: [string]) {
		const result = await instagramGetUrl(url)
		console.log([result.url_list])
	}

	@AlwaysExecuteCommand({ type: 'message' })
	async ok(message: Message) {
		await message.reply('ok!')
	}
}
