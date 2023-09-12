
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// we are going to create 2 routes here.

// update store
// note: req: Request her zaman ilk parametre olmalı.
export async function PATCH(req: Request, { params }: { params: { storeId: string}} ) {
    // burada dosya ismi [storeId] şeklinde olduğu için bu aynı zamanda route adıdır. params a bu şekilde ulaşıyoruz. next js in en önemli farkı bu.
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }

        const body = await req.json();
        const {name} = body;
        if (!name) {
            return new NextResponse('Name is required', {status: 400});
        }
        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }
        // now update to store:
        const store = await prismadb.store.updateMany({
            data: {
                name: name
            },
            where: {
                id: params.storeId,
                userId: userId
            }
        });
        return NextResponse.json(store); // our api for updating our store (just now name) is now ready.
        
    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}   

// delete store
export async function DELETE(req: Request, { params }: { params: { storeId: string}} ) {
    // burada dosya ismi [storeId] şeklinde olduğu için bu aynı zamanda route adıdır. params a bu şekilde ulaşıyoruz. next js in en önemli farkı bu.
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized.', {status: 401});
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }
        // now delete to store:
        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId: userId
            }
        });
        return NextResponse.json(store); // our api for deleting our store (just now name) is now ready.
        
    } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 

