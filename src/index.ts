import { Client } from '@structures/Client'
process.loadEnvFile()

const client = new Client({
	events: ['ready'],
	token: process.env.TOKEN!
})

client.login()
