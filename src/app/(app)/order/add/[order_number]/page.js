"use client";
import ProductCard from "@/app/(app)/inventory/components/ProductCard";
import MainPage from "@/app/(app)/main";
import Modal from "@/components/Modal";
import Notification from "@/components/Notification";
import axios from "@/libs/axios";
import formatNumber from "@/libs/formatNumber";
import { BoxesIcon, LoaderCircleIcon, MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
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

const AddPartsReplacement = ({ params }) => {
    const { order_number } = use(params);
    const [notification, setNotification] = useState({
        type: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [isModalCheckOutOpen, setIsModalCheckOutOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [productList, setProductList] = useState([]);
    const debouncedSearch = useDebounce(search, 500); // Apply debounce with 500ms delay
    const [part, setPart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const closeModal = () => {
        setIsModalCheckOutOpen(false);
    };

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
        setPart((prevpart) => {
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
        setPart((prevpart) => {
            return prevpart.map((item) => (item.id === product.id ? { ...item, price: newPrice } : item));
        });
    };

    const handleIncrementQuantity = (product) => {
        setPart((prevpart) => {
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
        setPart((prevpart) => {
            return prevpart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item));
        });
    };

    // Calculate total price
    const calculateTotalPrice = useCallback(() => {
        return part.reduce((total, item) => total + item.price * item.quantity, 0);
        // return part.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [part]);

    const calculateTotalQuantity = useCallback(() => {
        return part.reduce((total, item) => total + item.quantity, 0);
    }, [part]);

    // Remove product from part
    const handleRemoveFromPart = (product) => {
        setPart((prevpart) => prevpart.filter((item) => item.id !== product.id));
    };

    // Handle clear part
    const handleClearPart = () => {
        setPart([]);
    };

    // Load part from localStorage on component mount
    useEffect(() => {
        const storedPart = JSON.parse(localStorage.getItem("part")) || [];
        setPart(storedPart);
    }, []);

    // Fetch product list when debounced search term changes
    useEffect(() => {
        fetchProduct();
    }, [debouncedSearch, fetchProduct]);

    // Save part to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("part", JSON.stringify(part));
        setTotalPrice(calculateTotalPrice());
    }, [part, calculateTotalPrice]);

    const handleCheckOut = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/add-parts-to-order", { order_number: order_number, parts: part, transaction_type: "Order" });
            setNotification({ type: "success", message: response.data.message });
            handleClearPart();
            setIsModalCheckOutOpen(false);
        } catch (error) {
            setNotification({ type: "error", message: error.response?.data?.message || "Something went wrong." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainPage
            headerTitle={
                <>
                    Serivce Order <span className="text-slate-400 font-normal">/ Sparepart & Biaya</span>
                </>
            }
        >
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
                            Order Summary <span className="text-xs text-slate-500 font-light block">{order_number}</span>
                        </h1>
                        <div className="max-h-[calc(49px*7)] overflow-y-scroll">
                            {part.length > 0 ? (
                                part.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center py-2 border-b border-slate-200 border-dashed hover:bg-slate-50"
                                    >
                                        <div className="flex gap-2 items-center">
                                            <div className="w-[30px] bg-slate-400 rounded-lg h-[30px] flex justify-center items-center">
                                                <BoxesIcon size={18} className="text-slate-50" />
                                            </div>
                                            <div>
                                                <h1 className="text-xs mb-1">{item.name.toUpperCase()}</h1>
                                                <div className="flex gap-4 items-center">
                                                    <div className="flex gap-2 items-center bg-slate-300 rounded-full px-0.5 w-fit">
                                                        <button
                                                            onClick={() => handleDecrementQuantity(item)}
                                                            className="text-slate-500 bg-white hover:text-slate-500 cursor-pointer rounded-full"
                                                        >
                                                            <MinusIcon size={15} className="" />
                                                        </button>
                                                        <h1 className="text-sm text-slate-700">{formatNumber(item.quantity)}</h1>
                                                        <button
                                                            onClick={() => handleIncrementQuantity(item)}
                                                            className="text-slate-500 bg-white hover:text-slate-500 cursor-pointer rounded-full"
                                                        >
                                                            <PlusIcon size={15} className="" />
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleUpdatePrice(item, e.target.value)}
                                                        className="text-xs p-0.5 rounded-sm text-right outline-1 outline-gray-200 focus:outline-orange-500/50 focus:outline-2 bg-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <button onClick={() => handleRemoveFromPart(item)} className="cursor-pointer hover:scale-110">
                                                <Trash2Icon size={18} className="text-red-400" />
                                            </button>
                                        </div>
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
                                disabled={part.length === 0}
                                className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Checkout
                            </button>
                            <button
                                onClick={() => handleClearPart()}
                                disabled={part.length === 0}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full py-2 px-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2Icon size={18} className="" />
                            </button>
                        </div>
                    </div>
                    <Modal isOpen={isModalCheckOutOpen} onClose={closeModal} maxWidth={"max-w-sm"} modalTitle="Checkout" bgColor="bg-white">
                        <div className="flex justify-center flex-col items-center gap-2 border-b border-gray-300 border-dashed py-2">
                            <h1 className="text-7xl text-green-500 font-bold">{calculateTotalQuantity()}</h1>
                            <span className="text-sm font-light">{calculateTotalQuantity() > 1 ? "Items" : "Item"}</span>
                        </div>
                        <div className="flex justify-between items-center my-4">
                            <h1 className="text-xl">Total</h1>
                            <h1 className="text-xl">Rp. {formatNumber(totalPrice)}</h1>
                        </div>
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

export default AddPartsReplacement;
