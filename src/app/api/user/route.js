import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async () => {
  const users = await prisma.users.findMany();
  console.log(users);
  return NextResponse.json({data: users});
}

// 接收address参数
export const POST = async (req) => {
  // 查询users是否存在  存在则返回信息  不存在则新建
  const { address } = await req.json();
  let user = await prisma.users.findUnique({
    where: {
      address,
    },
  });
  if (!user) {
    user = await prisma.users.create({
      data: {
        address,
        username: address.slice(0, 6),
        m_sol: '100'
      },
    });
  }
  return NextResponse.json({
    code: 0,
    message: 'success',
    data: user
  });
}

