# chatops

I'm using netllify functions to interact with notion and slack apis

## Netlify site initialized with

```
ntl init
```

## Typescript

**We didn't instll `typescript` but our cloud fucnction will be written in typescript** 

because we won't run our server locally at all, we will deploy everything in live mode and use tunnell url to expose our endpoints

## Live mode

**We need live tunnel**

```
ntl dev --live
```

You will get the live url

Since we setteng config that our functions are on endpoints: `<url>/api/<path of the function inside src>`, you can go to that url inside browser to test if it's working

**Make change in your functions when we are live, and you'll see that this will reflect instantlly, in get request you test in browser you'll se the change for example when you reload the page** (send different data to test it)



## Go to `api.slack.com` to make all necessary settings

you'll need to create an app

add some details to your app (name, description, image)

### We then need to create slash commands

**thse are commands user will use as `/<command name>` in your chat**

you'll find it in left menu

request url you should set to be yout tunnel url

and path should be set to the path of some of your functions (for example in our case `<tunnel url>/api/api/slack`)

### We need to crete bot user

Now go to `App Home` in dasboard of the `api.slack.com` (url where we built our app and created slash command) (we are still in here)

We are setting `Your App’s Presence in Slack` part

name the bot , and give it a display name(a name thaat your users will refer to)

you can check option that your bot is always online

and now that you have a boot you are allowed to install your app in your slack workspace

### Installing slack app into our slack workspace

First set `Scopes`

We will add this scopes: `chat:write` (only one we need for now)

go to `Oauth & Permissions` in dasboard of the `api.slack.com` (url where we built our app and created slash command)

just press <kbd>Install To Worksoace</kbd> and pick a workspace

### Go to slack worksapce to test the command

when you do it you will see that is onlly visible to you

**We can get feedback to the user who run the command, using the body of what we returned from slash command, but if we wnt to send a message to everybodt `WE NEED TO USE SLACK'S API` to send a message as the bot**

### Geting `API key` for slack credentials that we need

Like I said we are do in this to be able to send messages as our bot

we need `Sklack Signing Secret` for veryfing that messages are valid (**Go to `Basic Information`(in left menu) -> `App Credentials`**)

and we need `Bot User OAuth Token`(We can find this in *Oauth & Permissions* section)