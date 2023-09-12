import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req:Request, { params }: {params: {storeId: string}} ) {
    try {
        // elimizde ki form bilgileri ile burada billboard'u yaratalım.
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }

        if (!label) {
            return new NextResponse('Label is required', {status: 400});
        }
        if (!imageUrl) {
            return new NextResponse('Image URL is required', {status: 400});
        }
        if (!params.storeId) {
            return new NextResponse('Store id is required', {status: 400});
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        //user can't update someone store. just can update own store.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }


        // now we can create billboard:
        const billboard = await prismadb.billboard.create({
            data: {
                label: label,
                imageUrl: imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard); // our api for creating a billboard is now ready.

    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse('Internal Error', { status: 500});
    }
}

export async function GET(req:Request, { params }: {params: {storeId: string}} ) {
    try {

        if (!params.storeId) {
            return new NextResponse('Store id is required', {status: 400});
        }

        // now we can GET ALL billboards:
        const billboards = await prismadb.billboard.findMany({
           where: {
            storeId: params.storeId
           }
        });

        return NextResponse.json(billboards); // our api for get all billboards is now ready.

    } catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse('Internal Error', { status: 500});
    }
}