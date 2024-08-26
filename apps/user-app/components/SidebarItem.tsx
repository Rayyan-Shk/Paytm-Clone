// SidebarItem.tsx
"use client"
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({ href, title, icon }: { href: string; title: string; icon: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname()
    const selected = pathname === href

    return (
        <div 
            className={`flex items-center px-6 py-3 cursor-pointer transition-colors duration-200 ${
                selected ? "bg-gray-100 text-indigo-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`} 
            onClick={() => router.push(href)}
        >
            <div className="pr-3">
                {React.cloneElement(icon as React.ReactElement, {
                    className: `w-5 h-5 ${selected ? "text-indigo-600" : "text-gray-400"}`
                })}
            </div>
            <div className={`font-medium ${selected ? "text-indigo-600" : "text-gray-600"}`}>
                {title}
            </div>
        </div>
    )
}