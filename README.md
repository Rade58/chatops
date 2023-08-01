# chatops

I'm using netllify functions to interact with notion and slack apis

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

## Go to `api.slack.com` to get api key

you'll need to create an app, and you'll get your token