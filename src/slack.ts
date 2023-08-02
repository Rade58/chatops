import { type Handler } from '@netlify/functions';
import { parse } from 'querystring';
import { slackApi, verifySlackRequest, blocks, modal } from './util/slack';

//
//
//
//
async function handleSlashCommands(payload: SlackSlashCommandPayload) {
  switch (payload.command) {
    case '/foodfight':
      /*  const joke = await fetch('https://icanhazdadjoke.com', {
        headers: {
          accept: 'text/plain',
        },
      });

      const response = await slackApi('chat.postMessage', {
        channel: payload.channel_id,
        // text: 'Things are happening!',
        text: await joke.text(),
      }); */

      const response = await slackApi(
        'views.open',
        modal({
          // make ups ome unique id
          id: 'foodfight-modal',
          title: 'Start a food fight',
          trigger_id: payload.trigger_id,
          blocks: [
            blocks.section({
              text: 'The discource demands food drama! *Send in your spiciest food takes so we can all argue about them and feel alive.*',
            }),
            blocks.input({
              id: 'opinion',
              label: 'Deposit your contraversial food opinions over here',
              placeholder:
                'Example: peanut butter and mayo sandwaches are delicious',
              initial_value: payload.text ?? '',
              hint: 'What do you beileive about food tht people finfd appealing? Say it with your chest!',
            }),
            blocks.select({
              id: 'spicey_levels',
              label: 'How spicey is this opinion?',
              placeholder: 'Select a spice level.',
              options: [
                { label: 'mild', value: 'mild' },
                { label: 'medium', value: 'medium' },
                { label: 'spicey', value: 'spicey' },
                { label: 'nuclear', value: 'nuclear' },
              ],
            }),
          ],
        })
      );

      if (!response.ok) {
        console.log(response);
      }

      console.log('MODAL');

      break;

    default:
      console.log('DEFAULT');

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
  //
  //
  //
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
