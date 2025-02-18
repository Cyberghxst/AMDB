import { recursiveCollectFilePaths } from '@utils/recursiveCollectFilePaths'
import type { BaseEventHandler } from '@structures/EventHandler'
import { join } from 'path'

/**
 * The client events path.
 */
export const defaultClientEventsPath = join(__dirname, '..', '..', 'events')
/**
 * The events registry.
 */
const registry: Record<string, Record<string, BaseEventHandler>> = {}

/**
 * The class that handles every client event.
 */
export class EventManager {
	/**
	 * Adds an event to the given event branch.
	 * @param branchName - The branch to add the event to.
	 * @param event - The event to add.
	 * @returns {void}
	 */
	static add(branchName: string, event: BaseEventHandler) {
		registry[branchName][event.name] = event
	}

	/**
	 * Check whether the given event branch has the given event name.
	 * @param branchName - The branch to check the event on.
	 * @param eventName - The event name to check.
	 * @returns {boolean}
	 */
	static exists(branchName: string, eventName: string) {
		return Object.prototype.hasOwnProperty.call(registry[branchName], eventName)
	}

	/**
	 * Get an event by name.
	 * @param branchName - The name of the branch to get the event from.
	 * @param eventName - The name of the event.
	 */
	static get<T extends BaseEventHandler = BaseEventHandler>(
		branchName: string,
		eventName: string
	) {
		return (registry[branchName][eventName] as T) ?? null
	}

	/**
	 * Load the events of the provided path in the given events branch.
	 * @param name - The name of the events branch.
	 * @param dir - The dir to load the events from.
	 */
	static load(name = 'telegram', dir = defaultClientEventsPath) {
		const paths = recursiveCollectFilePaths(dir, f => f.endsWith('.js'))
		const events: BaseEventHandler[] = paths.map(path => require(path).default)

		// Create the branch for the given name.
		if (!registry[name]) registry[name] = {}

		for (const event of events) {
			EventManager.add(name, event)
		}
	}

	/**
	 * Returns the given branch of loaded events.
	 * @param branch - The branch to get.
	 * @returns {BaseEventHandler[]}
	 */
	static toArray<T extends BaseEventHandler = BaseEventHandler>(
		branch = 'telegram'
	) {
		return Object.values(registry[branch]) as T[]
	}
}
