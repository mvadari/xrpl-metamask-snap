async function getFees() {
  const response = await fetch('https://www.etherchain.org/api/gasPriceOracle');
  return response.text();
} 

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'hello':
      const fees = await getFees()
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${originString}!`,
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'Current fee estimates: '+fees
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
});
