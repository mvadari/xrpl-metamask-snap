const RIPPLED_URL = 'wss://s2.ripple.com:51233';
const { XrplClient } = require('xrpl-client');
// const rac = require('ripple-address-codec');
const rk = require('ripple-keypairs');

const client = new XrplClient(RIPPLED_URL);

async function getPing() {
  try {
    const result = await client.send({ command: 'ping' });
    return JSON.stringify(result);
  } catch (err) {
    return err.stack;
  }
}

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = { seed: null };
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  switch (requestObject.method) {
    case 'storeSeed': {
      state.seed = requestObject.seed;
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
      const { publicKey } = rk.deriveKeypair(state.seed);
      const classicAddress = rk.deriveAddress(publicKey);
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${originString}!`,
            description: 'The address has been saved to your address book',
            textAreaContent: `Classic Address: ${classicAddress}\n`,
          },
        ],
      });
    }

    case 'signMessage': {
      const { privateKey } = rk.deriveKeypair(state.seed);
      const signedMessage = rk.sign(requestObject.message, privateKey);
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${originString}!`,
            description: 'The address has been saved to your address book',
            textAreaContent: `Signed Message: ${signedMessage}\n`,
          },
        ],
      });
    }

    case 'ping': {
      const data = await getPing();
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${originString}!`,
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent: `Ping result: ${data}`,
          },
        ],
      });
    }
    default:
      throw new Error('Method not found.');
  }
});
