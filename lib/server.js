var fs = require('fs');
eval(fs.readFileSync("./lib/function.js").toString());

module.exports = {
	param : function replaceParam(pTexte, pGuild) {
		text = pTexte;

		while (text.match(/%server:someone%/) != null) {
			choosed_user = pGuild.members.random()

			if (choosed_user.nickname != undefined) {
				text = text.replace("%server:someone%", choosed_user.nickname)
			} else {
				text = text.replace("%server:someone%", choosed_user.displayName)
			}
		}

		while (text.match(/%server:someone:nobot%/) != null) {
			choosed_user = pGuild.members.random()
			while (choosed_user.user.bot == true) {
				choosed_user = pGuild.members.random()
			}

			if (choosed_user.nickname != undefined) {
				text = text.replace("%server:someone:nobot%", choosed_user.nickname)
			} else {
				text = text.replace("%server:someone:nobot%", choosed_user.displayName)
			}
		}

		text = text.replace("%server:number:member%", pGuild.members.array().length);

		return text;
	}
}