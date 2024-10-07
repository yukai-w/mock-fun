"use client";
import { useState } from 'react';

// login
export const usePhantom = () => {
  const [publicKey, setPublicKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const connectPhantom = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setPublicKey(response.publicKey.toString());
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error("Connection failed:", err);
        setError("Connection failed");
      }
    } else {
      console.error("Phantom wallet is not installed.");
      setError("Please install Phantom wallet.");
    }
  };

  const disconnectPhantom = () => {
    setPublicKey('');
    setIsConnected(false);
  };

  return { publicKey, isConnected, connectPhantom, disconnectPhantom, error };
};

const RAY_API_DOMAIN = "https://api-v3.raydium.io";

export const getRayTokenInfo = async (contract) => {
  const data = await fetch(`${RAY_API_DOMAIN}/mint/ids?mints=${contract}`);
  return data.json();
};

export const getRayTokenPrice = async (contract) => {
  const data = await fetch(`${RAY_API_DOMAIN}/mint/price?mints=${contract}`);
  return data.json();
}

export const getTokenList = async () => {
  const data = await fetch(`https://api-v3.raydium.io/mint/list`);
  return data.json();
}

export const getTokenInfoByRpc = async (contract) => {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "getTokenSupply",
    params: [contract]
  };
  const result = await fetch('https://solana-mainnet.g.alchemy.com/v2/IBBv8dWL7-ziFGkV5fM6sjTNJGAXekGn', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
  });
  return result.json();
}

export const calculatePercentageChange = (holdSol, sold, bought_sol) => {
  // 计算当前持有的总值
  const currentValue = holdSol + sold; // 当前持有的 value
  const initialValue = bought_sol; // 之前买入的 value

  // 计算涨跌的差值
  const difference = currentValue - initialValue;

  // 计算百分比变化
  const percentageChange = (difference / initialValue) * 100;

  return percentageChange.toFixed(2);
}

export const toFixed = (str) => {
  return Number(str).toFixed(2);
}
export const formatMarketCap = (value) => {
  if (value < 1_000) return value.toFixed(2).toString();
  if (value < 1_000_000) return (value / 1_000).toFixed(1) + 'k';
  if (value < 1_000_000_000) return (value / 1_000_000).toFixed(1) + 'm';
  return (value / 1_000_000_000).toFixed(1) + 'b';
}