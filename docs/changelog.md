## 0.6
### 0.6.1 (21/04/2019)
- Add exception for API when the request's body is something like (used by Ko-Fi, still WIP, maybe will change)
```JSON
{
	"data": {
		"the" : "request"
	}
}
```

### 0.6.0 (21/04/2019)
- Add API (see [docs](https://easy-bot.js.org/) for details!)

## 0.5
### 0.5.6 (19/03/19 14:20)

- Add user in the dashboard
- Edit password in the dashboard

### 0.5.3 (19/03/19 13:10)

- Add bot info in the dashboard
- Add maj button in the dashboard

### 0.5.1 (18/03/19 19:00)

- Add a changeName and a changeGame after the update


### 0.5.0 (18/03/19 13:40)

- Add the web dashboard!
-> You can config the port in the config file
-> You can choose if you want to have a login or not (if you host the bot on your computer, you don't need login)
-> You can setup some secret key for your cookies

## 0.4.3 (17/03/19 13:50)

- Fix !role:add[]! and !role:remove[]! when you have two in one line but now the role name can just contains letters and numbers