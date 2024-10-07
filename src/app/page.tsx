"use client";
import React, { useEffect, useState } from "react";
import { getRayTokenInfo, getTokenList } from "@/util";
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField
} from "@mui/material";
import Image from "next/image";

export default function Home() {

  const getTokenListInit = async () => {
    const result = await getTokenList();
    setTokens([
      ...result.data.mintList.slice(-20)
    ]);
  }
  const [inputValue, setInputValue] = useState('');

  const search = async () => {
    const result = await getRayTokenInfo(inputValue);
    const tokens = result?.data.length > 0 ? result?.data : [];
    setTokens(tokens);
  }

  useEffect(() => {
    getTokenListInit();
  }, []);

  // const buySubmit = async () => {
  //   if (!inputValue || inputValue === '0') {
  //     return;
  //   }
  //   const sol = new Decimal(inputValue);
  //   const balance = new Decimal(userInfo.m_sol);
  //   if (sol.gt(balance)) {
  //     console.log(55);
  //     Alert({
  //       title: 'Error'
  //     });
  //   }
  // }

  const [tokens, setTokens] = useState([
    { logoURI: 'https://via.placeholder.com/50', name: 'Token A', symbol: 'TKA', mcap: '$10B', address: '123' },
    { logoURI: 'https://via.placeholder.com/50', name: 'Token B', symbol: 'TKB', mcap: '$5B', address: '123' },
    { logoURI: 'https://via.placeholder.com/50', name: 'Token C', symbol: 'TKC', mcap: '$2B', address: '123' }
  ]);

  return (
    // <div>
    //   sol price
    //   <h4>Sol: ${solPrice}</h4>
    //   <div>
    //     <h1>Phantom Wallet</h1>
    //     <Button onClick={connectPhantom}>Connect Phantom Wallet</Button>
    //     {isConnected && (
    //       <>
    //         <p>Connected Public Key: {publicKey}</p>
    //         <p>Balance: {userInfo.m_sol} mSol</p>
    //         <Button onClick={disconnectPhantom}>Disconnect</Button>
    //       </>
    //     )}
    //     {error && <p className="caret-red-400">{error}</p>}
    //   </div>
    //   {/* search */}
    //   <div>
    //     <Input onChange={(e) => setContract(e.target.value)} value={contract} />
    //     <Button onClick={searchContract} variant="contained">
    //       Search
    //     </Button>
    //   </div>
    //   {/* card show token detail */}
    //   <Card sx={{ maxWidth: 345, margin: 2 }}>
    //     <CardContent>
    //       <Typography gutterBottom variant="h5" component="div">
    //         <Image unoptimized width={60} height={60} alt="img" src={tokenDetail.logoURI} />{tokenDetail.name}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         Symbol: {tokenDetail.symbol}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         Price: {tokenDetail.price}
    //       </Typography>
    //     </CardContent>
    //   </Card>
    //   {/* buy & sell */}
    //   <div>
    //     <Input type="number" onChange={e => setInputValue(e.target.value)} value={inputValue} />
    //     <Button onClick={buySubmit} variant="contained">
    //       Buy
    //     </Button>
    //   </div>
    // </div>
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <Image unoptimized src="/images/WechatIMG4220.jpg" width={100} height={100} alt="logo"/>
      <h1 className="mb-3">Mock Fun</h1>
      <div className="flex mb-12 h-500">
        <TextField
          variant="outlined"
          placeholder="Search Solana Token..."
          className="mr-4"
          size="medium"
          onChange={e => setInputValue(e.target.value)}
          value={inputValue}
          sx={{ width: '350px' }} 
        />
        <Button onClick={search} variant="contained" color="primary" size="large">
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokens.map((token, index) => (
          token && <a href={'/' + token?.address} key={index}>
            <Card variant="outlined" sx={{ width: 400 }} className="flex items-center p-3">
            <Image unoptimized src={token.logoURI} alt={token.name} width={80} height={80} />
            <CardContent>
              <Typography variant="h6">{token.name}</Typography>
              <Typography color="textSecondary">{token.symbol}</Typography>
              <Typography color="textSecondary">{token.mcap}</Typography>
            </CardContent>
          </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
