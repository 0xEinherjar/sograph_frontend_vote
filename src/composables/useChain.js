export const useChain = () => {
  async function monadTestnet() {
    return defineChain({
      id: 10143,
      name: "Monad Testnet",
      nativeCurrency: {
        decimals: 18,
        name: "Monad",
        symbol: "MON",
      },
      rpcUrls: {
        default: {
          http: [
            "https://special-special-telescope.base-sepolia.quiknode.pro/0c45fdba0a2cb850c282df0417a217f67ea8fbc6",
          ],
        },
      },
      blockExplorers: {
        default: {
          name: "Explorer",
          url: "https://testnet.monadexplorer.com/",
        },
      },
    });
  }

  return { monadTestnet };
};
