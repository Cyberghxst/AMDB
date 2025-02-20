import { AlwaysExecuteCommand } from '@decorators/AlwaysExecuteCommand'
import { ArgType, Command } from '@decorators/Command'
import { instagramGetUrl } from 'instagram-url-direct'
import { Container } from '@structures/Container'
import type { Message } from 'telegramsjs'
import { MatchCommand } from '@decorators/MatchCommand'
import type { ThisArg } from '@structures/ThisArg'
import fs, { readFileSync } from 'fs'
import http from 'https'

function download(url: string, dest: string) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest, { flags: "wx" });

        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => {}); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });

        request.on("error", err => {
            file.close();
            fs.unlink(dest, () => {}); // Delete temp file
            reject(err.message);
        });

        file.on("finish", () => {
            resolve(void 0);
        });

        file.on("error", err => {
            file.close();

            if (err.message === "EEXIST") {
                reject("File already exists");
            } else {
                fs.unlink(dest, () => {}); // Delete temp file
                reject(err.message);
            }
        });
    });
}

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
	async hello(this: ThisArg, message: Message, [url]: [string]) {
		const result = await instagramGetUrl(url)
		console.log([result.url_list])

		return this.ok()

	}

	@MatchCommand({
		names: /(https:\/\/)?www\.instagram\.com\/\w+\/[a-zA-Z0-9_]+/g,
		type: 'message'
	})
	async sp(this: ThisArg, message: Message, matches: string[]) {
		if (!matches === null) return

		const match = matches![0]
		const result = await instagramGetUrl(match).catch(e => null)
		if (!result || result.url_list.length === 0) {
			return this.customError('I was unable to fetch the given media!')
		}

		const response = await fetch(result.url_list[0])
		if (!response.ok) {
			return this.customError('I was unable to fetch the given media!')
		}

		const extension = result.url_list[0].split('?')[0].split('.').pop()!
		await download(result.url_list[0], `file.${extension}`)
		if (response.headers.get('content-type')?.includes('image')) {
			const image = readFileSync(`file.${extension}`)
			const msg = await message.client.sendPhoto({
				chatId: message.chat!.id,
				photo: image
			})
			if (!msg) {
				return this.customError('I was unable to send the given media!')
			}
		} else if (response.headers.get('content-type')?.includes('video')) {
			const video = readFileSync(`file.${extension}`)
			const msg = await message.client.sendVideo({
				chatId: message.chat!.id,
				video
			})
			if (!msg) {
				return this.customError('I was unable to send the given media!')
			}
		}

		return this.ok()
	}
}
