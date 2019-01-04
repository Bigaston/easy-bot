const config = require("./config.json")

const Discord = require("discord.js");
const client = new Discord.Client();

var version = "0.1.0";

client.login(config.token);

client.on("ready", async () => {
	client.user.setGame(version);
});

function chooseResponse(pTable) {
	// Choose a response in pTable
	return pTable[Math.floor(Math.random() * pTable.length)]
}

function replaceArg(pText, pArgs, pMessage) {
	// Replace the args balise in the text
	
	let text = pText
	 
	for (var i=0; i < pArgs.length; i++) {
		text = text.replace(`%${i}%`, pArgs[i])
	}
	text = text.replace("%me%", pMessage.author.username)
	text = text.replace("%all%", pMessage.content.replace(pArgs[0] + " ", ""))
	text = text.replace(/%[0-9]*%/gi, "nothing")
	return text
}

var script = {
	"!bonjour" : ["Bonjour %me%!", "Aurevoir"],
	"!hug" : "%me% fait un hug à %1%",
	"!phrase" : "%me% : %all%"
};

client.on("message", message => {
    if(message.author.bot) return;
    args = message.content.split(/[ ]+/)

	if (args[0] in script) {
		if (Array.isArray(script[args[0]])) {
			var response = chooseResponse(script[args[0]]);
			response = replaceArg(response, args, message);
			message.channel.send(response);
		} else {
			var response = script[args[0]];
			response = replaceArg(response, args, message);
			message.channel.send(response);
		}
	}
})