module.exports = {
	param : function(pText, pMessage) {

	},

	event : function(pText, pMessage) {
		text = pText;

		if (text.match(/!role:add\[[a-zA-Z0-9]+\]!/) != undefined) {
			pMessage.member.addRole(pMessage.guild.roles.find(val => val.name === text.match(/!role:add\[[a-zA-Z0-9]+\]!/)[0].replace("!role:add[", "").replace("]!", "")))
				.then(text = text.replace(/!role:add\[[a-zA-Z0-9]+\]!/, ""))
				.catch(console.error);

		}

		if (text.match(/!role:remove\[[a-zA-Z0-9]+\]!/) != undefined) {
			pMessage.member.removeRole(pMessage.guild.roles.find(val => val.name === text.match(/!role:remove\[[a-zA-Z0-9]+\]!/)[0].replace("!role:remove[", "").replace("]!", "")))
				.then(text = text.replace(/!role:remove\[[a-zA-Z0-9]+\]!/, ""))
				.catch(console.error);
		}

		if (text.match(/!role:trigger\[[a-zA-Z0-9]+\]!/) != undefined) {
			if (pMessage.member.roles.find(val => val.name === text.match(/!role:trigger\[[a-zA-Z0-9]+\]! /)[0].replace("!role:trigger[", "").replace("]!", ""))) {
				pMessage.member.removeRole(pMessage.guild.roles.find(val => val.name === text.match(/!role:trigger\[[a-zA-Z0-9]+\]!/)[0].replace("!role:trigger[", "").replace("]!", "")))
					.then(text = text.replace(/!role:trigger\[[a-zA-Z0-9]+\]! /, ""))
					.catch(console.error);
			} else {
				pMessage.member.addRole(pMessage.guild.roles.find(val => val.name === text.match(/!role:trigger\[[a-zA-Z0-9]+\]! /)[0].replace("!role:trigger[", "").replace("]!", "")))
					.then(text = text.replace(/!role:trigger\[[a-zA-Z0-9]+\]! /, ""))
					.catch(console.error);
			}
		}

		return text;
	}
}