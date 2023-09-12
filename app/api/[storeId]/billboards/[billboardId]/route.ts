
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// GET SPESIFIC BILLBOARD
export async function GET(req: Request, { params }: { params: {billboardId: string}} ) {
    try {
        if (!params.billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400});
        }
        // now GET to billboard:
        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });
        return NextResponse.json(billboard); // our api for get our billboard is now ready.
        
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 

// update specific billboard
// note: req: Request her zaman ilk parametre olmalı.

export async function PATCH(req: Request, { params }: { params: {storeId: string, billboardId: string}} ) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }

        const body = await req.json();
        const {label, imageUrl} = body;

        if (!label) {
            return new NextResponse('Label is required', {status: 400});
        }
        if (!imageUrl) {
            return new NextResponse('Image URL is required', {status: 400});
        }
        if (!params.billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400});
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

        // now update to billboard:
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label: label,
                imageUrl: imageUrl
            }
        });
        return NextResponse.json(billboard); // our api for updating our billboard is now ready.
        
    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}   

// delete billboard

export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardId: string}} ) {
    // burada dosya ismi [storeId] şeklinde olduğu için bu aynı zamanda route adıdır. params a bu şekilde ulaşıyoruz. next js in en önemli farkı bu.
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized.', {status: 401});
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        //user can't delete someone store or someone billboard. just can update own store or billboard.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }

        // now delete to billboard:
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });
        return NextResponse.json(billboard); // our api for deleting our billboard is now ready.
        
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 



