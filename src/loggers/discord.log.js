'use strict'

const {Client, GatewayIntentBits} = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Logged is as ${client.user.tag}`)
})

const token = "MTI1MDA0NzM1MTM1MTkzOTExMg.GRpJVT.GLUJ-d8bdsYIVG9jGowpFdOytRVHqohSkj9BlY"
client.login(token)

client.on('messageCreate', msg => {
    if(msg.author.bot) return;
    if(msg.content === 'hello'){
        msg.reply('Hello! How can i assists you today!')
    }
})