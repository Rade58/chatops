import { type Handler } from '@netlify/functions';
import { parse } from 'querystring';
import { slackApi } from './util/slack';

//
//
//
//
async function handleSlashCommands(payload: SlackSlashCommandPayload) {
  //
  switch (payload.command) {
    case '/foodfight':
      const response = await slackApi('chat.postMessage', {
        channel: payload.channel_id,
        text: 'Things are happening!',
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
