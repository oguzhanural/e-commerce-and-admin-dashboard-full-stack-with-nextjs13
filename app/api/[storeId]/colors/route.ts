import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req:Request, { params }: {params: {storeId: string}} ) {
    try {

        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }

        if (!name) {
            return new NextResponse('Name is required', {status: 400});
        }
        if (!value) {
            return new NextResponse('Value is required', {status: 400});
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

        //user can't update someone color. just can update own color.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }


        // now we can create color:
        const color = await prismadb.color.create({
            data: {
                name: name,
                value: value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(color); // our api for creating a color is now ready.

    } catch (error) {
        console.log('[COLORS_POST]', error);
        return new NextResponse('Internal Error', { status: 500});
    }
}

export async function GET(req:Request, { params }: {params: {storeId: string}} ) {
    try {

        if (!params.storeId) {
            return new NextResponse('Store id is required', {status: 400});
        }

        // now we can GET ALL colors:
        const colors = await prismadb.color.findMany({
           where: {
            storeId: params.storeId
           }
        });

        return NextResponse.json(colors); // our api for get all colors is now ready.

    } catch (error) {
        console.log('[COLORS_GET]', error);
        return new NextResponse('Internal Error', { status: 500});
    }
}