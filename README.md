# Chatops

bootstraped with:

```
pnpm init
```

I will be using netllify functions to interact with notion and slack APIs

## Netlify site initialized with

```
ntl init
```

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

### We then need to create `Slash Commands`

**thse are commands user will use as `/<command name>` in your chat**

you'll find it in left menu (`api.slack.com` part of slack site)

request url you should set to be yout tunnel url

and path should be set to the path of some of your functions (for example in our case `<tunnel url>/api/slack`)

**Every time you restart the server, new tunnell url will be generated, so you need to set path every time**

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

### Go to your slack workspace to add your bot to the channel you want

type `/add` in channel, click on context menu `Add apps to channell`, pick your bot

So, if you want bot to work for a specific channel you need to add it to specific channell. You can't add it to all channells

Good practice, if you are running one channell in some company, add bot to your channell

### At some point you will develop your command to be able to open modal when user types it out in chat

Well, you also need to allow this through api dashboard

Again go to `api.slack.com`

This tyme you need to check `Interactivity` option inside `Interactivity & Shortcuts` section

Why we need this. A lot of things counts as interactivity in terms of slack, like clicking the button, responding to a modal, bunch of other thingsrunning contact shortcut

**WE ALSO NEED TO ENTER URL OF OUR FUNCTION IN THERE, AND SINCE WE BUILT OUR FUNCTION TO HANDLE DIFFERENT SLACK API ENDPOINTS, WE CAN USE SAME URL**

`<tunnel url>/api/slack`

**Again, if we restart server this is another place we had to update url in**

And in our api endpoint (`src/slack.ts`): We built function called `handleInteractivity` to respond after user submits the form inside modal

### We can also create shortcuts (Context mnu shortcuts)

When I say context menu I men the three dots near the posted message in chat

We go to the `Interactivity & Shortcuts`

Then we create shortcut

Shortcut can be displayed globally (lighting bolt) or on message

We need `on message`

Fill the form with other info and Assign some unique `callback_id` (**you will need this to reference in code**)

You now create a shortcut

After creating make sure that you `save changes`

Go into slack channell **reload page** and you have context menu on the right of posted messages, shortcut shoulld be there

## Slack Block Kit Builder

go to <https://app.slack.com/block-kit-builder>

and [read this if you want to know more about Block Kit Builder](https://api.slack.com/block-kit)

Here you can test all sorts of things you can do in Slack

# Notion

We need to have published page

play around a little with notion, you will figure it out how it works

you publish page by clicking on <kbd>Share</kbd> button at top right, and from ther you click on <kbd>Publish</kbd>

we need a link of mentioned published page

You'll easily see where is mentioned link, **ignore query params from the link, you wont need those when using url**

### Notion app

**We need to create notion app**

Go to <https://www.notion.so/my-integrations>

Add new integration, give it an name and upload the image, **And make sure you are creating it for the workspace that you want**

For your new app you need to set some Capabilitie

We are going to use `Read content` `Upate content` `Insert content`, which is already checked by default

`No user information` should be checked

make sure to save everything in those menus

### Conect notion app to notion workspace

Go back to your notion page, and you have context menu top right, pick `Manage connection`, You should see your app, or type the name in order to find it and make a connection.

### Take the secrets of your notion app (integration)

Go back to your app, and copy the secret from there

set it to th environment variable

### Take the notion datbase id

I already mentioned the url of your notion page you published

FROM THAT URL WE ARE JUST TAKING **PART OF THE PATH MADE OF 'RANDOM CHARACTERS', AND WE DO NOT NEED THE QUERYSTRING**

AND THAT IS DATBASE ID, and you should also set that as an environmment variable

# Cron job for reminder

We will use this for the mentioned purpose

```ts
import { schedule } from '@netlify/functions';
```

So we will use this to periodically send **notion items** that are not in progress or completed (new items or todo items what ever you called them) to our **slack workspace**; maybe once a week

We defined cron job function in `src/reminder.ts`

Since our function gets deployed by pushing to main branch, we will have up and running cron job function deployed

# Before pushing everything to main branch (before deploying)

**SET ALL ENV VARIABLES IN NETLIFY DASHBOARD**

OFCOURSE IT WILL THROW ERRORS WITHOUT MENTIONED THINGS
