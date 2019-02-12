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
let isGreetBot

const userConfig = {
	userCommand: '!',
	deleteMessageTimeout: 10
}

// TODO Once join the server send the !help message.
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	isGreetBot = client.users.find(
		user => user.username.toLowerCase() === 'greetbot'
	).id
		? true
		: false
})

client.on('guildMemberAdd', member => {
	let userId = member.user.id
	let userBot = member.user.bot
	if (!userBot) {
		getWelcomeMessage()
			.then(result => {
				// TODO Allow user to change output channel.
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

client.on('message', message => {
	let userBot = message.author.bot
	if (!userBot || isGreetBot) {
		let userMessage = message.content
		let userInputCommand = userMessage.slice(0, 1)
		if (userInputCommand === userConfig.userCommand) {
			let messageArgument = userMessage.split(' ', 1)
			let userMessageArgument = messageArgument[0].slice(
				1,
				messageArgument[0].length
			)
			switch (userMessageArgument.toLowerCase()) {
				case 'add':
					let messageContent = userMessage.slice(
						1 + messageArgument[0].length,
						userMessage.length
					)
					if (messageContent !== '') {
						greetMessagesList.push(messageContent)
						// ANCHOR At mention the user who run the command
						botNotification(
							message,
							'Notification',
							'Your greet message `' + messageContent + '` is added.',
							'43b581',
							true
						)
					} else {
						botNotification(
							message,
							'Note',
							'You need to type a greet message.',
							'faa61a',
							true
						)
					}
					break
				case 'delete':
					let deleteMessageId = userMessage.slice(
						1 + messageArgument[0].length,
						userMessage.length
					)
					if (deleteMessageId != '' || Number.isInteger(deleteMessageId)) {
						let deletedGreetMessage = greetMessagesList.splice(
							deleteMessageId - 1,
							1
						)
						botNotification(
							message,
							'Alert',
							'Your greet message `' + deletedGreetMessage + '` is deleted.',
							'F04747',
							true
						)
						message.channel.send(userConfig.userCommand + 'list')
					} else {
						botNotification(
							message,
							'Note',
							'Enter the message ID to delete the message.',
							'faa61a',
							true
						)
					}
					break
				case 'edit':
					let newEditMessage = userMessage.slice(
						1 + messageArgument[0].length + 2,
						userMessage.length
					)
					let editMessageId = userMessage.slice(
						1 + messageArgument[0].length,
						userMessage.length - newEditMessage.length
					)
					let oldEditMessage = greetMessagesList[editMessageId - 1]
					if (newEditMessage != '' || Number.isInteger(editMessageId)) {
						greetMessagesList[editMessageId - 1] = newEditMessage
						botNotification(
							message,
							'Notification',
							'Your greet message `' +
							editMessageId +
							': ' +
							oldEditMessage +
							'` is edited.',
							'43b581',
							true
						)
					} else {
						botNotification(
							message,
							'Note',
							'Enter the message ID and new message to edit the message.',
							'faa61a',
							false
						)
					}
					break
				case 'list':
					let userArgumentGreetMessageList = []
					greetMessagesList.forEach((item, index) => {
						userArgumentGreetMessageList.push(index + 1 + ': ' + item)
					})
					break
				case 'config':
					// TODO User can use this command to config the bot
					botNotification(
						message,
						'Note',
						"We're still working on this feature",
						'faa61a',
						true
					)
					break
				case 'help':
					break
				case 'import':
					// TODO Feature to import messages in bulk
					botNotification(
						message,
						'Note',
						"We're still working on this feature",
						'faa61a',
						true
					)
					break
				default:
					message.channel.send(userConfig.userCommand + 'help')
			}
		}
	} else {
		if (!isGreetBot) {
			console.log('You are a bot')
		}
	}
})

// NOTE Red 'F04747', Green '43b581'
const botNotification = (
	message,
	botReplyTitle,
	botReplyDescription,
	botReplyNotificationColor,
	botDeleteMessage
) => {
	message.channel
		.send({
			embed: {
				title: botReplyTitle,
				description: botReplyDescription,
				color: parseInt(`0x${botReplyNotificationColor}`)
			}
		})
		.then(msg => {
			if (botDeleteMessage) {
				deleteBotMessage(msg, userConfig.deleteMessageTimeout)
			}
		})
		.catch(error => {
			console.log(error)
		})
}

const deleteBotMessage = (message, time) => {
	message
		.delete(time * 1000)
		.then(msg => {
			console.log('Message deleted successfully')
		})
		.catch(err => {
			console.log(err)
		})
}

async function getWelcomeMessage() {
	const number = randomNumber(1, greetMessagesList.length)
	console.log(number + ': ' + greetMessagesList[number])
	if (greetMessagesList.length !== 0) {
		return greetMessagesList[number]
	} else {
		return 'I have no greet messages to show :crying_cat_face:'
	}
}

const randomNumber = (min, max) => {
	// TODO Make this function more functionable
	// https://chancejs.com/basics/integer.html
	return Math.floor(Math.random() * (max - min)) + min
}

client.login(process.env.DISCORD_BOT_TOKEN)
app.listen(process.env.PORT || 3000)
