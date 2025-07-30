"use client";
import React, { useCallback, useEffect, useState } from "react";
import MainPage from "../../main";
import Notification from "@/components/Notification";
import axios from "@/libs/axios";
import formatNumber from "@/libs/formatNumber";
import Label from "@/components/Label";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { FilterIcon, RefreshCcwIcon } from "lucide-react";

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const BalanceSheet = () => {
    const [balanceSheet, setBalanceSheet] = useState([]);
    const [errors, setErrors] = useState([]); // Store validation errors
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [isModalFilterDataOpen, setIsModalFilterDataOpen] = useState(false);
    const [notification, setNotification] = useState({
        type: "",
        message: "",
    });

    const closeModal = () => {
        setIsModalFilterDataOpen(false);
    };

    const fetchBalanceSheet = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/balance-sheet-report/${startDate}/${endDate}`);
            setBalanceSheet(response.data.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchBalanceSheet();
    }, [fetchBalanceSheet]);

    const formatLongDate = (dateString) => {
        const tanggal = new Date(dateString);
        const formatted = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(tanggal);

        return formatted;
    };

    return (
        <MainPage
            headerTitle={
                <>
                    Report <span className="text-slate-400 font-normal">/ Balance Sheet Report</span>
                </>
            }
        >
            {notification.message && (
                <Notification type={notification.type} notification={notification.message} onClose={() => setNotification({ type: "", message: "" })} />
            )}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <div className="mb-5 flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">Neraca (Balance Sheet)</h1>
                            <span className="block text-sm text-slate-400">Periode : {formatLongDate(endDate)}</span>
                        </div>
                        <div>
                            <button
                                onClick={fetchBalanceSheet}
                                className="bg-white mr-1 font-bold p-3 rounded-lg border border-gray-300 hover:border-gray-400 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                            >
                                <RefreshCcwIcon className={`size-4 ${loading ? "animate-spin scale-110" : ""}`} />
                            </button>
                            <button
                                onClick={() => setIsModalFilterDataOpen(true)}
                                className="bg-white font-bold p-3 rounded-lg border border-gray-300 hover:border-gray-400"
                            >
                                <FilterIcon className="size-4" />
                            </button>
                        </div>
                        <Modal isOpen={isModalFilterDataOpen} onClose={closeModal} modalTitle="Filter Tanggal" maxWidth="max-w-md">
                            <div className="mb-4">
                                <Label className="font-bold">Filter tanggal</Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <button onClick={fetchBalanceSheet} className="btn-primary">
                                Submit
                            </button>
                        </Modal>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <h1 className="text-lg font-bold">Assets</h1>
                            <span className="block text-slate-500 text-sm mb-2 font-bold">
                                {loading ? "Loading.." : formatNumber(balanceSheet?.assets?.total)}{" "}
                                {typeof balanceSheet?.assetsGrowthRate?.rate === "number" && (
                                    <span className={balanceSheet?.assetsGrowthRate?.rate > 0 ? "font-normal text-green-600" : "font-normal text-red-600"}>
                                        ({balanceSheet?.assetsGrowthRate?.rate > 0 ? "+" : ""}
                                        {balanceSheet?.assetsGrowthRate?.rate.toFixed(2)}%)
                                    </span>
                                )}
                            </span>
                            <table className="table-auto w-full">
                                <tbody>
                                    {balanceSheet?.assets?.accounts?.map((account, index) => (
                                        <React.Fragment key={index}>
                                            <tr className="text-sm border-b border-slate-300 border-dashed text-slate-600" hidden={account.balance === 0}>
                                                <td colSpan={2} className="py-2 font-bold text-start">
                                                    {account.acc_name}
                                                </td>
                                                <td className="py-1 font-bold text-end">{formatNumber(account.balance)}</td>
                                            </tr>
                                            {account?.coa?.map((coa, index) => (
                                                <tr key={index} className="text-xs" hidden={coa.balance === 0}>
                                                    <td className="text-start w-5">-</td>
                                                    <td className="py-1 text-start">{coa.acc_name}</td>
                                                    <td className="py-1 text-end">{formatNumber(coa.balance)}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Liabilities</h1>
                            <span className="block text-slate-500 text-sm mb-2 font-bold">
                                {loading ? "Loading.." : formatNumber(balanceSheet?.liabilities?.total)}{" "}
                                {typeof balanceSheet?.liabilitiesGrowthRate?.rate === "number" && (
                                    <span className={balanceSheet?.liabilitiesGrowthRate?.rate > 0 ? "font-normal text-green-600" : "font-normal text-red-600"}>
                                        ({balanceSheet?.liabilitiesGrowthRate?.rate > 0 ? "+" : ""}
                                        {balanceSheet?.liabilitiesGrowthRate?.rate.toFixed(2)}%)
                                    </span>
                                )}
                            </span>

                            <table className="table-auto w-full">
                                <tbody>
                                    {balanceSheet?.liabilities?.accounts?.map((account, index) => (
                                        <React.Fragment key={index}>
                                            <tr className="text-sm border-b border-slate-300 border-dashed text-slate-600" hidden={account.balance === 0}>
                                                <td colSpan={2} className="py-2 font-bold text-start">
                                                    {account.acc_name}
                                                </td>
                                                <td className="py-1 font-bold text-end">{formatNumber(account.balance)}</td>
                                            </tr>
                                            {account?.coa?.map((coa, index) => (
                                                <tr key={index} className="text-xs" hidden={coa.balance === 0}>
                                                    <td className="text-start w-5">-</td>
                                                    <td className="py-1 text-start">{coa.acc_name}</td>
                                                    <td className="py-1 text-end">{formatNumber(coa.balance)}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                            <h1 className="mt-5 text-lg font-bold">Equity (Modal)</h1>
                            <span className="block text-slate-500 text-sm mb-2 font-bold">
                                {loading ? "Loading.." : formatNumber(balanceSheet?.equity?.total + balanceSheet?.profitLoss)}{" "}
                                {typeof balanceSheet?.equityGrowthRate?.rate === "number" && (
                                    <span className={balanceSheet?.equityGrowthRate?.rate > 0 ? "font-normal text-green-600" : "font-normal text-red-600"}>
                                        ({balanceSheet?.equityGrowthRate?.rate > 0 ? "+" : ""}
                                        {balanceSheet?.equityGrowthRate?.rate.toFixed(2)}%/{formatNumber(balanceSheet?.equityGrowthRate?.amount)})
                                    </span>
                                )}
                            </span>

                            <table className="table-auto w-full">
                                <tbody>
                                    {balanceSheet?.equity?.accounts?.map((account, index) => (
                                        <React.Fragment key={index}>
                                            <tr className="text-sm border-b border-slate-300 border-dashed text-slate-600" hidden={account.balance === 0}>
                                                <td colSpan={2} className="py-2 font-bold text-start">
                                                    {account.acc_name}
                                                </td>
                                                <td className="py-1 font-bold text-end">{formatNumber(account.balance + balanceSheet?.profitLoss)}</td>
                                            </tr>
                                            {account?.coa?.map((coa, index) => (
                                                <tr key={index} className="text-xs" hidden={coa.balance === 0}>
                                                    <td className="text-start w-5">-</td>
                                                    <td className="py-1 text-start">{coa.acc_name}</td>
                                                    <td className="py-1 text-end">{formatNumber(coa.balance)}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                    {loading ? null : (
                                        <tr className="text-xs">
                                            <td className="text-start">-</td>
                                            <td className="py-1 text-start">Laba Rugi Berjalan</td>
                                            <td className="py-1 text-end">{formatNumber(balanceSheet?.profitLoss)}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MainPage>
    );
};

export default BalanceSheet;
