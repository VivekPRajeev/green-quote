import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                fullName : name,
                password: hashedPassword,
                isAdmin: false,
            },
        });

        return NextResponse.json({ user: { id: user.id, email: user.email, name: user.fullName } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}