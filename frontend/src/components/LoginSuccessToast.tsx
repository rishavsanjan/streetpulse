"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import  { useEffect } from 'react'
import { toast } from 'sonner';

const LoginSuccessToast = () => {

    const params = useSearchParams();
    const isLoggedIn = params.get("isLoggedIn");

    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn) {
            toast.success("Successfully logged in!");
            router.replace("/feed");
        }
    }, [router, isLoggedIn])


    return null;
}

export default LoginSuccessToast