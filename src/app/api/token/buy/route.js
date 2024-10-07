import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();


export const POST = async (req) => {
  const { userAdd, contract, solPrice, tokenAmount, solAmount, tokenPrice, userId } = await req.json();
  const user = await prisma.users.findFirst({
    where: {
      address: userAdd,
    },
  });
  if (!user) {
    return NextResponse.json({
      code: 1,
      message: 'fail',
      data: {}
    });
  } else {
    const balance = await prisma.balances.findFirst({
      where: {
        user_add: userAdd,
        contract
      }
    });
    console.log(2323232, balance);
    if (!balance) {
      await prisma.balances.create({
        data: {
          user_add: userAdd,
          contract,
          amount: tokenAmount,
          average_price: String(tokenPrice),
          bought_sol: solAmount,
          sold_sol: '',
        }
      });
      await prisma.users.update({
        where: {
          user_id: user.user_id
        },
        data: {
          m_sol: String(user.m_sol - solAmount)
        },
      })
      return NextResponse.json({
        code: 0,
        message: 'success',
        data: {}
      });
    } else {
      await prisma.balances.update({
        where: {
          balance_id: balance.balance_id
        },
        data: {
          amount: String(+tokenAmount + +balance.amount),
          average_price: String((balance.average_price * balance.amount + tokenPrice * tokenAmount) / +(+tokenAmount + +balance.amount)),
          bought_sol: String(+solAmount + +balance.bought_sol)
        }
      });
      await prisma.users.update({
        where: {
          user_id: userId
        },
        data: {
          m_sol: String(user.m_sol - solAmount)
        },
      })
      return NextResponse.json({
        code: 0,
        message: 'success',
        data: {}
      });
    }
  }
}
