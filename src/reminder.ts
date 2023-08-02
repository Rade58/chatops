import { type Handler, schedule } from '@netlify/functions';
import { getNewItems } from './util/notion';
import { blocks, slackApi } from './util/slack';

const postNewNotionItemsToSlack: Handler = async function (event) {
  const items = await getNewItems();

  console.log({ items });

  //

  await slackApi('chat.postMessage', {
    channel: process.env.SLACK_GENERAL_CHANNEL_ID,
    blocks: [
      blocks.section({
        text: [
          'Here are the opinions awaiting judgment:',
          '',
          ...items.map(
            (item) => `- ${item.opinion} (spice level: ${item.spiceLevel})`
          ),
          '',
          // this also have some mrkdown (we used pipe to make link)
          `See all items: <https://notion.com/${process.env.NOTION_DATABASE_ID}| in Notion>`,
        ].join('\n'),
      }),
    ],
  });
  //
  return {
    statusCode: 200,
    // cron jobs don't need any body o we are not sending any back
    // body: '',
  };
};

// to make cron job we will export this
// export const handler = schedule('0 12 * * 1', postNewNotionItemsToSlack);
export const handler = schedule('* * * * *', postNewNotionItemsToSlack);
// All * * * * means every minute
//

// I have used <https://crontab.guru> to make cron job above
// more human redably
