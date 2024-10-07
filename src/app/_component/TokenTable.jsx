import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar
} from '@mui/material';
import { getRayTokenInfo, getRayTokenPrice, calculatePercentageChange } from '@/util';

const TokenRow = ({ tokenImage, tokenName, bought, sold, worth, profit, address }) => {
  return (
    <TableRow>
      <TableCell>
        <Avatar src={tokenImage} alt={tokenName} />
        <Typography variant="body1" style={{ marginLeft: '8px' }}>
          {tokenName}
        </Typography>
      </TableCell>
      <TableCell>{bought}</TableCell>
      <TableCell>{sold || '0'}</TableCell>
      <TableCell>{worth || '0'}</TableCell>
      <TableCell>
        <span className={+profit > 0 ? 'text-green-500' : 'text-red-500'}>{profit}%</span>
      </TableCell>
      <TableCell>
        <a color='blue' href={`/${address}`}>Chart</a>
      </TableCell>
    </TableRow>
  );
};

const TokenTable = ({ address, solPrice }) => {

  const [list, setList] = useState([]);

  const getBalances = async () => {
    const result = await fetch(`/api/token?address=${address}`).then(res => res.json());
    const obj = {};
    if (result.code === 0) {
      const rayInfoList = await getRayTokenInfo(result.data.map(item => item.contract).join(','));
      rayInfoList?.data?.forEach(item => {
        obj[item.address] = {
          ...item
        };
      })
      const rayPriceList = await getRayTokenPrice(result.data.map(item => item.contract).join(','));
      Object.keys(rayPriceList?.data).forEach(item => {
        obj[item].price = rayPriceList?.data[item];
      })
      setList(result.data.map(item => {
        const holdSol = (item.amount * +obj[item.contract].price) / +solPrice || '0';
        console.log(holdSol, 2);
        return {
          ...item,
          ...obj[item.contract],
          holdSol,
          profit: calculatePercentageChange(holdSol, item.sold_sol, item.bought_sol)
        }
      }))
    }
  }
  
  useEffect(() => {
    if (!address) {
      return;
    }
    getBalances();
  }, [address]);

  const tokenData = [
    {
      tokenImage: 'https://example.com/image1.png',
      tokenName: 'Token1',
      bought: 100,
      sold: 50,
      worth: 5000,
      profit: 200
    },
    {
      tokenImage: 'https://example.com/image2.png',
      tokenName: 'Token2',
      bought: 200,
      sold: 100,
      worth: 10000,
      profit: 500
    }
    // 可以继续添加其他 token 数据
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell>Bought(Sol)</TableCell>
            <TableCell>Sold(Sol)</TableCell>
            <TableCell>Worth(Sol)</TableCell>
            <TableCell>Profit</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((token, index) => (
            <TokenRow
              key={index}
              address={token.contract}
              tokenImage={token.logoURI}
              tokenName={token.symbol}
              bought={token.bought_sol}
              sold={token.sold_sol}
              worth={token.holdSol}
              profit={token.profit}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default TokenTable;
