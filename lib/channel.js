var fs = require('fs');
eval(fs.readFileSync("./lib/function.js").toString());

module.exports = {
	trigger : function testChannel(pScript, pMess) {
		//return 0 if not find, 1 if find
		key = Object.keys(pScript);

		chanTest = false;

		for (k = 0; k < key.length; k++) {
			if (key[k].match(/#channel:[0-9]+#/) != undefined) {
				chanTest = true;
				if (key[k].match(/#channel:[0-9]+#/)[0] == "#channel:" + pMess.channel.id + "#") {
					return pScript["#channel:" + pMess.channel.id + "#"];
				}
			}
		}

		if ("#default#" in pScript && chanTest) {
			return pScript["#default#"];
		}

		return 0;
	},
	param : function replaceParam(pTexte, pMessage) {
		text = pTexte;
		text = text.replace("%channel:name%", pMessage.channel.name);

		return text;
	},

	event : function triggerEvent(pText, client) {
		text = pText;

		if (pText.match(/!channel:sendOnly\[[0-9]*\]!/) != null) {
			if (pText.match(/!channel:sendOnly\[[0-9]*\]!/).length == 1) {
				chan = client.channels.get(pText.match(/!channel:sendOnly\[[0-9]*\]!/)[0].replace("!channel:sendOnly[", "").replace("]!", ""))
				text = text.replace(/!channel:sendOnly\[[0-9]*\]!/, "")
	
				chan.send(text)
				
				text = "";
			}
		}

		if (pText.match(/!channel:sendTo\[[0-9]*\]!/) != null) {
			trig = pText.match(/!channel:sendTo\[[0-9]*\]!/);

			for (i = 0; i < trig.length; i++) {
				chan = client.channels.get(trig[i].replace("!channel:sendTo[", "").replace("]!", "")) 
				text = text.replace(trig[i], "")

				chan.send(text.replace(/!channel:sendTo\[[0-9]*\]!/g, ""))
			}

			text = ""
		}

		if (pText.match(/!channel:send\[[0-9]*\]!/) != null) {
			trig = pText.match(/!channel:send\[[0-9]*\]!/);

			for (i = 0; i < trig.length; i++) {
				chan = client.channels.get(trig[i].replace("!channel:send[", "").replace("]!", "")) 
				text = text.replace(trig[i], "")

				chan.send(text.replace(/!channel:send\[[0-9]*\]!/g, ""))
			}
		}

		return text;
	}
}