// const RIPPLED_URL = 'https://www.etherchain.org/api/gasPriceOracle'
const RIPPLED_URL = 'https://cors-anywhere.herokuapp.com/https://s2.ripple.com:51234';

async function getRippledData() {
  try {
    const response = await fetch(RIPPLED_URL, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ method: 'server_info' }),
    });
    // const response = await fetch(RIPPLED_URL, {method: 'GET', mode: 'cors'});
    return response.text();
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
