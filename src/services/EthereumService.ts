import axios from "axios";

const rpcUrls: string[] = [
  "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
  "https://rpc.ankr.com/eth",
  "https://cloudflare-eth.com",
  // Add more RPC URLs if needed
];

export const getLatestBlockNumber = async (): Promise<number> => {
  for (const url of rpcUrls) {
    try {
      const response = await axios.post(url, {
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      });
      return parseInt(response.data.result, 16);
    } catch (error) {
      console.error(`RPC URL failed: ${url}`, error);
    }
  }
  throw new Error("All RPC URLs failed");
};

export const getBlockTransactions = async (
  blockNumber: number
): Promise<any[]> => {
  for (const url of rpcUrls) {
    try {
      const response = await axios.post(url, {
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [`0x${blockNumber.toString(16)}`, true],
        id: 1,
      });
      return response.data.result.transactions;
    } catch (error) {
      console.error(`RPC URL failed: ${url}`, error);
    }
  }
  throw new Error("All RPC URLs failed");
};
