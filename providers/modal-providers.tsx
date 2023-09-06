"use client";

import { useState, useEffect } from "react";

import { StoreModal } from "@/components/modals/store-modal";


export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true)
    }, []);
    
    if (!isMounted) {
        // this meaning is we are in server side. we are not going to render any modal server side
        return null;
    }

    return (
        // if we are client side
        <>
            <StoreModal />
        </>
    );
    
}