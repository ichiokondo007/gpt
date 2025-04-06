import { config } from 'dotenv';
import readline from 'readline';
import { OpenAI } from 'openai';

config(); // .env読み込み

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '> ',
});

let messages: { role: 'user' | 'assistant' | 'system', content: string }[] = [
	{ role: 'system', content: 'あなたは優秀なアシスタントです。' },
];

async function chatWithGPT(input: string) {
	messages.push({ role: 'user', content: input });

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: messages,
	});

	const reply = response.choices[0].message.content;
	if (reply) {
		console.log(`🧠: ${reply}`);
		messages.push({ role: 'assistant', content: reply });
	}
}

console.log('💬 ChatGPT CLIへようこそ。終了するには Ctrl+C を押してください。');
rl.prompt();

rl.on('line', async (line) => {
	const input = line.trim();
	if (input) {
		await chatWithGPT(input);
	}
	rl.prompt();
});
