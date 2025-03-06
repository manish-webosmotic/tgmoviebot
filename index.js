import fs from 'fs';
import dotenv from 'dotenv';
import { Input, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

dotenv.config();
const TOKEN = process.env.BOT_TOKEN;
const GROUP_ID = process.env.GROUP_ID;
if (!TOKEN || !GROUP_ID) {
	console.error('BOT_TOKEN or GROUP_ID not found in .env file');
	process.exit(1);
}
const bot = new Telegraf(TOKEN);
const filesPath = './db.json';
const fileName = 'db.json';

const readFiles = () => {
	if (!fs.existsSync(filesPath)) {
		fs.writeFileSync(filesPath, JSON.stringify({}));
	}
	return JSON.parse(fs.readFileSync(filesPath));
};

const writeFiles = (files) => {
	fs.writeFileSync(filesPath, JSON.stringify(files, null, 4));
};

bot.on(message('video'), async (ctx) => {
	if (ctx?.message?.chat?.id === GROUP_ID) {
		const message = ctx?.message;
		let name = message?.caption || message?.text;
		if (!name) {
			return ctx.reply('Provide a name for the movie.');
		}
		let fileId = message?.video?.file_id;
		const files = readFiles();
		while (files[name]) {
			const randomNum = Math.floor(100 + Math.random() * 900);
			name = `${name}${randomNum}`;
		}
		files[name] = fileId;
		writeFiles(files);
		return ctx.reply(`Movie saved with name: ${name}`);
	}
});

bot.command('movie', async (ctx) => {
	const name = ctx.message.text.split(' ')[1];
	if (!name) {
		return ctx.reply('Please provide a movie name.\n Like /movie ironman');
	}
	await ctx.reply(`Searching for "${name}"...`);
	const files = readFiles();
	const fileId = files[name];
	if (!fileId) {
		return ctx.reply('Movie not available.');
	}
	try {
		await ctx.reply(`Sending "${name}"...`);
		await ctx.replyWithVideo(
			Input.fromFileId(fileId),
			{
				caption: `Here's you movie: ${name}`
			}
		);
	} catch (err) {
		return ctx.reply('Failed to retrieve the movie.');
	}
});

bot.command('getdb', async (ctx) => {
	if (fs.existsSync(filesPath)) {
		await ctx.reply('Sending DB...');
		return await ctx.sendDocument({
			source: fs.readFileSync(filesPath),
			filename: fileName
		});
	}
	return ctx.reply('Movie DB not available');
});

bot.command('id', (ctx) => {
	const chatId = ctx.message.chat.id;
	ctx.reply(`The chat ID is: ${chatId}`);
});

bot.command('list', async (ctx) => {
    const files = readFiles();
    const movieList = Object.keys(files);
    
    if (movieList.length === 0) {
        return ctx.reply('No movies available in the database.');
    }
    
    await ctx.reply('Available movies:\n\n' + movieList.join('\n'));
});

bot.launch(() => {
	console.log('Bot is running...');
});
