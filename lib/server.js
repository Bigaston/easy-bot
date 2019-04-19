var fs = require('fs');
eval(fs.readFileSync("./lib/function.js").toString());

module.exports = {
	param : function replaceParam(pTexte, pMessage) {
		text = pTexte;

		while (text.match(/%someone%/) != null) {
			choosed_user = pMessage.guild.members.random()

			if (choosed_user.nickname != undefined) {
				text = text.replace("%someone%", choosed_user.nickname)
			} else {
				text = text.replace("%someone%", choosed_user.displayName)
			}
		}

		while (text.match(/%someone:nobot%/) != null) {
			choosed_user = pMessage.guild.members.random()
			while (choosed_user.user.bot == true) {
				choosed_user = pMessage.guild.members.random()
			}

			if (choosed_user.nickname != undefined) {
				text = text.replace("%someone:nobot%", choosed_user.nickname)
			} else {
				text = text.replace("%someone:nobot%", choosed_user.displayName)
			}
		}

		return text;
	}
}