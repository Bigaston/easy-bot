# Installation
Clone this reposistory and use this command. You need [NodeJS](https://nodejs.org/en/) to run this project.

```
npm install
```

After that, edit the `script.json` file with your bot token and some data! You can check the `example_script.json` file if you want!

The bot need some permission. You can use the button in the web dashboard to invite with the needed permission!

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

### Server:
- `%server:someone%` : Choose a random user in the server
- `%server:someone:nobot%` : Choose a random user in the server without bot
- `%server:number:member%` : The number of user in a guild (can be use in command, #userLeave#, and #userJoin#)

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

- `@lang@` : The language of your bot for system message (for now "fr", "en", "de" or "pl")
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

## Custom action
When you write some of this in your response, they will do some action and be ereased!
- `!message:delete!` : Remove the command message
- `!role:add[role_name]!` : Add the role role_name to the user
- `!role:remove[role_name]!` : Remove the role role_name to the user
- `!role:trigger[role_name]!` : Add the role if the user don't have it, else remove it
- `!channel:sendOnly[channel_id]!` : Send the response only on the channel specified in channel_id
- `!channel:sendTo[channel_id]!` : Send the response on the channel specified in channel_id (can be used many time) and not on the message channel
- `!channel:send[channel_id]!` : Send the response on the channel specified in channel_id (can be used many time) and on the message channel
- `!channel:setname[channel_id]:[name]!` : Change the name of a text channel (not tested on voice channel)

## Web request
You can trigger some event with the EasyBot API. For that you need your API Token (you can find it in the dashboard), after that just send a POST request to the URL of your event.

URL is like : [yourDomaineAndPort]/api/[theNameOfYourEvent]?t=[yourAPIToken]

You can use the `%web:{body_key}%` parameter to replace it with your POST request body.

You need to specify a channel with `!channel:send[id]!` ! Or the bot will not send message!

You can use Random parameters and Game event!

### Example :

POST REQUEST to yoururl.me:6000/api/test?t=123456789 with body:
```JSON
{
	"name" : "Machin"
}
```

Script :
```
{
	"?test?" : "Hello %web:name%! !channel:send[123456789]!"
}
```

In Discord, in the channel with id 123456789
```
EasyBot : Hello Machin!
```