"use client";
import { ArrowLeftRightIcon, ChartAreaIcon, CogIcon, DollarSignIcon, LayoutDashboardIcon, Menu, PowerIcon, StoreIcon } from "lucide-react";
import { useState } from "react";
import NavLink from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { useAuth } from "@/libs/auth";

const Navigation = ({ user }) => {
    const { logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathName = usePathname();
    const userRole = user?.role?.role;
    return (
        <>
            <nav className={`hidden sm:flex sm:flex-col ${isMenuOpen ? "w-64" : "w-16"} h-screen justify-between transition-all duration-200 ease-in`}>
                {/* Header */}
                <button className="flex items-center cursor-pointer text-slate-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {/* Tombol Toggle */}
                    <span className="w-16 h-20 flex items-center justify-center flex-shrink-0 text-slate-700">
                        <Menu size={32} />
                    </span>

                    {/* Logo Text */}
                    <h1
                        className={`text-xl text-nowrap font-bold transition-all duration-300 origin-left ${
                            isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                    >
                        re<span className="text-red-500">V</span>ibe Apps
                    </h1>
                </button>
                {/* Middle Menu */}
                <div className="">
                    <div className="bg-white border border-slate-200 rounded-3xl drop-shadow-xs">
                        <ul className="space-y-2 py-4">
                            <li>
                                <NavLink href="/dashboard" active={pathName.startsWith("/dashboard")}>
                                    <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-500">
                                        <LayoutDashboardIcon size={20} className="" />
                                    </span>
                                    <span
                                        className={`text-sm transition-all duration-300 origin-left ${
                                            isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                        }`}
                                    >
                                        Dashboard
                                    </span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink href="/order" active={pathName.startsWith("/order")}>
                                    <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-500">
                                        <ArrowLeftRightIcon size={20} className="" />
                                    </span>
                                    <span
                                        className={`text-sm transition-all duration-300 origin-left ${
                                            isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                        }`}
                                    >
                                        Order
                                    </span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink href="/store" active={pathName.startsWith("/store")}>
                                    <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-500">
                                        <StoreIcon size={20} className="" />
                                    </span>
                                    <span
                                        className={`text-sm transition-all duration-300 origin-left ${
                                            isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                        }`}
                                    >
                                        Store
                                    </span>
                                </NavLink>
                            </li>
                            {userRole === "Administrator" && (
                                <>
                                    <li>
                                        <NavLink href="/finance" active={pathName.startsWith("/finance")}>
                                            <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-500">
                                                <DollarSignIcon size={20} className="" />
                                            </span>
                                            <span
                                                className={`text-sm transition-all duration-300 origin-left ${
                                                    isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                                }`}
                                            >
                                                Finance
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink href="/summary" active={pathName.startsWith("/summary")}>
                                            <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-500">
                                                <ChartAreaIcon size={20} className="" />
                                            </span>
                                            <span
                                                className={`text-sm transition-all duration-300 origin-left ${
                                                    isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                                }`}
                                            >
                                                Summary
                                            </span>
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                        {userRole === "Administrator" && (
                            <ul className="mt-4 border-t border-slate-300 py-4">
                                <li>
                                    <NavLink href="/setting" active={pathName.startsWith("/setting")}>
                                        <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-500">
                                            <CogIcon size={20} className="" />
                                        </span>
                                        <span
                                            className={`text-sm transition-all duration-300 origin-left ${
                                                isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                            }`}
                                        >
                                            Setting
                                        </span>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {/* <NavLink href="/user/profile" active={pathName.startsWith("/user/profile")}>
                        <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-500">
                            <UserIcon size={20} className="" />
                        </span>
                        <span
                            className={`text-sm text-nowrap transition-all duration-300 origin-left ${
                                isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            }`}
                        >
                            My Profile
                        </span>
                    </NavLink> */}
                <button onClick={logout} className="flex items-center cursor-pointer">
                    {/* Tombol Toggle */}
                    <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-red-500 hover:text-red-400">
                        <PowerIcon size={24} strokeWidth={3} />
                    </span>

                    {/* Logo Text */}
                    <h1
                        className={`text-sm transition-all duration-300 text-red-500 hover:text-red-400 origin-left ${
                            isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                    >
                        Logout
                    </h1>
                </button>
            </nav>
        </>
    );
};

export default Navigation;
