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
