import type { EventHandlers } from 'telegramsjs'
import type { Client } from './Client'

export type AssertArgs<T> = T extends unknown[] ? T : never

export type ClientEvents = {
	[K in keyof EventHandlers]: Parameters<EventHandlers[K]>
}

/**
 * The event handler data.
 */
export interface EventHandlerData<
	Events = Record<string, unknown[]>,
	K extends keyof Events = keyof Events
> {
	/**
	 * The name of the event.
	 */
	name: K
	/**
	 * Whether execute the event once.
	 */
	once: boolean
	/**
	 * The callback to execute.
	 */
	execute: (
		this: Client,
		...args: AssertArgs<Events[K]>
	) => void | Promise<void>
}

/**
 * The base event handler class.
 */
export abstract class BaseEventHandler<
	Events = Record<string, unknown>,
	Names extends keyof Events = keyof Events
> {
	constructor(private data: EventHandlerData<Events, Names>) {}
	abstract attach(client: Client): void
	public get name() {
		return this.data.name
	}
	public get once() {
		return this.data.once
	}
	public get execute() {
		return this.data.execute
	}
}

/**
 * The discord event handler.
 */
export class TelegramEventHandler<
	K extends keyof ClientEvents = keyof ClientEvents
> extends BaseEventHandler<ClientEvents, K> {
	attach(client: Client) {
		client[this.once ? 'once' : 'on'](
			this.name,
			this.execute.bind(client) as any
		)
	}
}
