"use client";

import SignUpPage from "@/components/SignUpPage";
import { redirect } from "next/navigation";
import { useCheckUserLoggedIn } from "../hook/useCheckUserLoggedIn";


export default function SignUp(){
 const isLoggedIn = useCheckUserLoggedIn();
  console.log(isLoggedIn);

  if(isLoggedIn){
    redirect('/dashboard')
  }
  
  return <SignUpPage/>
}