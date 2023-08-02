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
// this one is for running every four minutes
export const handler = schedule('*/4 * * * *', postNewNotionItemsToSlack);
// All * * * * means every minute
//

// I have used <https://crontab.guru> to make cron job above
// more human redably

// we can test this function in development only by
// going to <tunnel url>/api/reminder
// (it worked for me, because bot actually mede a comment
// with all of our unfinished todo entries)

// but to actually test in production (to see if job is going to
// be runned actually in intervals we setted, we need to deploy our
// netlify fuctions)
