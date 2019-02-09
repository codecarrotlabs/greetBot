const express = require('express')
const Discord = require('discord.js')
require('dotenv').config()
const app = express()
const client = new Discord.Client()
const channelInput = process.env.channelInput
const channelOutput = process.env.channelOutput

app.listen(process.env.PORT)
let greetMessagesList = []
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on('guildMemberAdd', member => {
	let userId = member.user.id
	let userBot = member.user.bot
	if (!userBot) {
		member.guild.channels.get(channelOutput).send(
			'<@!' +
				userId +
				'> ' +
				getWelcomeMessage().then(res => {
          console.log(res);
					return res;
				}).catch(err => {
          console.log(err);
        })
		)
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
	let greetMessagesList = []
	fetchAllMessages()
		.then(result => {
			return (greetMessagesList = result)
		})
		.catch(error => {
			console.log(error)
		})
	console.log(greetMessagesList)
	console.log(greetMessagesList.length)
	const number = randomNumber(1, greetMessagesList.length)
	console.log(number + ': ' + greetMessagesList[number])
	return greetMessagesList[number]
}

function randomNumber(min, max) {
	// TODO Make this function more functionable
	return Math.floor(Math.random() * (max - min)) + min
}

client.login(process.env.TOKEN)
