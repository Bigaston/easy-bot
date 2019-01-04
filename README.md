# easy-bot
A system for create your own Discord bot with JSON.

## Synthax
```
{
	"name-of-the-command" : "Response",
	"other-command" : ["Choose", "one", "response"],
	"custom-params" : "%me% use Pikachu"
}
```

The bot use different custom params :
- `%me%` : The username of who use the command
- `%all%` : All the text after the command 
- `%n%` : The n-th argument. If the user don't specified him, return **nothing**

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
Easy-Message > Bigaston : I like potatoe

Bigaston > !hug Bob
Easy-Message > Bigaston hug Bob

Bigaston > !hug
Easy-Message > Bigaston hug nothing
```