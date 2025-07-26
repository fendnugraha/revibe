"use client";
import MainPage from "@/app/(app)/main";
import Notification from "@/components/Notification";
import axios from "@/libs/axios";
import formatDateTime from "@/libs/formatDateTime";
import formatNumber from "@/libs/formatNumber";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";

const TransactionDetail = ({ params }) => {
    const { invoice } = use(params);
    const [notification, setNotification] = useState({
        type: "",
        message: "",
    });
    const [order, setOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrder = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/get-trx-by-invoice/${invoice}`);
            setOrder(response.data.data);
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setIsLoading(false);
        }
    }, [invoice]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const formatLongDate = (date) => {
        // September 7, 2023
        const formattedDate = new Date(date).toLocaleDateString("id-ID", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        return formattedDate;
    };
    console.log(order);
    const calculateTotalTransaction = () => {
        let total = 0;
        order.forEach((item) => {
            total += item.transaction_type === "Purchase" ? item.cost * item.quantity : -item.price * item.quantity;
        });
        return total;
    };
    return (
        <MainPage
            headerTitle={
                <>
                    Transaction <span className="text-slate-400 font-normal">/ Detail</span>
                </>
            }
        >
            {notification.message && (
                <Notification type={notification.type} notification={notification.message} onClose={() => setNotification({ type: "", message: "" })} />
            )}
            <div className="flex items-center gap-2 mb-4">
                <Link className="underline hover:text-teal-500" href="/inventory">
                    <ArrowLeftIcon />
                </Link>
                <h1 className="text-slate-500">
                    Invoice: <span className="font-bold">{invoice}</span>{" "}
                </h1>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-3xl drop-shadow-sm">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <td className="font-bold">Invoice</td>
                                <td>: {order[0]?.invoice}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">Tanggal Transaksi</td>
                                <td>: {formatLongDate(order[0]?.date_issued)}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">Tipe Transaksi</td>
                                <td>: {order[0]?.transaction_type === "Purchase" ? "Pembelian Barang" : "Penjualan Barang"}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">{order[0]?.transaction_type === "Purchase" ? "Supplier" : "Customer"}</td>
                                <td>: {order[0]?.contact?.name}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">Cabang</td>
                                <td>: {order[0]?.warehouse?.name}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">Status</td>
                                <td>
                                    : {order[0]?.status} <span className="text-slate-400">({formatDateTime(order[0]?.updated_at)})</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <h1 className="text-slate-500 font-bold text-sm">Total Transaksi</h1>
                        <h1 className="text-slate-500 font-bold text-3xl">Rp {formatNumber(calculateTotalTransaction())}</h1>
                    </div>
                </div>
                <button className="btn btn-primary">Konfirmasi Barang</button>
                <div>
                    <table className="w-full text-xs table">
                        <thead>
                            <tr className="text-left">
                                <th>Nama Barang</th>
                                <th>Qty</th>
                                <th>Harga</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.length > 0 ? (
                                order?.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <span className="text-slate-400">{item.product?.code}</span> {item.product?.name}
                                        </td>
                                        <td className="text-center">{formatNumber(item.transaction_type === "Purchase" ? item.quantity : -item.quantity)}</td>
                                        <td className="text-right">{formatNumber(item.transaction_type === "Purchase" ? item.cost : item.price)}</td>
                                        <td className="text-right">
                                            {formatNumber(item.transaction_type === "Purchase" ? item.cost * item.quantity : -item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Tidak ada transaksi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainPage>
    );
};

export default TransactionDetail;
