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
	}
}