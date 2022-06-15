import fetch from 'cross-fetch';

test('ping', async () => {
  const response = await fetch('http://127.0.0.1:12345/ping');

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('application/json');

  const responseData = await response.json();

  expect(responseData).toHaveProperty('datetime');

  const date = new Date(responseData.datetime);

  expect(!isNaN(date.valueOf())).toBe(true);
});
