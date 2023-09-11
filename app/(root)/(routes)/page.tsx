"use client";
import { useStoreModal } from "@/hooks/use-store-modal";

import { useEffect } from "react";

const SetupPage = () => {
     const onOpen = useStoreModal((state)=>state.onOpen);
     const isOpen = useStoreModal((state)=>state.isOpen);

     // sadece modal'ın açılmasını tetiklemesi için kullanacağız.
     useEffect(() => {
       if (!isOpen) {
        onOpen();
       }
     }, [isOpen, onOpen])
     
    return null;
  } 

export default SetupPage;
