"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";


interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1,{
        message: "Lütfen gerekli alanları doldurun"
    }),
    
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm:React.FC<SettingsFormProps> = ({
    initialData
}) => {
    // delete işlemi farklı api'lar çağıracağından, (delete store, delete product etc.) create store modal'ı gibi her yerde kullanılabilecek bir modal olarak tasarlanmadı.
    // control for alert modal. Alert modal is going to call diffrent api route every single time.
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data: SettingsFormValues) => {
        // console.log(data);
        // create the api call which is going to update our store
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();   // settings altında ki page.tsx in tekrar render edilmesini sağlıyor. Böylece yeni değerler sayfada gözüküyor.
            toast.success("Store updated");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push("/");
            toast.success("Store deleted."); 
        } catch (error) {
            toast.error("Make sure you removed all products and categories first.");
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    };

  return (
    <>
        <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading
                title="Settings"
                description="Manage store preferences"
            />
            <Button className=""
                disabled={loading}
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
            >
                <Trash className="h-4 w-4" />
            </Button>
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field })=>(
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={loading}
                                        placeholder="Store name" {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} type="submit" className="ml-auto">
                    Save changes
                </Button>
            </form>
        </Form>
        <Separator />
        <ApiAlert
            title="NEXT_PUBLIC_API_URL"
            description={`${origin }/api/${params.storeId}`}
            variant="public"
        />
    </>
  );
};


