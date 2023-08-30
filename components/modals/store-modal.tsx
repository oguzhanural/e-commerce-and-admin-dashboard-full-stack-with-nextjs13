"use client";

import { useState } from "react";

import axios from "axios"
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";



    // zod ile schema oluşturacağız
    const formSchema = z.object({
        name: z.string().min(1,{
            message: "Please fill in the required fields.",
        }),
    });

export const StoreModal = () => {

    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false); // which elements are to be disabled once our form is loading.

    // we have a form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    });

    // submit function
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        // console.log(values);
        // TODO: Create store:
        try {
            setLoading(true);
            const response = await axios.post('/api/stores', values);
            // console.log(response.data);
            window.location.assign(`/${response.data.id}`);
            // toast.success("Store created successfuly"); // don't need this beacuse it's redirect to dashboard page.

        } catch (error) {
            toast.error("Something went wrong.");
        }
        finally{
            setLoading(false);
        }
    } 


    return(
        <Modal
        title="Create store"
        description="Add a new store to manage products and categories"
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
        
    >
        <div className="">
            <div className="space-y-4 py-2 pb-4">
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field} ) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading} 
                                            placeholder="E-Commerce" 
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* burada form da ilgili yerler doldurulmazsa form mesaj propu verip defaultu değiştireceğim */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                            <Button 
                            disabled={loading}
                            variant="outline" 
                            onClick={storeModal.onClose}>
                                Cancel
                            </Button>

                            <Button
                            disabled={loading}
                            type="submit">
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
        
    </Modal>
    )
}