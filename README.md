# easy-bot
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
Easy-Message > Bigaston : I like potatoe

Bigaston > !hug Bob
Easy-Message > Bigaston hug Bob

Bigaston > !hug
Easy-Message > Bigaston hug nothing
```

### Options
You can define some option of the bot in the JSON text :
- \*`@prefix@` : The prefix to detect the commands
- \*`@infoChannel@` : The channel id of your annoncement channel
- `@customName@` : The nickname of Easy Bot in your server

*(\* : Required!)*

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
Easy-Message > Detected!

Bigaston > test
```

### Custom Events
You can use some custom event to send some message when it's trigered :
- `#errorCommand#` : Execute when you have an error with the command. Can be used in subcommand.
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
	}
	"#errorCommand#" : "No command like this!"
}
```

In Discord
```
Bigaston > !test
Easy-Bot > This is a test!

Bigaston > !shlagvug
Easy-Bot > No command like this!

Bigaston > !hi monday
Easy-Bot > It's monday!

Bigaston > !hi
Easy-Bot > You need to specify a day!