"use client";
import ProductCard from "@/app/(app)/inventory/components/ProductCard";
import MainPage from "@/app/(app)/main";
import Modal from "@/components/Modal";
import Notification from "@/components/Notification";
import axios from "@/libs/axios";
import DateTimeNow from "@/libs/dateTimeNow";
import formatNumber from "@/libs/formatNumber";
import { set } from "date-fns";
import { BoxesIcon, CheckCircle, LoaderCircleIcon, MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler); // Clean up on component unmount or when value changes
        };
    }, [value, delay]);

    return debouncedValue;
};

const PurchaseOrder = () => {
    const [notification, setNotification] = useState({
        type: "",
        message: "",
    });
    const { today } = DateTimeNow();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalCheckOutOpen, setIsModalCheckOutOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [productList, setProductList] = useState([]);
    const debouncedSearch = useDebounce(search, 500); // Apply debounce with 500ms delay
    const [cartPo, setCartPo] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const closeModal = () => {
        setIsModalCheckOutOpen(false);
    };

    const fetchContact = useCallback(async () => {
        try {
            const response = await axios.get("/api/contacts");
            setContacts(response.data.data);
        } catch (error) {
            console.log("Error fetching contacts:", error);
        }
    }, []);

    useEffect(() => {
        fetchContact();
    }, [fetchContact]);

    // Fetch product list based on debounced search term
    const fetchProduct = useCallback(async () => {
        if (debouncedSearch.length > 3) {
            setLoading(true);
            try {
                const response = await axios.get("/api/products", {
                    params: { search: debouncedSearch },
                });
                setProductList(response.data.data);
            } catch (error) {
                console.log("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setProductList([]); // Clear product list if search is too short
        }
    }, [debouncedSearch]);

    // Add product to part
    const handleAddToCart = (product) => {
        setCartPo((prevpart) => {
            const existingProduct = prevpart.find((item) => item.id === product.id);
            if (existingProduct) {
                // If product is already in the part, increase its quantity
                return prevpart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
            // Otherwise, add the product to the part with quantity 1
            return [...prevpart, { ...product, quantity: 1 }];
        });

        setNotification({
            type: "success",
            message: "Product added to cart",
        });
    };

    const handleUpdatePrice = (product, newPrice) => {
        setCartPo((prevpart) => {
            return prevpart.map((item) => (item.id === product.id ? { ...item, price: newPrice } : item));
        });
    };

    const handleIncrementQuantity = (product) => {
        setCartPo((prevpart) => {
            return prevpart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        });
    };

    // Subtract quantity by 1
    const handleDecrementQuantity = (product) => {
        //if quantity is 1, remove product from part
        if (product.quantity === 1) {
            handleRemoveFromPart(product);
            return;
        }
        setCartPo((prevpart) => {
            return prevpart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item));
        });
    };

    // Calculate total price
    const calculateTotalPrice = useCallback(() => {
        return cartPo.reduce((total, item) => total + item.price * item.quantity, 0);
        // return cartPo.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartPo]);

    const calculateTotalQuantity = useCallback(() => {
        return cartPo.reduce((total, item) => total + item.quantity, 0);
    }, [cartPo]);

    // Remove product from part
    const handleRemoveFromPart = (product) => {
        setCartPo((prevpart) => prevpart.filter((item) => item.id !== product.id));
    };

    // Handle clear part
    const handleClearPart = () => {
        setCartPo([]);
    };

    // Load part from localStorage on component mount
    useEffect(() => {
        const storedPart = JSON.parse(localStorage.getItem("part")) || [];
        setCartPo(storedPart);
    }, []);

    // Fetch product list when debounced search term changes
    useEffect(() => {
        fetchProduct();
    }, [debouncedSearch, fetchProduct]);

    // Save part to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cartPo", JSON.stringify(cartPo));
        setTotalPrice(calculateTotalPrice());
    }, [cartPo, calculateTotalPrice]);

    const fetchAccountByIds = useCallback(async ({ account_ids }) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/get-account-by-account-id`, { params: { account_ids } });
            setAccounts(response.data.data);
        } catch (error) {
            setNotification("error", error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccountByIds({ account_ids: [1, 2] });
    }, [fetchAccountByIds]);

    const [formData, setFormData] = useState({
        date_issued: today,
        paymentMethod: "cash",
        paymentAccountID: "",
        discount: 0,
        shipping_cost: 0,
        contact_id: 1,
    });
    console.log(cartPo);

    const handleCheckOut = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/purchase-order", { ...formData, cart: cartPo });
            setNotification({ type: "success", message: response.data.message });
            handleClearPart();
            setFormData({
                date_issued: today,
                paymentMethod: "cash",
                paymentAccountID: "",
                discount: 0,
                shipping_cost: 0,
            });
            setIsModalCheckOutOpen(false);
        } catch (error) {
            setNotification({ type: "error", message: error.response?.data?.message || "Something went wrong." });
        } finally {
            setLoading(false);
        }
    };
    return (
        <MainPage headerTitle={"Purchase Order"}>
            {notification.message && (
                <Notification type={notification.type} notification={notification.message} onClose={() => setNotification({ type: "", message: "" })} />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-[calc(100vh-140px)] p-4">
                <div className="sm:col-span-2">
                    <div>
                        <div className="flex items-center">
                            <input
                                type="search"
                                className="bg-gray-50 text-gray-900 text-sm rounded-full outline-1 outline-gray-300 focus:outline-orange-500/50 focus:outline-2 block w-full px-4 py-2.5"
                                placeholder="Cari Barang"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 max-h-[calc((78px+4px)*5))] overflow-y-scroll">
                                {productList?.data?.map((product) => (
                                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-3xl px-6 py-4 hidden sm:flex flex-col justify-between">
                    <div>
                        <h1 className="text-lg font-bold mb-4">
                            Cart ({cartPo.length} {cartPo.length > 1 ? "products" : "product"})
                        </h1>
                        <div className="max-h-[calc(49px*7)] overflow-y-scroll">
                            {cartPo.length > 0 ? (
                                cartPo.map((item) => (
                                    <div key={item.id} className="p-2 rounded-2xl border border-slate-200 mb-2 flex items-center gap-3">
                                        <div className="size-[50px] flex-shrink-0 bg-slate-300 rounded-lg flex justify-center items-center">
                                            <BoxesIcon size={18} className="text-slate-500" />
                                        </div>
                                        <div className="flex flex-col justify-between h-[50px] w-full">
                                            <h1 className="text-xs font-bold truncate">{item.name?.toUpperCase()}</h1>
                                            <div className="flex gap-4 w-full items-center">
                                                <div className="flex items-center justify-between w-[72px]">
                                                    <button>
                                                        <PlusIcon size={18} className="text-green-500" onClick={() => handleIncrementQuantity(item)} />
                                                    </button>
                                                    <span className="mx-2 text-sm">{item.quantity}</span>
                                                    <button>
                                                        <MinusIcon size={18} className="text-red-500" onClick={() => handleDecrementQuantity(item)} />
                                                    </button>
                                                </div>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="100"
                                                    className=" bg-gray-50 text-xs text-end text-gray-900 w-36 rounded-full outline-1 outline-gray-300 focus:outline-orange-500/50 focus:outline-2 block px-4 py-1"
                                                    value={item.price}
                                                    onChange={(e) => handleUpdatePrice(item, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <button className="ml-auto self-start" onClick={() => handleRemoveFromPart(item)}>
                                            <Trash2Icon size={18} className="text-red-500" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center items-center h-full">
                                    <h1 className="text-lg">Cart is empty</h1>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between">
                            <h1 className="text-sm">Quantity</h1>
                            <h1 className="text-sm font-bold">
                                {formatNumber(calculateTotalQuantity())}{" "}
                                <span className="text-xs font-light">{calculateTotalQuantity() > 1 ? "Items" : "Item"}</span>
                            </h1>
                        </div>
                        <div className="flex justify-between">
                            <h1 className="text-sm font-bold">Total</h1>
                            <h1 className="text-sm font-bold">
                                <span className="text-xs font-light">Rp</span> {formatNumber(totalPrice)}
                            </h1>
                        </div>
                        <div className="flex justify-between gap-2 mt-2">
                            <button
                                onClick={() => setIsModalCheckOutOpen(true)}
                                disabled={cartPo.length === 0}
                                className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Checkout
                            </button>
                            <button
                                onClick={() => handleClearPart()}
                                disabled={cartPo.length === 0}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full py-2 px-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2Icon size={18} className="" />
                            </button>
                        </div>
                    </div>
                    <Modal isOpen={isModalCheckOutOpen} onClose={closeModal} maxWidth={"max-w-xl"} modalTitle="Checkout" bgColor="bg-white">
                        <div>
                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-900">Tanggal</label>
                                <input
                                    type="datetime-local"
                                    className="w-full border bg-white border-slate-200 px-4 py-2 rounded-xl"
                                    value={formData.date_issued}
                                    onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-900">Discount (Rp)</label>
                                <input
                                    type="number"
                                    className="w-full border bg-white border-slate-200 px-4 py-2 rounded-xl"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-900">Biaya Pengiriman (Rp)</label>
                                <input
                                    type="number"
                                    className="w-full border bg-white border-slate-200 px-4 py-2 rounded-xl"
                                    value={formData.shipping_cost}
                                    onChange={(e) => setFormData({ ...formData, shipping_cost: e.target.value })}
                                />
                            </div>
                            <div className="flex bg-indigo-400 w-fit rounded-xl mb-2">
                                <button
                                    className={`${
                                        formData.paymentMethod === "cash" ? "bg-indigo-600 text-white" : "text-white/50"
                                    } py-0.5 px-3 cursor-pointer disabled:cursor-wait rounded-xl`}
                                    disabled={loading}
                                    onClick={() => setFormData({ ...formData, paymentMethod: "cash", paymentAccountID: "" })}
                                >
                                    Cash
                                </button>
                                <button
                                    className={`${
                                        formData.paymentMethod === "credit" ? "bg-indigo-600 text-white" : "text-white/50"
                                    } text-white py-0.5 px-3 cursor-pointer disabled:cursor-wait rounded-xl`}
                                    disabled={loading}
                                    onClick={() => setFormData({ ...formData, paymentMethod: "credit", paymentAccountID: 7 })}
                                >
                                    Credit
                                </button>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-900">Account Pembayaran</label>
                                <select
                                    className="w-full border bg-white border-slate-200 px-4 py-2 rounded-xl mb-4 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                    value={formData.paymentAccountID}
                                    onChange={(e) => setFormData({ ...formData, paymentAccountID: e.target.value })}
                                    disabled={loading || formData.paymentMethod === "credit"}
                                    required
                                >
                                    <option value="">Pilih Account Pembayaran</option>
                                    {accounts?.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.acc_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-900">Supplier</label>
                                <select
                                    className="w-full border bg-white border-slate-200 px-4 py-2 rounded-xl mb-4 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                    value={formData.contact_id}
                                    onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                                    disabled={loading}
                                    required
                                >
                                    <option value="">Pilih Supplier</option>
                                    {contacts?.data?.map((contact) => (
                                        <option key={contact.id} value={contact.id}>
                                            {contact.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <table className="w-full text-xs">
                            <tbody>
                                <tr>
                                    <td className="font-semibold p-1">Total</td>
                                    <td className="text-right p-1">Rp {formatNumber(totalPrice)}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold p-1">Discount</td>
                                    <td className="text-right p-1 text-red-500">Rp {formatNumber(formData.discount)}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold p-1">Biaya Pengiriman</td>
                                    <td className="text-right p-1">Rp {formatNumber(formData.shipping_cost)}</td>
                                </tr>
                                <tr className="border-t border-slate-500 border-dashed">
                                    <td className="font-semibold p-1">Total Pembayaran</td>
                                    <td className="text-right p-1">Rp {formatNumber(totalPrice - formData.discount + Number(formData.shipping_cost))}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button
                            onClick={handleCheckOut}
                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 disabled:bg-slate-300 disabled:cursor-wait rounded-full"
                            disabled={loading}
                        >
                            {loading ? <LoaderCircleIcon className="animate-spin" /> : "Simpan"}
                        </button>
                    </Modal>
                </div>
            </div>
        </MainPage>
    );
};

export default PurchaseOrder;
