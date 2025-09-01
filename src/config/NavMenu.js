import { LayoutDashboardIcon, ArrowLeftRightIcon, ScaleIcon, DollarSignIcon, ChartAreaIcon, CogIcon, BoxesIcon } from "lucide-react";

export const navMenu = {
    mainMenu: [
        { name: "Dashboard", path: "/dashboard", href: "/dashboard", icon: LayoutDashboardIcon, role: ["Administrator", "Kasir", "Teknisi"] },
        { name: "Order", path: "/order", href: "/order", icon: ArrowLeftRightIcon, role: ["Administrator", "Kasir", "Teknisi"] },
        { name: "Inventory", path: "/inventory", href: "/inventory", icon: BoxesIcon, role: ["Administrator"] },
        { name: "Finance", path: "/finance", href: "/finance", icon: DollarSignIcon, role: ["Administrator"] },
        { name: "Report", path: "/report", href: "/report", icon: ScaleIcon, role: ["Administrator"] },
    ],
    settings: [{ name: "Settings", path: "/setting", href: "/setting", icon: CogIcon, role: ["Administrator", "Kasir", "Teknisi"] }],
};
