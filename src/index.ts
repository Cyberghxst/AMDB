import { CommandManager } from '@managers/CommandManager'
import { Client } from '@structures/Client'

process.loadEnvFile()
CommandManager.load()

const client = new Client({
	events: ['message', 'ready'],
	token: process.env.TOKEN!
})

client.login()
