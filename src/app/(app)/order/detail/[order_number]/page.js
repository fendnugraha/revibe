"use client";
import MainPage from "@/app/(app)/main";
import Modal from "@/components/Modal";
import Notification from "@/components/Notification";
import StatusBadge from "@/components/StatusBadge";
import axios from "@/libs/axios";
import TimeAgo from "@/libs/formatDateDistance";
import formatDateTime from "@/libs/formatDateTime";
import formatNumber from "@/libs/formatNumber";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import PartsTable from "../../components/PartsTable";
import CreatePaymentFrom from "../../components/CreatePaymentFrom";

const OrderDetail = ({ params }) => {
    const { order_number } = use(params);
    const [notification, setNotification] = useState({
        type: "",
        message: "",
    });
    const [order, setOrder] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isModalCreatePaymentOpen, setIsModalCreatePaymentOpen] = useState(false);
    const closeModal = () => {
        setIsModalCreatePaymentOpen(false);
    };

    const fetchOrder = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/get-order-by-order-number/${order_number}`);
            setOrder(response.data.data);
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setIsLoading(false);
        }
    }, [order_number]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleUpdateOrderStatus = async (status) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/update-order-status`, {
                order_number: order_number,
                status: status,
            });
            setNotification({ type: "success", message: response.data.message });
            fetchOrder();
        } catch (error) {
            console.error("Error updating order status:", error);
            setNotification({ type: "error", message: error.response.data.message });
        } finally {
            setIsLoading(false);
        }
    };

    console.log(order);
    const totalPrice = order.transaction?.stock_movements?.reduce((total, part) => total + part.price * -part.quantity, 0);
    return (
        <MainPage
            headerTitle={
                <>
                    Serivce Order <span className="text-slate-400 font-normal">/ Order Detail</span>
                </>
            }
        >
            {notification.message && (
                <Notification type={notification.type} notification={notification.message} onClose={() => setNotification({ type: "", message: "" })} />
            )}
            <div className="flex items-center gap-2 mb-4">
                <Link className="underline hover:text-teal-500" href="/order">
                    <ArrowLeftIcon />
                </Link>
                <h1 className="text-slate-500">
                    Order Number: <span className="font-bold">{order_number}</span>{" "}
                </h1>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-3xl drop-shadow-sm">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <td className="font-bold p-1">Dibuat Oleh</td>
                                <td>:</td>
                                <td>{order.user?.name}</td>
                            </tr>
                            <tr>
                                <td className="font-bold p-1">Tanggal</td>
                                <td>:</td>
                                <td>{formatDateTime(order.date_issued)}</td>
                            </tr>
                            <tr>
                                <td className="font-bold p-1">Invoice No.</td>
                                <td>:</td>
                                <td>{order.invoice || "-"}</td>
                            </tr>
                            <tr>
                                <td className="font-bold p-1">Status</td>
                                <td>:</td>
                                <td>
                                    <StatusBadge status={order.status} /> <span className="text-slate-400 text-xs">({formatDateTime(order.updated_at)})</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-bold p-1">Teknisi</td>
                                <td>:</td>
                                <td>{order.technician?.name || "Belum diassign"}</td>
                            </tr>
                            <tr>
                                <td className="font-bold p-1">Cabang</td>
                                <td>:</td>
                                <td>{order.warehouse?.name}</td>
                            </tr>
                            {order.status !== "Completed" && (
                                <tr>
                                    <td className="font-bold p-1">Tindak lanjut</td>
                                    <td>:</td>
                                    <td>
                                        {order.status !== "Finished" ? (
                                            <select
                                                disabled={
                                                    order.status === "Finished" ||
                                                    order.status === "Completed" ||
                                                    order.status === "Canceled" ||
                                                    order.status === "Rejected" ||
                                                    isLoading
                                                }
                                                onChange={(e) => handleUpdateOrderStatus(e.target.value)}
                                                value={order.status}
                                                className="border w-full border-gray-300 rounded-md p-1 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500"
                                            >
                                                <option value={"Pending"}>-Pilih tindakan-</option>
                                                {order.status !== "In Progress" ? (
                                                    <>
                                                        <option value="In Progress">Proses</option>
                                                        <option value="Rejected">Tolak</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="Take Over">Ambil Alih</option>
                                                        <option value="Canceled">Batalkan</option>
                                                    </>
                                                )}
                                            </select>
                                        ) : (
                                            <button
                                                className="bg-green-300 text-green-800 cursor-pointer hover:bg-green-400 hover:text-white rounded-md py-0.5 px-3 hover:drop-shadow-sm"
                                                onClick={() => setIsModalCreatePaymentOpen(true)}
                                            >
                                                Input Pembayaran
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <table className="w-full text-sm h-fit">
                        <tbody>
                            <tr>
                                <td className="font-bold p-1 w-60">Nama Pemilik</td>
                                <td>:</td>
                                <td>{order.contact?.name}</td>
                            </tr>
                            <tr>
                                <td className="font-bold p-1">No. Telepon / Whatsapp</td>
                                <td>:</td>
                                <td>{order.phone_number}</td>
                            </tr>
                            <tr>
                                <td className="font-bold p-1">Alamat Pemilik</td>
                                <td>:</td>
                                <td>{order.contact?.address || "-"}</td>
                            </tr>
                            <tr>
                                <td className="font-bold p-1">Perangkat</td>
                                <td>:</td>
                                <td>{order.phone_type?.toUpperCase()}</td>
                            </tr>
                            <tr>
                                <td className="font-bold p-1">Masalah/Keluhan</td>
                                <td>:</td>
                                <td>{order.description}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {["In Progress", "Completed", "Finished"].includes(order.status) && (
                    <div>
                        <div className="my-4" hidden={["Completed", "Finished"].includes(order.status)}>
                            <Link href={`/order/add/${order_number}`} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
                                Tambah Parts & Biaya
                            </Link>
                        </div>
                        <div className="my-4" hidden={order.status !== "Completed"}>
                            <Link
                                href={`/order/invoice/${order_number}`}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
                            >
                                Lihat Invoice
                            </Link>
                        </div>

                        <PartsTable parts={order.transaction} totalPrice={totalPrice} />
                    </div>
                )}
            </div>
            <Modal isOpen={isModalCreatePaymentOpen} onClose={closeModal} modalTitle="Input Pembayaran" maxWidth="max-w-lg">
                <CreatePaymentFrom
                    order={order}
                    isModalOpen={setIsModalCreatePaymentOpen}
                    notification={(type, message) => setNotification({ type, message })}
                    fetchOrder={fetchOrder}
                    totalPrice={totalPrice}
                    order_number={order_number}
                />
            </Modal>
        </MainPage>
    );
};

export default OrderDetail;
