import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req:Request, { params }: { params: { storeId: string } }) {
    try {
        // elimizde ki form bilgileri ile burada billboard'u yaratalım.
        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }

        if (!name) {
            return new NextResponse('Name is required', {status: 400});
        }
        if (!billboardId) {
            return new NextResponse('Billboard id is required', {status: 400});
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

        //user can't update someone categories. just can update own categories.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }


        // now we can create category:
        const category = await prismadb.category.create({
            data: {
                name: name,
                billboardId: billboardId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(category); // our api for creating a category is now ready.

    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse('Internal Error', { status: 500});
    }
}

export async function GET(req:Request, { params }: {params: {storeId: string}} ) {
    try {

        if (!params.storeId) {
            return new NextResponse('Store id is required', {status: 400});
        }

        // now we can GET ALL categories:
        const categories = await prismadb.category.findMany({
           where: {
            storeId: params.storeId
           }
        });

        return NextResponse.json(categories); // our api for get all categories is now ready.

    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse('Internal Error', { status: 500});
    }
}