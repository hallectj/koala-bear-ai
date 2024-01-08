"use client"

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from "./sidebar";

const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
      setIsMounted(true);
    }, [])

    if(!isMounted) return null;

    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button className="md:hidden" size="icon" variant="ghost">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
    )
}

export default MobileSidebar;