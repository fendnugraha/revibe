import axios from "@/libs/axios";
import DateTimeNow from "@/libs/dateTimeNow";
import formatNumber from "@/libs/formatNumber";
import { useCallback, useEffect, useState } from "react";

const CreatePaymentFrom = ({ isModalOpen, notification, fetchOrder, totalPrice, order_number }) => {
    const { today } = DateTimeNow();
    const [formData, setFormData] = useState({
        date_issued: today,
        paymentMethod: "cash",
        paymentAccountID: "",
        order_number: order_number,
    });
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAccountByIds = useCallback(
        async ({ account_ids }) => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/get-account-by-account-id`, { params: { account_ids } });
                setAccounts(response.data.data);
            } catch (error) {
                notification("error", error.response?.data?.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        },
        [notification]
    );

    useEffect(() => {
        fetchAccountByIds({ account_ids: [1, 2, 19] });
    }, [fetchAccountByIds]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/make-payment`, formData);
            notification("success", response.data.message);
            fetchOrder();
            isModalOpen(false);
            setFormData({ date_issued: today, paymentMethod: "cash", paymentAccountID: "", order_number: order_number });
        } catch (error) {
            console.error("Error updating order status:", error);
            notification("error", error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-900">Tanggal</label>
                    <input
                        type="datetime-local"
                        className="w-full border bg-white border-slate-200 px-4 py-2 rounded-xl mb-4"
                        value={formData.date_issued}
                        onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                    />
                </div>
                <div className="flex bg-indigo-400 w-fit rounded-xl mb-2">
                    <button
                        className={`${
                            formData.paymentMethod === "cash" ? "bg-indigo-600 text-white" : "text-white/50"
                        } py-0.5 px-3 cursor-pointer disabled:bg-slate-300 disabled:cursor-wait rounded-xl`}
                        disabled={loading}
                        onClick={() => setFormData({ ...formData, paymentMethod: "cash", paymentAccountID: "" })}
                    >
                        Cash
                    </button>
                    <button
                        className={`${
                            formData.paymentMethod === "credit" ? "bg-indigo-600 text-white" : "text-white/50"
                        } text-white py-0.5 px-3 cursor-pointer disabled:bg-slate-300 disabled:cursor-wait rounded-xl`}
                        disabled={loading}
                        onClick={() => setFormData({ ...formData, paymentMethod: "credit", paymentAccountID: 7 })}
                    >
                        Credit
                    </button>
                </div>
                {formData.paymentMethod === "cash" && (
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-900">Account Pembayaran</label>
                        <select
                            className="w-full border bg-white border-slate-200 px-4 py-2 rounded-xl mb-4 disabled:bg-slate-300 disabled:cursor-not-allowed"
                            value={formData.paymentAccountID}
                            onChange={(e) => setFormData({ ...formData, paymentAccountID: e.target.value })}
                            disabled={loading || formData.paymentMethod === "credit"}
                        >
                            <option value="">Pilih Account Pembayaran</option>
                            {accounts?.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.acc_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div>
                <h1 className="text-lg font-bold mb-4">Total: {formatNumber(totalPrice)}</h1>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer" disabled={loading} onClick={handlePayment}>
                {loading ? "Loading..." : "Bayar"}
            </button>
        </>
    );
};

export default CreatePaymentFrom;
