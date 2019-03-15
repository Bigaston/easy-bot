# Installation
Clone this reposistory and use this command. You need [NodeJS](https://nodejs.org/en/) to run this project.

```
npm install
```

After that, edit the `script.json` file with your bot token and some data! You can check the `example_script.json` file if you want!

The bot need some permission. You can use [this](https://bigaston.github.io/easy-bot/invite.html) very little and ugly website to have all the needed permission! Just past your app id inside.

# Synthax
```
{
	"name-of-the-command" : "Response",
	"other-command" : ["Choose", "one", "response"],
	"custom-params" : "%me% use Pikachu",
	"command" : {
		"subCommand1" : "Execute when user send '!command subCommand1' ",
		"subCommand2" : "Execute when user send '!command subCommand2' "
	}
}
```

## Customs Parameters
You can define some customs parameters whitch is replaced by something :
- `%me%` : The username of who use the command
- `%all%` : All the text after the command 
- `%n%` : The n-th argument. If the user don't specified him, return **nothing**
- `%x-y%` : Generate a random number between x and y

### Date & time :
- `%date:date%` : The current date in your lang format
- `%date:day%` : The current day
- `%date:month%` : The current month
- `%date:year%` : The current year
- `%date:time%` : The current time in hh:ss format
- `%date:hours%` : The current hours
- `%date:min%` : The current minute
- `%date:sec%` : The current seconde

### Channel:
- `%channel:name%` : The name of the current channel

### Exemple :
In the code
```
{
	"!test" : "%me% : %all%",
	"!hug" : "%me% hug %1%
}
```

In Discord
```
Bigaston > !test I like potatoe
EasyBot > Bigaston : I like potatoe

Bigaston > !hug Bob
EasyBot > Bigaston hug Bob

Bigaston > !hug
EasyBot > Bigaston hug nothing
```

## Options
You may define some bot settings in the JSON doc:
- \*`@prefix@` : The prefix to detect the commands
- \*`@token@` : The Discord token of your bot

- \#`@infoChannel@` : The channel id of your annoncement channel

- `@lang@` : The language of your bot for system message (for now "fr", "en" or "de")
- `@customName@` : The nickname of Easy Bot in your server
- `@customGame@` : The custom game of EasyBot

*(\* : Required!) (\# : Required for some event!)*

### Exemple :
In the code
```
{
	"@prefix@" : "!",
	"test" : "Detected!"
}
```

In Discord
```
Bigaston > !test
EasyBot > Detected!

Bigaston > test
```

## Custom Events
You may use custom events to send a message when triggered :
- `#errorCommand#` : executed when a command triggers an error, Can be used in subcommands
- `#default#` : Command used by default. Its utility is in a subcommand to check some arguments
- `#userJoin#` : Executed when a user join the server. You may use the custom parameters `%user%` to notify the user
- `#userLeave#` : Executed when a user leave the server. You may use the custom parameters `%user%` to write the user name
- `#channel:[channelId]#` : Test if the message is from the channel with id "channelId". You have to use this just under the command! You can use #default# to specify the action if it's not in channelId.

### Exemple :
In the code
```
{
	"test" : "This is a test!",
	"hi" : {
		"monday" : "It's monday!",
		"#errorCommand#" : "You need to specify a day!"
	},
	"other-test" : {
		"yes" : "YES!!",
		"#errorCommand#" : "You need to specify an argument!",
		"#default#" : "You choose the default branch with %1%"
	}
	"#errorCommand#" : "No command like this!",
}
```

In Discord
```
Bigaston > !test
EasyBot > This is a test!
Bigaston > !shlagvug
EasyBot > No command like this!

Bigaston > !hi monday
EasyBot > It's monday!
Bigaston > !hi
EasyBot > You need to specify a day!

Bigaston > !other-test
EasyBot > You need to specify an argument!
Bigaston > !other-test yes
EasyBot > YES!!
Bigaston > !other-test 123
EasyBot > You choose the default branch with 123
```