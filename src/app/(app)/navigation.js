"use client";
import {
    ArrowLeftRightIcon,
    BoxesIcon,
    ChartAreaIcon,
    CirclePowerIcon,
    CogIcon,
    DollarSignIcon,
    LayoutDashboardIcon,
    Menu,
    MenuIcon,
    PowerIcon,
    ScaleIcon,
    StoreIcon,
    User2Icon,
    XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NavLink from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { useAuth } from "@/libs/auth";
import ResponsiveNavLink, { ResponsiveNavButton } from "@/components/ResponsiveNavLink";
import Loading from "@/components/Loading";

const Navigation = ({ children, headerTitle }) => {
    const { user, authLoading, logout } = useAuth({ middleware: "auth" });
    const [isOpen, setIsOpen] = useState(false);

    const pathName = usePathname();
    const drawerReff = useRef();
    const userRole = user?.role?.role;
    const userWarehouseName = user?.role?.warehouse?.name;
    const userWarehouseId = user?.role?.warehouse_id;

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const longMonthName = today.toLocaleDateString("id-ID", { month: "long" });
        const day = String(today.getDate()).padStart(2, "0");
        const dayName = today.toLocaleDateString("id-ID", { weekday: "long" });
        return `${dayName}, ${day} ${longMonthName} ${year}`;
    };

    const navMenu = {
        mainMenu: [
            { name: "Dashboard", path: "/dashboard", href: "/dashboard", icon: LayoutDashboardIcon, role: ["Administrator", "Kasir", "Teknisi"] },
            { name: "Order", path: "/order", href: "/order", icon: ArrowLeftRightIcon, role: ["Administrator", "Kasir", "Teknisi"] },
            { name: "Inventory", path: "/inventory", href: "/inventory", icon: ScaleIcon, role: ["Administrator"] },
            { name: "Finance", path: "/finance", href: "/finance", icon: DollarSignIcon, role: ["Administrator"] },
            { name: "Report", path: "/report", href: "/report", icon: ChartAreaIcon, role: ["Administrator"] },
        ],
        settings: [{ name: "Settings", path: "/setting", href: "/setting", icon: CogIcon, role: ["Administrator", "Kasir", "Teknisi"] }],
    };
    if (authLoading || !user) {
        return <Loading />;
    }

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
                        <ul className="py-4">
                            {navMenu.mainMenu
                                .filter((item) => item.role.includes(userRole))
                                .map((item, index) => (
                                    <li key={index}>
                                        <NavLink href={item.href} active={pathName.startsWith(item.path)}>
                                            <span className="w-16 h-14 flex items-center justify-center flex-shrink-0 text-slate-500">
                                                <item.icon size={20} className="" />
                                            </span>
                                            <span
                                                className={`text-sm transition-all duration-300 origin-left ${
                                                    isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                                }`}
                                            >
                                                {item.name}
                                            </span>
                                        </NavLink>
                                    </li>
                                ))}
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

            <div className="flex-1">
                <header className="w-full h-20 flex items-center justify-between px-4 sm:px-12 py-2">
                    <h1 className="text-xl sm:text-xl font-bold text-slate-700">
                        {headerTitle}
                        <span className="text-xs font-normal p-0 block">
                            {userWarehouseName}, {getCurrentDate()}
                        </span>
                    </h1>
                    <div className="hidden sm:flex items-center gap-2 border border-red-300 text-red-500 px-4 py-1 rounded-2xl">
                        <User2Icon size={16} />
                        <h1>{user.email}</h1>
                    </div>
                    <button className="sm:hidden">
                        {!isOpen ? <MenuIcon size={30} onClick={() => setIsOpen(!isOpen)} /> : <XIcon size={30} onClick={() => setIsOpen(!isOpen)} />}
                    </button>
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
                            {navMenu.mainMenu
                                .filter((item) => item.role.includes(userRole))
                                .map((item, index) => (
                                    <li className="" key={index}>
                                        <ResponsiveNavLink href={item.href} active={pathName === item.path}>
                                            <item.icon size={20} className="mr-2 inline" /> {item.name}
                                        </ResponsiveNavLink>
                                    </li>
                                ))}
                            {navMenu.settings
                                .filter((item) => item.role.includes(userRole))
                                .map((item, index) => (
                                    <li className="" key={index}>
                                        <ResponsiveNavLink href={item.href} active={pathName === item.path}>
                                            <item.icon size={20} className="mr-2 inline" /> {item.name}
                                        </ResponsiveNavLink>
                                    </li>
                                ))}
                            <li className="border-t border-slate-300 pt-2">
                                <ResponsiveNavButton>
                                    <PowerIcon size={20} className="mr-2 inline" /> Logout
                                </ResponsiveNavButton>
                            </li>
                        </ul>
                    </div>
                </div>
                <main className="h-[calc(100vh-80px)] overflow-auto">
                    <div className="py-4 sm:py-8 px-4 sm:px-12 mb-28 sm:mb-0">{children}</div>
                </main>
            </div>
        </>
    );
};

export default Navigation;
