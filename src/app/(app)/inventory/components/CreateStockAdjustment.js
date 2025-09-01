import axios from "@/libs/axios";
import formatNumber from "@/libs/formatNumber";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const CreateStockAdjustment = ({ isModalOpen, product, warehouse, warehouses, notification, date, fetchWarehouseStock }) => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");

    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({
        product_id: product?.id,
        quantity: "",
        cost: "",
        description: "",
        date: today,
        warehouse_id: warehouse,
        adjustmentType: "in",
        account_id: "",
        is_initial: false,
    });

    const fetchAccountByIds = useCallback(
        async ({ account_ids }) => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/get-account-by-account-id`, { params: { account_ids } });
                setAccounts(response.data.data);
            } catch (error) {
                notification({
                    type: "error",
                    message: error.response?.data?.message || "Something went wrong.",
                });
            } finally {
                setLoading(false);
            }
        },
        [notification]
    );

    useEffect(() => {
        fetchAccountByIds({ account_ids: [1, 2, 19, 27, 28, 29, 30, 42, 43] });
    }, [fetchAccountByIds]);

    const accountsByType = formData.adjustmentType == "in" ? [27, 28, 29, 30] : [1, 2, 19, 42, 43];
    const filterAccountByType = accounts.filter((account) => accountsByType.includes(account.account_id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/stock-adjustment", formData);
            notification({
                type: "success",
                message: response.data.message,
            });
            isModalOpen(false);
            fetchWarehouseStock();
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
            notification({
                type: "error",
                message: error.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-sm font-bold mb-4">{product?.name}</h1>
            <div className="flex rounded-full bg-slate-300 p-0.5 w-fit mb-2 text-sm">
                <button
                    className={`px-3 py-0.5 rounded-full ${
                        formData.adjustmentType == "in" ? "bg-white text-green-500" : "text-slate-500"
                    } cursor-pointer w-32 flex items-center justify-center gap-2`}
                    onClick={() => setFormData({ ...formData, adjustmentType: "in" })}
                >
                    <PlusIcon size={20} /> Tambah
                </button>
                <button
                    className={`px-3 py-0.5 rounded-full ${
                        formData.adjustmentType == "out" ? "bg-white text-red-500" : "text-slate-500"
                    } cursor-pointer w-32 flex items-center justify-center gap-2`}
                    onClick={() => setFormData({ ...formData, adjustmentType: "out" })}
                >
                    <MinusIcon size={20} /> Kurang
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="text-sm" htmlFor="qty">
                        Tanggal
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-2">
                        <label className="text-sm" htmlFor="qty">
                            Quantity
                        </label>
                        <input
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="text-sm" htmlFor="cost">
                            Harga
                        </label>
                        <input
                            type="number"
                            value={formData.cost}
                            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="is_initial"
                        checked={formData.is_initial}
                        disabled={formData.adjustmentType == "out"}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                is_initial: e.target.checked,
                                account_id: e.target.checked ? 13 : "",
                            })
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_service" className="ml-2 text-sm font-medium text-gray-900">
                        Sesuaikan sebagai stok awal persediaan
                    </label>
                </div>
                <div className="mb-2">
                    <label className="text-sm" htmlFor="description">
                        Account Penyesuaian
                    </label>
                    <select
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200"
                        onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                        value={formData.account_id}
                        disabled={formData.is_initial}
                        required={!formData.is_initial}
                    >
                        <option value="">{formData.is_initial ? "Stok Awal Persediaan" : "Pilih Account Penyesuaian"}</option>
                        {filterAccountByType.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.acc_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="text-sm" htmlFor="description">
                        Gudang/Cabang
                    </label>
                    <select
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
                        value={formData.warehouse_id}
                        required
                    >
                        <option value="">Pilih Cabang</option>
                        {warehouses?.data?.map((w) => (
                            <option key={w.id} value={w.id}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="">
                    <label className="text-sm" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <h1 className="text-xs">
                    Stock: {formatNumber(product?.stock_movements_sum_quantity)} {" -> "}
                    <span className={formData.adjustmentType == "in" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                        {formatNumber(
                            Number(product?.stock_movements_sum_quantity) +
                                (formData.adjustmentType == "in" ? Number(formData.quantity) : Number(formData.quantity) * -1)
                        )}
                    </span>
                </h1>
                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary disabled:bg-slate-500" disabled={loading}>
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default CreateStockAdjustment;
