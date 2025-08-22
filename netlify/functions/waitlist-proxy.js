export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const response = await fetch(
    'https://script.google.com/macros/s/AKfycbwm5CW4QZagvFaF2XVnY53nm5n9S9oI2LqzNI8vwfxCsWHuZYttkfMI6C7WAP48QXHqFg/exec',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    }
  );
  const data = await response.text();
  res.status(200).send(data);
};
