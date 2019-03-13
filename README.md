# EasyBot
A system for create your own Discord bot with JSON.

## Synthax
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

### Customs Params
You can define some customs params whitch is replaced by something :
- `%me%` : The username of who use the command
- `%all%` : All the text after the command 
- `%n%` : The n-th argument. If the user don't specified him, return **nothing**
- `%x-y%` : Generate a random number between x and y

#### Date & time :
- `%date%` : The current date in your lang format
- `%day%` : The current day
- `%month%` : The current month
- `%year%` : The current year
- `%time%` : The current time in hh:ss format
- `%hours%` : The current hours
- `%min%` : The current minute
- `%sec%` : The current seconde

#### Exemple :
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

### Options
You can define some option of the bot in the JSON text :
- \*`@prefix@` : The prefix to detect the commands
- \*`@token@` : The Discord token of your bot

- \#`@infoChannel@` : The channel id of your annoncement channel

- `@lang@` : The language of your bot for system message (for now "fr", "en" or "de")
- `@customName@` : The nickname of Easy Bot in your server
- `@customGame@` : The custom game of EasyBot

*(\* : Required!) (\# : Required for some event!)*

#### Exemple :
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

### Custom Events
You can use some custom event to send some message when it's trigered :
- `#errorCommand#` : Execute when you have an error with the command. Can be used in subcommand.
- `#default#` : Command user by default. The utility is in subcommand to check some argument.
- `#userJoin#` : Execute when a user join the server. You can use the custom params `%user%` to notify the user
- `#userLeave#` : Execute when a user leave the server. You can use the custom params `%user%` to write the user name

#### Exemple :
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