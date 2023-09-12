import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req:Request) {
    try {
        // elimizde ki form bilgileri ile burada store'u yaratalım.
        const { userId } = auth(); // we have access to the currently logged in userId who is trying create a new store using our api
        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }

        if (!name) {
            return new NextResponse('Name is required', {status: 400});
        }

        // now we can create store:
        const store = await prismadb.store.create({
            data: {
                name,
                userId,
            }
        });

        return NextResponse.json(store); // our api for creating a store is now ready.

    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse('Internal Error', { status: 500});
    }
}