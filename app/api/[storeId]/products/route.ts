import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req:Request, { params }: {params: {storeId: string}} ) {
    try {
        // formdan gelen veriler doğrultusunda product'ı yaratalım.
        const { userId } = auth();
        const body = await req.json();

        const { 
            name, 
            images, 
            price, 
            categoryId, 
            sizeId, 
            colorId, 
            isFeatured, 
            isArchived} = body;

        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }
        if (!name) {
            return new NextResponse('Name is required', {status: 400});
        }
        if (!price) {
            return new NextResponse('Price is required', {status: 400});
        }
        if (!images || !images.length) {
            return new NextResponse('Images are required', {status: 400});
        }
        if (!categoryId) {
            return new NextResponse('Category Id required', {status: 400});
        }
        if (!sizeId) {
            return new NextResponse('Size Id required', {status: 400});
        }
        if (!colorId) {
            return new NextResponse('Color Id required', {status: 400});
        }
        // We do not check isArchived and isFeatured. Because they can be false.

        if (!params.storeId) {
            return new NextResponse('Store id is required', {status: 400});
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        //user can't update someone product. just can update own product.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }


        // now we can create product:
        const product = await prismadb.product.create({
            data: {
                name: name,
                price: price,
                categoryId: categoryId,
                sizeId: sizeId,
                colorId: colorId,
                isArchived: isArchived,
                isFeatured: isFeatured,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product); // our api for creating a product is now ready.

    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse('Internal Error', { status: 500});
    }
}

export async function GET(req:Request, { params }: {params: {storeId: string}} ) {
    try {

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse('Store id is required', {status: 400});
        }

        // now we can GET ALL products:
        const products = await prismadb.product.findMany({
           where: {
            storeId: params.storeId,
            categoryId: categoryId,
            sizeId: sizeId,
            colorId: colorId,
            isFeatured: isFeatured ? true : undefined, // yoksa görmezden gelmesi için undefined kullandık.
            isArchived: false,
           },
           include: {
            images: true,
            category: true,
            size: true,
            color: true
           },
           orderBy: {
            createdAt: "desc"
           }
        });

        return NextResponse.json(products); // our api for get all products is now ready.

    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500});
    }
}