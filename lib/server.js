var fs = require('fs');
eval(fs.readFileSync("./lib/function.js").toString());

module.exports = {
	param : function replaceParam(pTexte, pMessage) {
		text = pTexte;

		while (text.match(/%someone%/) != null) {
			text = text.replace("%someone%", pMessage.guild.members.random().displayName)
		}

		return text;
	}
}