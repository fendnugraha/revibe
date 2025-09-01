"use client";
import Button from "@/components/Button";
import InputGroup from "@/components/InputGroup";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatNumber, todayDate } from "@/libs/format";
import { DownloadIcon, FilterIcon, PrinterIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import CreateOrder from "./CreateOrder";
import axios from "@/libs/axios";
import Notification from "@/components/Notification";
import Paginator from "@/components/Paginator";
import Label from "@/components/Label";
import Input from "@/components/Input";

const OrderListTable = () => {
    const today = todayDate();
    const [OrderList, setOrderList] = useState([]);
    const [search, setSearch] = useState("");

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [notification, setNotification] = useState({
        type: "",
        message: "",
    });
    const [CurrentOrderStatus, setCurrentOrderStatus] = useState("All Orders");
    const OrderStatus = ["All Orders", "Pending", "In Progress", "Finished", "Completed", "Canceled", "Rejected"];
    const countOrderByStatus = (status) => {
        if (status === "All Orders") return OrderList.data?.length;
        return OrderList.data?.filter((order) => order.status === status).length;
    };

    const fetchOrders = useCallback(
        async (url = "/api/orders") => {
            setIsLoading(true);
            try {
                const response = await axios.get(url, {
                    params: {
                        search: search,
                        start_date: startDate,
                        end_date: endDate,
                    },
                });
                setOrderList(response.data.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [search, startDate, endDate]
    );

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleChangePage = (url) => {
        fetchOrders(url);
    };

    const [isModalCreateOrderOpen, setIsModalCreateOrderOpen] = useState(false);
    const [isModalFilterJournalOpen, setIsModalFilterJournalOpen] = useState(false);
    const closeModal = () => {
        setIsModalCreateOrderOpen(false);
        setIsModalFilterJournalOpen(false);
    };
    return (
        <>
            {notification.message && (
                <Notification type={notification.type} notification={notification.message} onClose={() => setNotification({ type: "", message: "" })} />
            )}
            <Button onClick={() => setIsModalCreateOrderOpen(true)}>New Order</Button>

            <div className="mt-4 card">
                <div className="p-4 flex items-start justify-between">
                    <div>
                        {OrderStatus.map((status, index) => (
                            <button
                                className={`mr-2 sm:mr-4 py-2 cursor-pointer text-xs ${
                                    CurrentOrderStatus === status
                                        ? "border-b-2 border-blue-500 text-slate-700 dark:text-orange-300"
                                        : "text-slate-400 hover:text-slate-500"
                                }`}
                                onClick={() => setCurrentOrderStatus(status)}
                                key={index}
                            >
                                {status}{" "}
                                <span className={`ml-2 ${CurrentOrderStatus === status ? "bg-blue-500" : "bg-slate-400"} text-white px-2 rounded-lg`}>
                                    {formatNumber(countOrderByStatus(status))}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="small-button">
                            <DownloadIcon size={18} />
                        </button>
                        <button onClick={() => setIsModalFilterJournalOpen(true)} className="small-button">
                            <FilterIcon size={18} />
                        </button>
                    </div>
                </div>
                <div className="px-4">
                    <InputGroup maxWidth="min-w-lg" InputIcon={<SearchIcon size={18} />} placeholder="Search" />
                </div>
                <div className="px-4 text-sm text-slate-500">
                    <h1>
                        Periode : {formatDate(startDate)} - {formatDate(endDate)}
                    </h1>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs table">
                        <thead>
                            <tr>
                                <th>Order No.</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Teknisi</th>
                                <th>QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {OrderList.data
                                ?.filter((order) => order.status === CurrentOrderStatus || CurrentOrderStatus === "All Orders")
                                .map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="text-slate-500 dark:text-slate-400 block text-xs">{order.date_issued}</span>
                                            <Link href={`/order/detail/${order.order_number}`} className="hover:underline font-bold">
                                                {order.order_number}
                                            </Link>
                                        </td>
                                        <td>{order.contact?.name}</td>
                                        <td>
                                            <span className="text-blue-500 dark:text-yellow-300 block text-xs font-bold">{order.phone_type.toUpperCase()}</span>
                                            {order.description}
                                        </td>
                                        <td className="text-center">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="text-center">{order.technician?.name ?? "-"}</td>
                                        <td className="flex items-center justify-center">
                                            <Link
                                                href={`/order/order_invoice/${order.order_number}`}
                                                className="text-slate-500 hover:text-slate-600 cursor-pointer"
                                            >
                                                <PrinterIcon size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4">{OrderList?.last_page > 1 && <Paginator links={OrderList} handleChangePage={handleChangePage} />}</div>
            </div>
            <Modal isOpen={isModalCreateOrderOpen} onClose={closeModal} modalTitle="Create New Order" maxWidth="max-w-2xl">
                <CreateOrder
                    isModalOpen={setIsModalCreateOrderOpen}
                    notification={(type, message) => setNotification({ type, message })}
                    fetchOrders={fetchOrders}
                />
            </Modal>
            <Modal isOpen={isModalFilterJournalOpen} onClose={closeModal} modalTitle="Filter Tanggal" maxWidth="max-w-md">
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                        <Label>Tanggal</Label>
                        <Input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <Label>s/d</Label>
                        <Input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            disabled={!startDate}
                        />
                    </div>
                </div>
                <button
                    onClick={() => {
                        fetchTransaction();
                        setIsModalFilterJournalOpen(false);
                    }}
                    className="btn-primary"
                >
                    Submit
                </button>
            </Modal>
        </>
    );
};

export default OrderListTable;
