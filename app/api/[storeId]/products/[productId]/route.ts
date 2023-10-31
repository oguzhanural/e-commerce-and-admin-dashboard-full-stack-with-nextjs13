
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// GET SPESIFIC product
export async function GET(req: Request, { params }: { params: {productId: string}} ) {
    try {
        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 400});
        }
        // now GET to product:
        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {  // on the frontend we want to display those url's
                images: true,
                category: true,
                size: true,
                color: true
            }
        });
        return NextResponse.json(product); // our api for get our product is now ready.
        
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 

// update specific product
// note: req: Request her zaman ilk parametre olmalı.

export async function PATCH(req: Request, { params }: { params: {storeId: string, productId: string}} ) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated.', {status: 401});
        }

        const body = await req.json();
        const {
            name, 
            price, 
            categoryId, 
            sizeId, 
            colorId, 
            isFeatured, 
            isArchived, 
            images
        } = body;

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
        
        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
        }

        // now update to product:
        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name: name,
                price: price,
                categoryId: categoryId,
                sizeId: sizeId,
                colorId: colorId,
                isArchived: isArchived,
                isFeatured: isFeatured,
                images: {
                    deleteMany: {}
                }
            },

        });
        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product); // our api for updating our product is now ready.
        
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
}   

// delete product

export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string}} ) {

    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized.', {status: 401});
        }

        if (!params.productId) {
            return new NextResponse("Product Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        //users can't delete someone store, billboard or product.
        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403}); 
            // user logged in but doesn't have the permission to modify what they are trying to modify.
        }

        // now delete to product:
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        });
        return NextResponse.json(product); // our api for deleting our product is now ready.
        
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500});
    }
} 



