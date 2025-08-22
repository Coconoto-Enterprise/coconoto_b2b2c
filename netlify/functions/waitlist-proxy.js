export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const body = JSON.parse(event.body);

  const response = await fetch(
    'https://script.google.com/macros/s/AKfycbwm5CW4QZagvFaF2XVnY53nm5n9S9oI2LqzNI8vwfxCsWHuZYttkfMI6C7WAP48QXHqFg/exec',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const data = await response.text();
  return {
    statusCode: 200,
    body: data,
  };
}
