"use client";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Modal from "@/components/Modal";
import Paginator from "@/components/Paginator";
import { ArrowBigDown, ArrowBigUp, Eye, EyeIcon, FilterIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const FinanceLog = ({ finance, loading, formatDateTime, formatNumber, handleChangePage }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [isModalFilterDataOpen, setIsModalFilterDataOpen] = useState(false);

    const closeModal = () => {
        setIsModalFilterDataOpen(false);
    };

    return (
        <div className="bg-white p-4 rounded-3xl">
            <div className="flex justify-between items-start">
                <h1 className="text-xl font-bold">Finance Log</h1>
                <button
                    onClick={() => setIsModalFilterDataOpen(true)}
                    className="bg-white font-bold p-2 rounded-lg border border-gray-300 hover:border-gray-400"
                >
                    <FilterIcon className="size-4" />
                </button>
            </div>
            <Modal isOpen={isModalFilterDataOpen} onClose={closeModal} modalTitle="Filter Tanggal" maxWidth="max-w-md">
                <div className="mb-4">
                    <Label className="font-bold">Dari</Label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <Label className="font-bold">Sampai</Label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <button onClick={() => fetchProfitLoss()} disabled={loading} className="btn-primary">
                    Submit
                </button>
            </Modal>
            <div className="mt-2">
                <input
                    type="text"
                    placeholder="Search.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border w-full p-1 px-4 border-slate-300 rounded-xl"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table w-full text-xs">
                    <thead>
                        <tr>
                            <th className="w-12">Type</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>
                                <EyeIcon className="w-4 h-4" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center animate-pulse">
                                    Loading data, please wait...
                                </td>
                            </tr>
                        ) : (
                            finance.finance?.data.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center whitespace-nowrap w-12">
                                        {item.bill_amount > 0 ? (
                                            <ArrowBigDown className="inline text-red-600" />
                                        ) : (
                                            <ArrowBigUp className="inline text-green-600" />
                                        )}
                                    </td>

                                    <td className="whitespace-normal break-words max-w-xs">
                                        <span className="text-xs text-slate-400 block">
                                            {formatDateTime(item.created_at)} | {item.invoice}
                                        </span>
                                        {item.journal?.entries
                                            ?.filter((entry) => ![7, 10, 11, 16, 21].includes(entry.chart_of_account_id))
                                            .map((entry, index) => (
                                                <span key={index} className="block">
                                                    {entry.chart_of_account?.acc_name}
                                                </span>
                                            ))}
                                    </td>
                                    <td className={`text-end font-bold ${item.bill_amount > 0 ? "text-red-600" : "text-green-600"}`}>
                                        {formatNumber(item.bill_amount > 0 ? item.bill_amount : item.payment_amount)}
                                    </td>
                                    <td className="text-center">
                                        <Link className="hover:text-blue-600 hover:scale-105" href={`/finance/detail/${item.id}`}>
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="px-4 py-4 sm:py-0">
                    {finance.finance?.last_page > 1 && <Paginator links={finance.finance} handleChangePage={handleChangePage} />}
                </div>
            </div>
        </div>
    );
};

export default FinanceLog;
