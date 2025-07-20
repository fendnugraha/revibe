"use client";
import {
    ArrowLeftRightIcon,
    ChartAreaIcon,
    CirclePowerIcon,
    DollarSignIcon,
    GemIcon,
    LayoutDashboardIcon,
    LoaderIcon,
    MenuIcon,
    StoreIcon,
    XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ResponsiveNavLink, { ResponsiveNavButton } from "@/components/ResponsiveNavLink";
import { usePathname } from "next/navigation";
import { useAuth } from "@/libs/auth";
import formatNumber from "@/libs/formatNumber";
import { mutate } from "swr";

const MainPage = ({ children, headerTitle }) => {
    const { user } = useAuth({ middleware: "auth" });
    const [isOpen, setIsOpen] = useState(false);

    const pathName = usePathname();
    const drawerReff = useRef();
    const userRole = user?.role?.role;

    const userWarehouseId = user?.role?.warehouse_id;
    const userWarehouseName = user?.role?.warehouse?.name;
    const toOrdinal = (number) => {
        const suffixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];
        const mod = number % 100;
        return suffixes[mod - 10] || suffixes[mod] || suffixes[0];
    };
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const longMonthName = today.toLocaleDateString("id-ID", { month: "long" });
        const day = String(today.getDate()).padStart(2, "0");
        const dayName = today.toLocaleDateString("id-ID", { weekday: "long" });
        return `${dayName}, ${day} ${longMonthName} ${year}`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerReff.current && !drawerReff.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    return (
        <>
            <header className="w-full h-20 flex items-center justify-between px-4 sm:px-12 py-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-700">
                    {headerTitle}
                    <span className="text-xs font-normal p-0 block">{getCurrentDate()}</span>
                </h1>
            </header>
            <div
                ref={drawerReff}
                className={`mt-2 transform ${
                    isOpen ? "opacity-100 scale-y-100 h-auto" : "opacity-0 scale-y-0 h-0"
                } sm:hidden transition-all origin-top duration-200 ease-in`}
            >
                <div className="bg-white rounded-2xl">
                    <ul className="space-y-2 py-2">
                        <li className="flex items-center justify-between px-4 py-2">
                            <h1 className="text-md font-bold">{user?.role?.warehouse?.name}</h1>
                            <span className="text-sm">{user?.role?.role}</span>
                        </li>
                        <li className="">
                            <ResponsiveNavLink href="/dashboard" active={pathName === "/dashboard"}>
                                <LayoutDashboardIcon size={20} className="mr-2 inline" /> Dashboard
                            </ResponsiveNavLink>
                        </li>
                        <li className="">
                            <ResponsiveNavLink href="/transaction" active={pathName.startsWith("/transaction")}>
                                <ArrowLeftRightIcon size={20} className="mr-2 inline" /> Transaction
                            </ResponsiveNavLink>
                        </li>
                        <li className="">
                            <ResponsiveNavLink href="/store" active={pathName.startsWith("/store")}>
                                <StoreIcon size={20} className="mr-2 inline" /> Store
                            </ResponsiveNavLink>
                        </li>
                        {userRole === "Administrator" && (
                            <>
                                <li className="">
                                    <ResponsiveNavLink href="/finance" active={pathName.startsWith("/finance")}>
                                        <DollarSignIcon size={20} className="mr-2 inline" /> Finance
                                    </ResponsiveNavLink>
                                </li>
                                <li className="">
                                    <ResponsiveNavLink href="/summary" active={pathName.startsWith("/summary")}>
                                        <ChartAreaIcon size={20} className="mr-2 inline" /> Summary
                                    </ResponsiveNavLink>
                                </li>
                            </>
                        )}
                        <li className="border-t border-slate-300 pt-2">
                            <ResponsiveNavButton>
                                <CirclePowerIcon size={20} className="mr-2 inline" /> Logout
                            </ResponsiveNavButton>
                        </li>
                    </ul>
                </div>
            </div>
            <main className="h-[calc(100vh-80px)] overflow-auto">{children}</main>
        </>
    );
};

export default MainPage;
