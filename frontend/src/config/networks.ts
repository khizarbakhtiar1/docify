export const NETWORKS = {
  localhost: {
    chainId: 31337,
    name: "Localhost",
    rpcUrl: "http://127.0.0.1:8545",
    explorerUrl: "",
    currency: "ETH",
  },
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://rpc.sepolia.org",
    explorerUrl: "https://sepolia.etherscan.io",
    currency: "ETH",
  },
  vanarTestnet: {
    chainId: 2044,
    name: "Vanar Testnet",
    rpcUrl: "https://rpc-vanguard.vanarchain.com",
    explorerUrl: "https://explorer-vanguard.vanarchain.com",
    currency: "VANRY",
  },
};

// Default to localhost if no environment variable is set
export const CURRENT_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337");

export const getCurrentNetwork = () => {
  return Object.values(NETWORKS).find((n) => n.chainId === CURRENT_CHAIN_ID) || NETWORKS.localhost;
};

export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || getCurrentNetwork().explorerUrl;
