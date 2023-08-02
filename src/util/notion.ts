export async function notionApi(endpoint: string, body: string) {
  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.NOTION_SECRET}`,
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
