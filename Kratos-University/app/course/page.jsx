"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";




const Redirect = ()=>{
    const router = useRouter();
    useEffect(()=>{
        router.push('/home');
    },[])
}


export default Redirect;