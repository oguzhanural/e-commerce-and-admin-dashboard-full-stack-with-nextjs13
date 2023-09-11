import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SetupLayout( { children }: { children: React.ReactNode } ) {
    
    // in this laypout in this root, we don't have storeId. There is no spesific store we have to load.
    const { userId } = auth();
    if (!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            userId: userId
        }
    });
    if (store) {
        redirect(`/${store.id}`); // if the store exist, we are going to redirect to the dashboard 
    }
    //otherwise:
    return (
        <>
            {children}
        </>
    );

}