
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// GET SPESIFIC SIZE
export async function GET(req: Request, { params }: { params: {sizeId: string}} ) {
    try {
        if (!params.sizeId) {
            return new NextResponse("Size Id is required", { status: 400});
        }
        // now GET to size:
        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        });
        return NextResponse.json(size); // our api for get our size is now ready.
        
    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 

// update specific size
// note: req: Request her zaman ilk parametre olmalı.

export async function PATCH(req: Request, { params }: { params: {storeId: string, sizeId: string}} ) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }

        const body = await req.json();
        const {name, value} = body;

        if (!name) {
            return new NextResponse('Name is required', {status: 400});
        }
        if (!value) {
            return new NextResponse('Value is required', {status: 400});
        }
        if (!params.sizeId) {
            return new NextResponse("Size Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        //user can't update someone store size. just can update own store size.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }

        // now update to billboard:
        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name: name,
                value: value
            }
        });
        return NextResponse.json(size); // our api for updating our size is now ready.
        
    } catch (error) {
        console.log('[SIZE_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}   

// delete spesific size

export async function DELETE(req: Request, { params }: { params: { storeId: string, sizeId: string}} ) {

    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized.', {status: 401});
        }

        if (!params.sizeId) {
            return new NextResponse("Size Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        //user can't delete someone store, someone billboard or size. just can update own store, billboard or size.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }

        // now delete to size:
        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        });
        return NextResponse.json(size); // our api for deleting our size is now ready.
        
    } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 



