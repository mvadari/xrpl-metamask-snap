const RIPPLED_URL = 'wss://s2.ripple.com:51233';
const { XrplClient } = require('xrpl-client');

const client = new XrplClient(RIPPLED_URL);

async function getRippledData() {
  try {
    const result = await client.send({command: 'ping'})
    return JSON.stringify(result)
  } catch (err) {
    return err.stack;
  }
}

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'hello':
      const data = await getRippledData();
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${originString}!`,
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent: `Current fee estimates: ${data}`,
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
});
