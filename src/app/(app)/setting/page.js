import Link from "next/link";
import MainPage from "../main";
import { BoxesIcon, ContactIcon, ScaleIcon, User2Icon, WarehouseIcon } from "lucide-react";

const Setting = () => {
    return (
        <MainPage headerTitle="Setting">
            <div className="p-6">
                <ul className="flex flex-col w-1/2 bg-white rounded-2xl">
                    <Link href="/setting/user">
                        <li className="border-b p-2 border-slate-300 hover:bg-slate-200">
                            <button className="px-4 w-full text-start py-2 cursor-pointer flex items-center gap-2">
                                <User2Icon size={20} />
                                User
                            </button>
                        </li>
                    </Link>
                    <Link href="/setting/product">
                        <li className="border-b p-2 border-slate-300 hover:bg-slate-200">
                            <button className="px-4 w-full text-start py-2 cursor-pointer flex items-center gap-2">
                                <BoxesIcon size={20} />
                                Product
                            </button>
                        </li>
                    </Link>
                    <Link href="/setting/contact">
                        <li className="border-b p-2 border-slate-300 hover:bg-slate-200">
                            <button className="px-4 w-full text-start py-2 cursor-pointer flex items-center gap-2">
                                <ContactIcon size={20} />
                                Contact
                            </button>
                        </li>
                    </Link>
                    <Link href="/setting/account">
                        <li className="border-b p-2 border-slate-300 hover:bg-slate-200">
                            <button className="px-4 w-full text-start py-2 cursor-pointer flex items-center gap-2">
                                <ScaleIcon size={20} />
                                Chart of Account
                            </button>
                        </li>
                    </Link>
                    <Link href="/setting/warehouse">
                        <li className="p-2 border-slate-300 hover:bg-slate-200">
                            <button className="px-4 w-full text-start py-2 cursor-pointer flex items-center gap-2">
                                <WarehouseIcon size={20} />
                                Warehouse
                            </button>
                        </li>
                    </Link>
                </ul>
            </div>
        </MainPage>
    );
};

export default Setting;
