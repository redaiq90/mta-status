const Discord = require("discord.js");
const Gamedig = require("gamedig");

module.exports = {
  name: "status",
  run(client, message, args) {
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

        message.channel.send({ embed });
      })
      .catch((error) => {
        let embed = new Discord.MessageEmbed()
          .setColor("RED") // Server is offline or query failed
          .setTitle("Iraq Lions")
          .addField("Status:", "Offline");
        message.channel.send({ embed });
      });
  },
};
