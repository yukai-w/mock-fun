import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (req) => {
  const searchParams = req.nextUrl.searchParams;
  const address = searchParams.get('address');
  const balance = await prisma.balances.findMany({
    where: {
      user_add: address,
    },
    
  });
  return NextResponse.json({
    code: 0,
    message: 'success',
    data: balance
  });
}

export const POST = async (req) => {
  const { userAdd, contract } = await req.json();
  const balance = await prisma.balances.findFirst({
    where: {
      user_add: userAdd,
      contract
    }
  });
  if (!balance) {
    return NextResponse.json({
      code: 0,
      message: 'success',
      data: {}
    });
  } else {
    return NextResponse.json({
      code: 0,
      message: 'success',
      data: balance
    });
  }
}
