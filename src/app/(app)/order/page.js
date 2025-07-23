"use client";
import Button from "@/components/Button";
import MainPage from "../main";
import { EyeIcon, PlusIcon, QrCode } from "lucide-react";
import Modal from "@/components/Modal";
import CreateOrder from "./components/CreateOrder";
import { useCallback, useEffect, useState } from "react";
import Notification from "@/components/Notification";
import axios from "@/libs/axios";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import OrderStatus from "./components/OrderStatus";
import { QRCodeSVG } from "qrcode.react";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [printQrOrder, setPrintQrOrder] = useState(null);
    const [shouldPrint, setShouldPrint] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [notification, setNotification] = useState({
        type: "",
        message: "",
    });

    const [isModalCreateOrderOpen, setIsModalCreateOrderOpen] = useState(false);
    const closeModal = () => {
        setIsModalCreateOrderOpen(false);
    };

    const fetchOrders = useCallback(
        async (url = "/api/orders") => {
            setIsLoading(true);
            try {
                const response = await axios.get(url, {
                    params: {
                        search: search,
                    },
                });
                setOrders(response.data.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [search]
    );

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handlePrintQR = (orderNumber) => {
        setPrintQrOrder(orderNumber);
        setShouldPrint(true);
    };

    useEffect(() => {
        if (shouldPrint) {
            const timer = setTimeout(() => {
                window.print();
                setShouldPrint(false);
                setPrintQrOrder(null);
            }, 300); // beri waktu render QR dulu (300ms cukup aman)

            return () => clearTimeout(timer);
        }
    }, [shouldPrint]);

    return (
        <MainPage headerTitle="Service Order">
            {notification.message && (
                <Notification type={notification.type} notification={notification.message} onClose={() => setNotification({ type: "", message: "" })} />
            )}
            <OrderStatus orders={orders} />
            <div className="bg-white rounded-3xl p-4 col-span-3">
                <Button buttonType="primary" onClick={() => setIsModalCreateOrderOpen(true)} className={`flex item-center gap-2 mb-4`}>
                    <PlusIcon size={20} /> Add Order
                </Button>
                <div>
                    <input
                        type="search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full text-xs">
                        <thead className="">
                            <tr>
                                <th>Order No.</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data?.length > 0 ? (
                                orders.data?.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="text-slate-500 block text-xs">{order.date_issued}</span>
                                            <Link href={`/order/detail/${order.order_number}`} className="hover:underline">
                                                {order.order_number}
                                            </Link>
                                        </td>
                                        <td>{order.contact?.name}</td>
                                        <td>
                                            <span className="text-red-500 block text-xs font-bold">{order.phone_type.toUpperCase()}</span>
                                            {order.description}
                                        </td>
                                        <td className="text-center">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="text-center">
                                            {printQrOrder === order.order_number && (
                                                <div className="p-4 print:block hidden">
                                                    <QRCodeSVG
                                                        value={`${typeof window !== "undefined" ? window.location.origin : ""}/order/invoice/${
                                                            order.order_number
                                                        }`}
                                                        size={128}
                                                    />
                                                </div>
                                            )}

                                            {/* Tombol cetak QR */}
                                            <button
                                                onClick={() => {
                                                    handlePrintQR(order.order_number);
                                                    console.log(printQrOrder);
                                                }}
                                                className="text-slate-500 hover:text-slate-600 cursor-pointer no-print"
                                            >
                                                Cetak QR
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalCreateOrderOpen} onClose={closeModal} modalTitle="Create Order" maxWidth="max-w-2xl">
                <CreateOrder
                    isModalOpen={setIsModalCreateOrderOpen}
                    notification={(type, message) => setNotification({ type, message })}
                    fetchOrders={fetchOrders}
                />
            </Modal>
        </MainPage>
    );
};

export default Order;
