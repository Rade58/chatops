import { type Handler } from '@netlify/functions';
import { parse } from 'querystring';
import { slackApi, verifySlackRequest, blocks, modal } from './util/slack';

// made up this name (not some thing setted in slack api dashboard)
const MODAL_ID = 'foodfight_modal';

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
          // as I said we make up some unique id
          id: MODAL_ID,
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
              id: 'spice_level',
              label: 'How spicy is this opinion?',
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
// This function handles the request that commes when
// user submits the form from modal

async function handleInteractivity(payload: SlackModalPayload) {
  // sending modal or shortcut (it a bit different)
  const callback_id = payload.callback_id ?? payload.view.callback_id;

  switch (callback_id) {
    case MODAL_ID:
      const data = payload.view.state.values;
      const fields = {
        opinion: data.opinion_block.opinion.value,
        spiceLevel: data.spice_level_block.spice_level.selected_option.value,
        submitter: payload.user.name,
      };

      await slackApi('chat.postMessage', {
        // we want to use general channell
        // so find the id of your general channell
        // by clicking on name chanell in top left corner when you
        // open the channall in your slack workspace

        // this means every time someone uses our slash
        // command, outut will be posted only to that channell

        channel: 'C05KLGUB20J',
        // a way to reference user (I gues this is mrkdown (markdown flavour of slak))
        // you can write this kinds of tags: <@>
        text: `Oh dang y'all :eyes: <@${payload.user.id}> just started a food fight with a ${fields.spiceLevel} take:\n\n*${fields.opinion}*\n\n...discuss.`,
      });

      break;

    default:
      console.log(`No handler defined for ${callback_id}`);

      return {
        statusCode: 400,
        body: `No handler defined for ${callback_id}`,
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
  if (body.payload) {
    const payload = JSON.parse(body.payload);
    return handleInteractivity(payload);
  }

  return {
    statusCode: 200,
    body: 'TODO: handle Slack commands and interactivity',
  };
};
