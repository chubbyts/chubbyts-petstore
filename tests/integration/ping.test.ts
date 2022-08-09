import fetch from 'cross-fetch';

test('ping', async () => {
  const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/ping`);

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('application/json');

  const responseData = await response.json();

  expect(responseData).toEqual({
    datetime: expect.any(String),
    database: true,
  });

  const date = new Date(responseData.datetime);

  expect(!isNaN(date.valueOf())).toBe(true);
});
