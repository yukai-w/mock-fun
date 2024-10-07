import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();


export const POST = async (req) => {
  const { userAdd, contract, sold } = await req.json();
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
    if (!balance) {
      return NextResponse.json({
        code: 1,
        message: 'fail',
        data: {}
      });
    } else {
      let soldSol = null;
      if (!balance.sold_sol || balance.sold_sol === '0') {
        soldSol = String(sold);
      } else {
        soldSol = String(+balance.sold_sol + +sold);
      }
      await prisma.balances.update({
        where: {
          balance_id: balance.balance_id
        },
        data: {
          amount: String(0),
          sold_sol: soldSol
        }
      });
      await prisma.users.update({
        where: {
          user_add: userAdd
        },
        data: {
          m_sol: String(+user.m_sol + sold)
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
