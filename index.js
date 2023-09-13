const Discord = require("discord.js");
const prefix = "*"
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client();
const fs = require("fs");
client.prefix = prefix;
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
const http = require("http");
const express = require("express");
const app = express();
const Gamedig = require("gamedig");
let playersSize;


for (const file of commandFiles) { 
  const command = require(`./commands/${file}`); // by : zef

  client.commands.set(command.name, command); // by : zef
}

let lastMessageId = null;
function sendMTAStatus(channel) {
  Gamedig.query({
    type: "mtasa",
    host: "156.245.5.39",
    port: "22003",
  })
    .then((state) => {
      let embed = new Discord.MessageEmbed()
        .setColor("GREEN") // Assuming server is online
        .setTitle(state["name"])
        .addField("Status", "Online", true)
        .addField(
          "Players",
          state["raw"]["numplayers"] + "/" + state["maxplayers"],
          true
        );

      if (state.players && state.players.length > 0) {
        // If there are players, list them
        let playerList = state.players.map((player) => player.name).join(", ");
        embed.addField("Players Online", playerList);
      } else {
        embed.addField("Players Online", "No players online.");
      }

      // Send the status to the specified channel
      if (lastMessageId) {
        // If a message ID exists, attempt to edit the last message
        channel.messages.fetch(lastMessageId)
          .then((message) => {
            message.edit({ embed })
              .then(() => {
                console.log('Last message edited.');
              })
              .catch((error) => {
                console.error('Error editing last message:', error);
              });
          })
          .catch(() => {
            // If the message couldn't be found, send a new one
            channel.send({ embed })
              .then((message) => {
                lastMessageId = message.id; // Store the new message's ID
                console.log('New message sent.');
              })
              .catch((error) => {
                console.error('Error sending new message:', error);
              });
          });
      } else {
        // If there's no last message ID, send a new message
        channel.send({ embed })
          .then((message) => {
            lastMessageId = message.id; // Store the new message's ID
            console.log('New message sent.');
          })
          .catch((error) => {
            console.error('Error sending new message:', error);
          });
      }
    })
    .catch((error) => {
      let embed = new Discord.MessageEmbed()
        .setColor("RED") // Server is offline or query failed
        .setTitle("Iraq Lions")
        .addField("Status:", "Offline");

      // Send the status to the specified channel
      if (lastMessageId) {
        // If a message ID exists, attempt to edit the last message
        channel.messages.fetch(lastMessageId)
          .then((message) => {
            message.edit({ embed })
              .then(() => {
                console.log('Last message edited.');
              })
              .catch((error) => {
                console.error('Error editing last message:', error);
              });
          })
          .catch(() => {
            // If the message couldn't be found, send a new one
            channel.send({ embed })
              .then((message) => {
                lastMessageId = message.id; // Store the new message's ID
                console.log('New message sent.');
              })
              .catch((error) => {
                console.error('Error sending new message:', error);
              });
          });
      } else {
        // If there's no last message ID, send a new message
        channel.send({ embed })
          .then((message) => {
            lastMessageId = message.id; // Store the new message's ID
            console.log('New message sent.');
          })
          .catch((error) => {
            console.error('Error sending new message:', error);
          });
      }
    });
}

client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`); // by : zef
	client.user.setActivity('Iraq Lions!', { type: 'PLAYING' }) // by : zef
	setInterval(() => {
    
    const channel = client.channels.cache.get('1148501158210568202');
    if (channel) {
      sendMTAStatus(channel);
    }
  }, 15000); // Every 30 seconds
 });

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return; // by : zef
  const args = message.content.slice(prefix.length).trim().split(/ +/); // by : zef
  const command = args.shift().toLowerCase(); // by : zef
  if (!client.commands.has(command)) return; // by : zef

  try {
    client.commands.get(command).run(client, message, args); // by : zef
  } catch (error) {
    console.error(error); // by : zef
    message.reply("حدث خطأ أثناء محاولة تشغيل هذا الأمر!"); // by : zef
  }
});

const token = process.env.TOKENN;
client.login(token);

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Working bro');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
