"use client";
import { useAuth } from "@/libs/auth";
import Navigation from "./navigation";
import Loading from "@/components/Loading";

const AppLayout = ({ children }) => {
    const { user, authLoading } = useAuth({ middleware: "auth" });
    if (authLoading || !user) {
        return <Loading />;
    }
    return (
        <div className="flex h-screen overflow-hidden dark:bg-slate-800 dark:text-white">
            <Navigation user={user} />
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default AppLayout;
