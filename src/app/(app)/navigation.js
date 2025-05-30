"use client";
import { ArrowLeftRightIcon, HomeIcon, LayoutDashboardIcon, Menu, PowerCircleIcon, ReceiptIcon, SettingsIcon, StoreIcon } from "lucide-react";
import { useState } from "react";
import NavLink from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { useAuth } from "@/libs/auth";

const Navigation = () => {
    const { logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathName = usePathname();
    return (
        <>
            <nav
                className={`hidden sm:flex sm:flex-col ${
                    isMenuOpen ? "w-64" : "w-16 border-e border-slate-200"
                } h-screen justify-between transition-all duration-200 ease-in`}
            >
                {/* Header */}
                <button className="flex items-center mb-4 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {/* Tombol Toggle */}
                    <span className="w-16 h-20 flex items-center justify-center flex-shrink-0">
                        <Menu size={24} />
                    </span>

                    {/* Logo Text */}
                    <h1 className={`text-xl font-bold transition-all duration-300 origin-left ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                        Logo
                    </h1>
                </button>
                {/* Middle Menu */}
                <div className="flex-1">
                    <ul className="">
                        <li>
                            <NavLink href="#">
                                <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-700">
                                    <LayoutDashboardIcon size={20} />
                                </span>
                                <span
                                    className={`text-sm transition-all duration-300 origin-left ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                                >
                                    Dashboard
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink href="/order">
                                <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-700">
                                    <ReceiptIcon size={20} />
                                </span>
                                <span
                                    className={`text-sm transition-all duration-300 origin-left ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                                >
                                    Order
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink href="#">
                                <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-700">
                                    <ArrowLeftRightIcon size={20} />
                                </span>
                                <span
                                    className={`text-sm transition-all duration-300 origin-left ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                                >
                                    Transaction
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink href="#">
                                <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-700">
                                    <StoreIcon size={20} />
                                </span>
                                <span
                                    className={`text-sm transition-all duration-300 origin-left ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                                >
                                    Store
                                </span>
                            </NavLink>
                        </li>
                    </ul>
                    <ul className="mt-4 border-t border-slate-300">
                        <li>
                            <NavLink href="/setting" active={pathName.startsWith("/setting")}>
                                <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-700">
                                    <SettingsIcon size={20} />
                                </span>
                                <span
                                    className={`text-sm transition-all duration-300 origin-left ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                                >
                                    Setting
                                </span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Footer */}
                <button onClick={logout} className="flex items-center hover:bg-slate-200 cursor-pointer">
                    {/* Tombol Toggle */}
                    <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-700">
                        <PowerCircleIcon size={24} />
                    </span>

                    {/* Logo Text */}
                    <h1 className={`text-sm transition-all duration-300 origin-left ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>Logout</h1>
                </button>
            </nav>
        </>
    );
};

export default Navigation;
