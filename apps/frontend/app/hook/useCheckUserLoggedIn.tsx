"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export function useCheckUserLoggedIn(){
     const [isLoggedIn,setIsLoggedIn] = useState<boolean>()
    
      useEffect(() => {
        async function checkUser(){
          const token = await localStorage.getItem("token"); 
    
          if(token){
            setIsLoggedIn(true);
          }else{
            setIsLoggedIn(false)
          }
        }
    
          checkUser()
      },[])
    
      return isLoggedIn;
}