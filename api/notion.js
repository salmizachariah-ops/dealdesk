export default async function handler(req, res) {
  // Allow CORS from same origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path, token } = req.query;
  if (!path || !token) {
    return res.status(400).json({ error: 'Missing path or token' });
  }

  const notionUrl = `https://api.notion.com/v1${decodeURIComponent(path)}`;

  try {
    const notionRes = await fetch(notionUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    });

    const data = await notionRes.json();
    return res.status(notionRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
