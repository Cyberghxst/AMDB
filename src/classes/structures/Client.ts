import { EventHandlers, TelegramClient, type ClientOptions } from 'telegramsjs'
import type { TelegramEventHandler } from './EventHandler'
import { EventManager } from '@managers/EventManager'
import SpottyDL from 'spottydl'

// Load the default events.
EventManager.load()

/**
 * Structure representing the setup options for
 * the telegram client.
 */
export interface ClientSetupOptions extends ClientOptions {
	/**
	 * The events this client must listen to.
	 */
	events: (keyof EventHandlers)[]
	/**
	 * The auth token to login to telegram.
	 */
	token: string
}

/**
 * Structure representing the telegram client.
 */
export class Client extends TelegramClient {
	#allowedEvents: (keyof EventHandlers)[]
	constructor(options: ClientSetupOptions) {
		super(options.token, options)
		this.#allowedEvents = options.events
		this.#bindEvents()
	}

	/**
	 * Bind the loaded events to the client.
	 */
	#bindEvents() {
		for (const name of this.#allowedEvents) {
			const event = EventManager.get<TelegramEventHandler>('telegram', name)
			if (event) event.attach(this)
		}
	}
}
