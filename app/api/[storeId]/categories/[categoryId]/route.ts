
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// GET SPESIFIC CATEGORY
export async function GET(req: Request, { params }: { params: {categoryId: string}} ) {
    try {
        if (!params.categoryId) {
            return new NextResponse("Category Id is required", { status: 400});
        }
        // now GET to billboard:
        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            }
        });
        return NextResponse.json(category); // our api for get our category is now ready.
        
    } catch (error) {
        console.log('[CATEGORY _GET]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 

// update specific category
// note: req: Request her zaman ilk parametre olmalı.

export async function PATCH(req: Request, { params }: { params: {storeId: string, categoryId: string}} ) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }

        const body = await req.json();
        const {name, billboardId} = body;

        if (!name) {
            return new NextResponse('Name is required', {status: 400});
        }
        if (!billboardId) {
            return new NextResponse('Billboard Id is required', {status: 400});
        }
        if (!params.categoryId) {
            return new NextResponse("Category Id is required", { status: 400});
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
        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name: name,
                billboardId: billboardId
            }
        });
        return NextResponse.json(category); // our api for updating our category is now ready.
        
    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}   

// delete category

export async function DELETE(req: Request, { params }: { params: { storeId: string, categoryId: string}} ) {
    // burada dosya ismi [storeId] şeklinde olduğu için bu aynı zamanda route adıdır. params a bu şekilde ulaşıyoruz. next js in en önemli farkı bu.
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized.', {status: 401});
        }

        if (!params.categoryId) {
            return new NextResponse("Category Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        //user can't delete someone store or someone category. just can delete own store or category.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }

        // now delete to category:
        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        });
        return NextResponse.json(category); // our api for deleting our category is now ready.
        
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 



