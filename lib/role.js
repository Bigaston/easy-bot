module.exports = {
	param : function(pText, pMessage) {

	},

	event : function(pText, pMessage) {
		text = pText;

		if (text.match(/!role:add\[.+\]!/) != undefined) {
			pMessage.member.addRole(pMessage.guild.roles.find(val => val.name === text.match(/!role:add\[.+\]!/)[0].replace("!role:add[", "").replace("]!", "")))
				.then(text = text.replace(/!role:add\[.+\]!/, ""))
				.catch(console.error);
		}

		if (text.match(/!role:remove\[.+\]!/) != undefined) {
			pMessage.member.removeRole(pMessage.guild.roles.find(val => val.name === text.match(/!role:remove\[.+\]!/)[0].replace("!role:remove[", "").replace("]!", "")))
				.then(text = text.replace(/!role:remove\[.+\]!/, ""))
				.catch(console.error);
		}

		if (text.match(/!role:trigger\[.+\]!/) != undefined) {
			if (pMessage.member.roles.find(val => val.name === text.match(/!role:trigger\[.+\]!/)[0].replace("!role:trigger[", "").replace("]!", ""))) {
				pMessage.member.removeRole(pMessage.guild.roles.find(val => val.name === text.match(/!role:trigger\[.+\]!/)[0].replace("!role:trigger[", "").replace("]!", "")))
					.then(text = text.replace(/!role:trigger\[.+\]!/, ""))
					.catch(console.error);
			} else {
				pMessage.member.addRole(pMessage.guild.roles.find(val => val.name === text.match(/!role:trigger\[.+\]!/)[0].replace("!role:trigger[", "").replace("]!", "")))
					.then(text = text.replace(/!role:trigger\[.+\]!/, ""))
					.catch(console.error);
			}
		}

		return text;
	}
}