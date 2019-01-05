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

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

var script = {
	"@prefix@" : "!",

	"#errorCommand#" : "Commande non reconue",

	"bonjour" : ["Bonjour %me%!", "Aurevoir"],
	"hug" : "%me% fait un hug à %1%",
	"phrase" : "%me% : %all%",
	"maison" : {
		"serp" : {
			"homme" : "JE SUIS UN SERPENTARD HOMME",
			"femme" : "JE SUIS UN SERPENTARD FEMME"
		},
		"grif" : "JE SUIS UN GRYFFONDOR",
		"#errorCommand#" : "A MARCHE PAS"
	}
};

client.on("message", message => {
	if(message.author.bot) return;
	if (message.content.startsWith(script["@prefix@"])) {
		args = message.content.split(/[ ]+/);
	} else {
		return;
	}

	var sscript = clone(script);
	args[0] = args[0].replace(script["@prefix@"], "");

	for (var i=0; i <= args.length; i++) {
		if (args[i] in sscript) {
			if (Array.isArray(sscript[args[i]])) {
				var response = chooseResponse(sscript[args[i]]);
				response = replaceArg(response, args, message);
				message.channel.send(response);
			} else if (typeof(sscript[args[i]]) == "object") {
				sscript = clone(sscript[args[i]])
			} else {
				var response = sscript[args[i]];
				response = replaceArg(response, args, message);
				message.channel.send(response);
			}
		} else if ("#errorCommand#" in sscript) {
			console.log("bwa")
			message.channel.send(sscript["#errorCommand#"]);
		}
	}
})