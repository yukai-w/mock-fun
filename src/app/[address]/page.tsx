"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  Alert
} from "@mui/material"; // 假设使用 chart.js 来绘制 K 线图
import {
  usePhantom,
  getRayTokenInfo,
  getRayTokenPrice,
  getTokenInfoByRpc,
  calculatePercentageChange,
  toFixed,
  formatMarketCap
} from "@/util";
import Image from "next/image";
import Decimal from "decimal.js";
import TokenTable from '../_component/TokenTable';
import TradingViewWidget from '../_component/TradingViewWidget';

type ParamsType = {
  address: string;
};

type tokenDetail = {
  address: string;
  logoURI: string;
  name: string;
  symbol: string;
  price: string;
  supply: string;
};

const TokenDetailPage = ({ params }: { params: ParamsType }) => {
  const { publicKey, isConnected, connectPhantom } =
    usePhantom();

  const [userInfo, setUserInfo] = useState({
    m_sol: '0',
    user_id: 0,
    address: 'xxx'
  });

  const userLogin = (address: string): void => {
    if (!address) {
      return;
    }
    fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 0) {
          setUserInfo(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [buySell, setBuySell] = useState("buy");
  const [solAmount, setSolAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  const [balance, setBalance] = useState({} as any);
  const getUserBalance = async () => {
    if (!publicKey) {
      return;
    }
    const result = await fetch('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contract: params.address,
        userAdd: publicKey
      }),
    }).then((res) => res.json());
    if (result.code === 0) {
      setBalance(result.data);
    }
  }

  useEffect(() => {
    userLogin(publicKey);
    getUserBalance();
  }, [publicKey]);

  const handleBuySellChange = (_: any, newValue: string) => {
    if (newValue !== null) {
      setBuySell(newValue);
      setSolAmount("");
      setTokenAmount("");
    }
  };

  const handleSolChange = (event: any) => {
    const value = event.target.value;
    setSolAmount(value);
    const tokens = value ? (+value * +solPrice / +tokenDetail.price).toFixed(4) : "";
    setTokenAmount(tokens);
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTokenAmount(value);
    const sols = value ? (+value * +tokenDetail.price / +solPrice).toFixed(4) : "";
    setSolAmount(sols);
  };
  const [tokenDetail, setTokenDetail] = useState({
    supply: "0",
    price: "0",
  } as tokenDetail);

  const searchContract = async () => {
    const contract = params.address;
    if (!contract) {
      return;
    }
    const result = await getRayTokenInfo(contract);
    const data: tokenDetail = result?.data.length > 0 ? result?.data[0] : {};

    const priceResult = await getRayTokenPrice(contract);

    const rpcResult = await getTokenInfoByRpc(contract);
    const tokenPrice = priceResult?.data[contract];
    data.price = tokenPrice;
    data.supply = rpcResult?.result?.value?.uiAmountString || "0";
    console.log(data);
    setTokenDetail(data);
  };

  const [solPrice, setSolPrice] = useState('');

  const getSolPrice = async () => {
    const priceResult = await getRayTokenPrice('So11111111111111111111111111111111111111112');
    const solPrice = priceResult?.data['So11111111111111111111111111111111111111112'];
    setSolPrice(solPrice);
  }

  const submit = async () => {
    
    if (buySell === "buy") {
      fetch('/api/token/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract: tokenDetail.address,
          tokenPrice: tokenDetail.price,
          solAmount: solAmount,
          tokenAmount: tokenAmount,
          userAdd: userInfo.address,
          userId: userInfo.user_id,
          solPrice
        }),
      })
    } else {
      fetch('/api/token/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract: tokenDetail.address,
          userAdd: userInfo.address,
          sold: (balance.amount * +tokenDetail.price) / +solPrice,
        }),
      })
    }
  }

  useEffect(() => {
    searchContract();
    getSolPrice();
    const interval = setInterval(async () => {
      await getSolPrice();
    }
    , 1000 * 60 * 10);
    return () => clearInterval(interval);
  }, []);

  // tokenDetail.price * token.supply
  const mcap = new Decimal(tokenDetail.price)
    .mul(new Decimal(tokenDetail.supply))
    .toString();

  const holdSol = (balance.amount * +tokenDetail.price) / +solPrice;

  const profit = calculatePercentageChange(+holdSol, +balance.sold_sol, +balance.bought_sol);
  return (
    <div className="flex p-4">
      {/* 左侧 K线图 */}
      <div className="w-2/3 pr-4">
        <Card>
          <CardContent>
            <div className="flex items-center">
              <Image
                width={80}
                height={80}
                unoptimized
                src={tokenDetail.logoURI}
                alt="Token Avatar"
                className="w-12 h-12 mr-4"
              />
              <Typography variant="h5">
                {tokenDetail.name} - {tokenDetail.symbol}
              </Typography>
            </div>
            <div style={{ height: 500 }} className="mt-4">
              <TradingViewWidget />
            </div>
            <div className="mt-4" />
            <TokenTable solPrice={solPrice} address={publicKey} />
          </CardContent>
        </Card>
      </div>
      <div className="w-1/3 pl-4">
        <Card>
          {isConnected ? (
            <CardContent>
              <Typography variant="h6">Buy & Sell</Typography>
              <Typography variant="body1">Mcap: ${formatMarketCap(+mcap)}</Typography>
              <Typography variant="body1">
                Price: ${tokenDetail.price}
              </Typography>
              <div className="mt-4">
                <ToggleButtonGroup
                  value={buySell}
                  exclusive
                  onChange={handleBuySellChange}
                  aria-label="buy or sell"
                >
                  <ToggleButton value="buy" aria-label="buy">
                    Buy
                  </ToggleButton>
                  <ToggleButton value="sell" aria-label="sell">
                    Sell
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <h4>you have {toFixed(userInfo.m_sol)} $SOL</h4>
              <h4>bought: {balance.bought_sol} SOL
                <br />
                now worth: {toFixed(holdSol)} SOL
                <br />
                sold: {toFixed(balance.sold_sol)} SOL
                <br />
                profit: <span className={+profit > 0 ? 'text-green-500' : 'text-red-500'}>{profit}%</span>
              </h4>
              {/* SOL input */}
              {
                buySell === 'buy'
                ?
                <>
                  <div className="mt-4">
                <TextField
                  type="number"
                  value={solAmount}
                  onChange={handleSolChange}
                  placeholder="Input Sol"
                  className="border p-2 rounded w-full"
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="start">Sol</InputAdornment>,
                    },
                  }}
                />
              </div>
              <h4 className="mt-3">will receive:</h4>
              {/* Token */}
              <div className="mt-4">
                <TextField
                  type="number"
                  value={tokenAmount}
                  onChange={handleTokenChange}
                  placeholder="Input Token"
                  className="border p-2 rounded w-full"
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="start">{tokenDetail.symbol}</InputAdornment>,
                    },
                  }}
                />
              </div>
                </>
                :
                <>
                  <Alert variant="filled" severity="warning">Free selling is under developmen</Alert>
                </>
              }
              <Button
                variant="contained"
                color="primary"
                className="mt-4 w-full"
                onClick={submit}
              >
                {buySell === "buy" ? "BUY" : "SELL ALL"}
              </Button>
            </CardContent>
          ) : (
            <CardContent>
              <Typography variant="h6">Connect Wallet</Typography>
              <Button
                color="primary"
                onClick={connectPhantom}
                variant="contained"
              >
                CONNECT
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TokenDetailPage;
