const express = require('express')
const Discord = require('discord.js')
require('dotenv').config()
const app = express()
const client = new Discord.Client()

app.get('/', (req, res) => {
	res.send('Your Bot is running at port ' + process.env.PORT || 3000)
})

// NOTE Greet message Array accessible globally
let greetMessagesList = []
// NOTE Greet bot boolean variable
let isGreetBot;
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	fetchAllMessages()
	isGreetBot = client.users.find(user => user.username.toLowerCase() === 'greetbot').id ? true : false;
})

client.on('guildMemberAdd', member => {
	let userId = member.user.id
	let userBot = member.user.bot
	if (!userBot) {
		getWelcomeMessage()
			.then(result => {
				const channelOutput = member.guild.channels.find(
					channel => channel.name === 'general'
				).id
				member.guild.channels
					.get(channelOutput)
					.send('<@!' + userId + '> ' + result)
			})
			.catch(error => {
				console.log(error)
			})
	}
})

async function fetchAllMessages() {
	const channel = client.channels.find(
		channel => channel.name === 'greetmessages'
	)
	const channelMessage = await channel.fetchMessages()
	try {
		channelMessage.map(message => {
			greetMessagesList.push(message.content)
		})
		return (greetMessagesList = greetMessagesList.reverse())
	} catch (error) {
		console.log(
			"This channel doesn't exist, please create one with the name 'greetmessages'."
		)
		console.log(error)
	}
}

async function getWelcomeMessage() {
	const number = randomNumber(1, greetMessagesList.length)
	console.log(number + ': ' + greetMessagesList[number])
	return greetMessagesList[number]
}

function randomNumber(min, max) {
	// TODO Make this function more functionable
	// https://chancejs.com/basics/integer.html
	return Math.floor(Math.random() * (max - min)) + min
}

client.login(process.env.DISCORD_BOT_TOKEN)
app.listen(process.env.PORT || 3000)