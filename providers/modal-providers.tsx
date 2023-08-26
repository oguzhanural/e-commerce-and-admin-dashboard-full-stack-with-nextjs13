"use client";

import { useState, useEffect } from "react";

import { StoreModal } from "@/components/modals/store-modal";


export const ModalProvider = () => {
    const [isMouted, setIsMouted] = useState(false);

    useEffect(() => {
      setIsMouted(true)
    }, []);
    
    if (!isMouted) {
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