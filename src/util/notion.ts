export async function notionApi(endpoint: string, body: {}) {
  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.NOTION_APP_SECRET}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).catch((err) => {
    console.error(err);
  });

  if (!res || !res.ok) {
    console.log(res);
  }

  const data = await res?.json();

  return data;
}

// getting new items from datbase (items marrkd as to-do or 'Not Started')

export async function getNewItems(): Promise<NewItem[]> {
  const notionData = await notionApi(
    `/datbases/${process.env.NOTION_DATABASE_ID}/query`,
    {
      filter: {
        property: 'Status',
        status: {
          equals: 'new',
        },
        page_size: 100,
      },
    }
  );

  const openItems = notionData.results.map((item: NotionItem) => {
    return {
      opinion: item.properties.opinion.title[0].text.content,
      spiceLevel: item.properties.spiceLevel.select.name,
      status: item.properties.Status.status.name,
    };
  });

  return openItems;
}

// adding new 'Not Started' item

export async function saveItem(newitem: NewItem) {
  const res = await notionApi('/pages', {
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      opinion: {
        title: [{ text: { content: newitem.opinion } }],
        spiceLevel: {
          select: {
            name: newitem.spiceLevel,
          },
        },
        submitter: {
          rich_text: [{ text: { content: `@${newitem.submitter} on Slack` } }],
        },
      },
    },
  });

  if (!res.ok) {
    console.log(res);
  }
}
