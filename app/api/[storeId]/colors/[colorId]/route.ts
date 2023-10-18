
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// GET SPESIFIC COLOR
export async function GET(req: Request, { params }: { params: {colorId: string}} ) {
    try {
        if (!params.colorId) {
            return new NextResponse("Color Id is required", { status: 400});
        }
        // now GET to color:
        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });
        return NextResponse.json(color); // our api for get our color is now ready.
        
    } catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 

// update specific COLOR
// note: req: Request her zaman ilk parametre olmalı.

export async function PATCH(req: Request, { params }: { params: {storeId: string, colorId: string}} ) {
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
        if (!params.colorId) {
            return new NextResponse("Color Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        //user can't update someone store color. just can update own store color.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }

        // now update to billboard:
        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name: name,
                value: value
            }
        });
        return NextResponse.json(color); // our api for updating our color is now ready.
        
    } catch (error) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}   

// delete spesific color

export async function DELETE(req: Request, { params }: { params: { storeId: string, colorId: string}} ) {

    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized.', {status: 401});
        }

        if (!params.colorId) {
            return new NextResponse("Color Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        //user can't delete someone store, someone billboard, size, or color. just can update own store, color, billboard or size.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }

        // now delete to color:
        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });
        return NextResponse.json(color); // our api for deleting our color is now ready.
        
    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 



