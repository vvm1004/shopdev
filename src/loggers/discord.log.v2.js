'use strict'

const {Client, GatewayIntentBits} = require('discord.js')

class LoggerService {
    constructor(){
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        //add channelId
        this.channelId = "1250049188541108247"

        this.client.on('ready', () => {
            console.log(`Logged is as ${this.client.user.tag}`)
        })
        
        const token = "MTI1MDA0NzM1MTM1MTkzOTExMg.GRpJVT.GLUJ-d8bdsYIVG9jGowpFdOytRVHqohSkj9BlY"
        this.client.login(token)
    }

    sendToFormatCode(logData){
        const {code, message = 'This is some addtional information about the code', title = 'Code Example' } = logData

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16), //Covert hexadecimal color code to integer
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ]
        }
        this.sendToMessage(codeMessage)

    }

    sendToMessage(message = 'message'){
        const channel = this.client.channels.cache.get(this.channelId)
        if(!channel){
            console.error(`Couldn't find the channel...... `, this.channelId)
            return;
        }

        channel.send(message).catch(e => console.error(e))
    }
}

// const LoggerService = new LoggerService();

module.exports = new LoggerService() //loggerService()