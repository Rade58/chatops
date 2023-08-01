import { type Handler } from '@netlify/functions';
import { parse } from 'querystring';
import { slackApi, verifySlackRequest } from './util/slack';

//
//
//
//
async function handleSlashCommands(payload: SlackSlashCommandPayload) {
  switch (payload.command) {
    case '/foodfight':
      const joke = await fetch('https://icanhazdadjoke.com', {
        headers: {
          accept: 'text/plain',
        },
      });

      const response = await slackApi('chat.postMessage', {
        channel: payload.channel_id,
        // text: 'Things are happening!',
        text: await joke.text(),
      });

      if (!response.ok) {
        console.log(response);
      }

      break;

    default:
      return {
        statusCode: 200,
        body: `Command ${payload.command} not recognized!`,
      };
  }

  return {
    statusCode: 200,
    body: '',
  };
}

//
//
//
//

export const handler: Handler = async (event) => {
  // todo: validate the slack request

  const validation = verifySlackRequest(event);
  // const validation = false;

  if (!validation) {
    console.error('Invalid request!');

    return {
      statusCode: 401,
      body: 'Unauthorized!',
    };
  }

  //
  const body = parse(event.body ?? '') as SlackPayload;

  if (body.command) {
    return handleSlashCommands(body as SlackSlashCommandPayload);
  }

  // todo: handle interactivity (e.g context commands, modals)

  return {
    statusCode: 200,
    body: 'TODO: handle Slack commands and interactivity',
  };
};
