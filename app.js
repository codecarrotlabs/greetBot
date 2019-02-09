const express = require('express')
const Discord = require('discord.js')
require('dotenv').config()
const app = express()
const client = new Discord.Client()
const channelInput = process.env.channelInput
const channelOutput = process.env.channelOutput

app.listen(process.env.PORT || 3000)
let greetMessagesList = []
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	fetchAllMessages()
})

client.on('guildMemberAdd', member => {
	let userId = member.user.id
	let userBot = member.user.bot
	if (!userBot) {
		getWelcomeMessage()
			.then(result => {
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
	const channel = client.channels.find(channel => channel.id === channelInput)
	const channelMessage = await channel.fetchMessages()
	try {
		channelMessage.map(message => {
			greetMessagesList.push(message.content)
		})
		return (greetMessagesList = greetMessagesList.reverse())
	} catch (error) {
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
	return Math.floor(Math.random() * (max - min)) + min
}

client.login(process.env.TOKEN)
