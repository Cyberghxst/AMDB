import { TelegramEventHandler } from '@structures/EventHandler'

export default new TelegramEventHandler({
	name: 'ready',
	once: true,
	execute(client) {
		console.log(client.user?.username, 'is ready')
	}
})
