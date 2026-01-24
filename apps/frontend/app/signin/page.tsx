"use client";

import SignInPage from "@/components/SignInPage";
import { redirect } from "next/navigation";
import { useCheckUserLoggedIn } from "../hook/useCheckUserLoggedIn";


export default function SignIn(){
  const isLoggedIn = useCheckUserLoggedIn()
  
  if(isLoggedIn){
    redirect('/dashboard')
  }

  return <SignInPage/>
}