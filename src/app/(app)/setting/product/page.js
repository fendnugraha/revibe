"use client";
import Button from "@/components/Button";
import MainPage from "../../main";
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import Input from "@/components/Input";
import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import CreateProduct from "./CreateProduct";
import CreateCategoryProduct from "./CreateCategoryProduct";

const Product = () => {
    const [product, setProduct] = useState(null);
    const [productCategories, setProductCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [notification, setNotification] = useState("");
    const [errors, setErrors] = useState([]); // Store validation errors

    const [isModalCreateProductOpen, setIsModalCreateProductOpen] = useState(false);
    const [isModalCreateCategoryProductOpen, setIsModalCreateCategoryProductOpen] = useState(false);
    const [isModalUpdateProductOpen, setIsModalUpdateProductOpen] = useState(false);
    const [isModalDeleteProductOpen, setIsModalDeleteProductOpen] = useState(false);

    const closeModal = () => {
        setIsModalCreateProductOpen(false);
        setIsModalCreateCategoryProductOpen(false);
        setIsModalUpdateProductOpen(false);
        setIsModalDeleteProductOpen(false);
        // setIsModalUpdateAccountOpen(false)
    };

    const fetchProducts = useCallback(
        async (url = "/api/products") => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    params: {
                        search: search,
                    },
                });
                setProduct(response.data.data);
            } catch (error) {
                setErrors(error.response?.data?.errors || ["Something went wrong."]);
            } finally {
                setLoading(false);
            }
        },
        [search]
    );

    useEffect(() => {
        fetchProducts("/api/products");
    }, [fetchProducts]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchProducts("/api/products");
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, fetchProducts]);

    const fetchProductCategories = async () => {
        try {
            const response = await axios.get("api/product-categories");
            setProductCategories(response.data.data);
        } catch (error) {
            setErrors(error.response?.message || ["Something went wrong."]);
        }
    };

    useEffect(() => {
        fetchProductCategories();
    }, [product]);

    const handleChangePage = (url) => {
        fetchProducts(url);
    };

    return (
        <MainPage headerTitle="Product">
            <div className="p-8">
                <div className="flex gap-2 my-4">
                    <Button buttonType="primary" onClick={() => setIsModalCreateProductOpen(true)} className={`flex item-center gap-2`}>
                        <PlusIcon size={20} /> Add Product
                    </Button>
                    <Button buttonType="primary" onClick={() => setIsModalCreateCategoryProductOpen(true)} className={`flex item-center gap-2`}>
                        <PlusIcon size={20} /> Add Category
                    </Button>

                    <Modal isOpen={isModalCreateProductOpen} onClose={closeModal} modalTitle="Create account">
                        <CreateProduct
                            isModalOpen={setIsModalCreateProductOpen}
                            notification={(message) => setNotification(message)}
                            fetchProducts={fetchProducts}
                            productCategories={productCategories}
                        />
                    </Modal>
                    <Modal isOpen={isModalCreateCategoryProductOpen} onClose={closeModal} modalTitle="Create account">
                        <CreateCategoryProduct
                            isModalOpen={setIsModalCreateCategoryProductOpen}
                            notification={(message) => setNotification(message)}
                            fetchProducts={fetchProducts}
                        />
                    </Modal>
                </div>
                <div className="relative w-full sm:max-w-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="block w-full text-sm mb-2 pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 bg-white rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        autoComplete="off"
                    />
                </div>
                <div className="overflow-x-auto bg-white rounded-2xl">
                    <table className="table w-full text-xs">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>Product</th>
                                <th>Price (Jual)</th>
                                <th>Cost (Beli)</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan="6">No products found</td>
                                </tr>
                            ) : (
                                product?.data?.map((product) => (
                                    <tr key={product.id}>
                                        <td className="text-center">
                                            <Input
                                                checked={selectedProduct.includes(product.id)}
                                                onChange={() => {
                                                    handleSelectProduct(product.id);
                                                }}
                                                type="checkbox"
                                            />
                                        </td>
                                        <td>
                                            {product.name}
                                            <span className="block text-xs text-slate-400">
                                                {product.category} {formatNumber(product.sold)} terjual
                                            </span>
                                        </td>
                                        <td>{formatNumber(product.price)}</td>
                                        <td>{formatNumber(product.cost)}</td>
                                        <td className="">
                                            <span className="flex justify-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProductId(product.id);
                                                        setIsModalUpdateProductOpen(true);
                                                    }}
                                                    className="bg-indigo-500 py-2 px-4 rounded-lg text-white mr-2"
                                                >
                                                    <PencilIcon className="size-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProductId(product.id);
                                                        setIsModalDeleteProductOpen(true);
                                                    }}
                                                    className="bg-red-600 py-2 px-4 rounded-lg text-white"
                                                >
                                                    <TrashIcon className="size-4" />
                                                </button>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainPage>
    );
};

export default Product;
