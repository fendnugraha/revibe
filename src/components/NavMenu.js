export default function NavMenu({ children }) {
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

    return {
        navMenu,
    };
}
