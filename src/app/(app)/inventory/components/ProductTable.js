"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "@/libs/axios";
import formatNumber from "@/libs/formatNumber";
import Label from "@/components/Label";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { DownloadIcon, FilterIcon, MinusIcon, PencilRulerIcon, PlusIcon, RefreshCcwIcon, UndoIcon } from "lucide-react";
import Pagination from "@/components/PaginateList";
import Link from "next/link";
import exportToExcel from "@/libs/exportToExcel";
import formatDateTime from "@/libs/formatDateTime";
import CreateStockAdjustment from "./CreateStockAdjustment";
import CreateReversal from "./CreateReversal";

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const ProductTable = ({ warehouse, warehouses, warehouseName, notification }) => {
    const [search, setSearch] = useState("");
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [errors, setErrors] = useState([]); // Store validation errors
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalFilterDataOpen, setIsModalFilterDataOpen] = useState(false);
    const [isModalAdjustmentOpen, setIsModalAdjustmentOpen] = useState(false);
    const [isModalReversalOpen, setIsModalReversalOpen] = useState(false);
    const [warehouseStock, setWarehouseStock] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const closeModal = () => {
        setIsModalFilterDataOpen(false);
        setIsModalAdjustmentOpen(false);
        setIsModalReversalOpen(false);
    };

    const fetchWarehouseStock = useCallback(
        async (url = `/api/get-all-products-by-warehouse/${warehouse}/${endDate}`) => {
            setLoading(true);
            try {
                const response = await axios.get(url);
                setWarehouseStock(response.data.data);
            } catch (error) {
                notification("error", error.response?.data?.message || "Something went wrong.");
                console.log(error);
            } finally {
                setLoading(false);
            }
        },
        [endDate, notification, warehouse]
    );

    useEffect(() => {
        fetchWarehouseStock();
    }, [fetchWarehouseStock]);

    const filteredBySearch = warehouseStock.filter((item) => {
        return item.name?.toLowerCase().includes(search.toLowerCase());
    });

    const totalItems = filteredBySearch?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredBySearch.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const summarizeTotal = (warehouseStock) => {
        let total = 0;
        warehouseStock.forEach((item) => {
            total += item.current_cost * item.current_stock;
        });
        return total;
    };

    const exportStockToExcel = () => {
        const headers = [
            { key: "name", label: "Nama Barang" },
            { key: "stock_movements_sum_quantity", label: "Qty" },
            { key: "cost", label: "Harga" },
            { key: "total", label: "Total" },
        ];

        const data = [
            ...warehouseStock.map((item) => ({
                name: item.name,
                stock_movements_sum_quantity: formatNumber(item.stock_movements_sum_quantity),
                cost: formatNumber(item.current_cost),
                total: formatNumber(item.current_cost * item.stock_movements_sum_quantity),
            })),
            {
                name: "Total",
                stock_movements_sum_quantity: "",
                cost: "",
                total: formatNumber(summarizeTotal(warehouseStock)),
            },
        ];

        exportToExcel(
            data,
            headers,
            `Laporan Stok Gudang ${warehouseName} ${formatDateTime(new Date())}.xlsx`,
            `Laporan Stok Gudang ${warehouseName} ${formatDateTime(new Date())}`
        );
    };
    const findProduct = warehouseStock.find((item) => item.id === selectedProduct);
    return (
        <>
            <div className="bg-white rounded-3xl p-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-lg font-bold">Inventory: {warehouseName}</h1>
                        <span className="text-sm text-gray-500">
                            {endDate}, Total: {formatNumber(summarizeTotal(warehouseStock))}
                        </span>
                    </div>
                    <div>
                        <button
                            onClick={() => fetchWarehouseStock(`/api/get-all-products-by-warehouse/${warehouse}/${endDate}`)}
                            className="bg-white font-bold p-3 mr-1 rounded-lg border border-gray-300 hover:border-gray-400"
                        >
                            <RefreshCcwIcon className="size-4" />
                        </button>
                        <button onClick={exportStockToExcel} className="bg-white font-bold p-3 mr-1 rounded-lg border border-gray-300 hover:border-gray-400">
                            <DownloadIcon className="size-4" />
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
                            <Label className="font-bold">Pilih tanggal</Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <button onClick={() => fetchWarehouseStock(`/api/get-trx-all-product-by-warehouse/${warehouse}/${endDate}`)} className="btn-primary">
                            Submit
                        </button>
                    </Modal>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 mb-4">
                    <div className="flex items-center">
                        <input
                            type="search"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded-lg text-sm mr-1 border border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="rounded-lg border text-sm border-gray-300 p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="10">10</option>
                            <option value="20">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
                <table className="w-full table text-sm">
                    <thead>
                        <tr>
                            <th className="">Product Name</th>
                            <th className="">Quantity</th>
                            <th className="">Price</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?.map((item, index) => (
                            <tr key={index} className="text-xs">
                                <td className="text-start w-1/2">
                                    <Link className="hover:underline" href={`/setting/product/history/${item.id}`}>
                                        {item.code} - {item.name}
                                    </Link>
                                </td>
                                <td className="text-end">{formatNumber(item.current_stock)}</td>
                                <td className="text-end">{formatNumber(item.current_cost)}</td>
                                <td className="text-end font-semibold">{formatNumber(item.current_cost * item.current_stock)}</td>
                                <td className="flex justify-center gap-2">
                                    <button
                                        onClick={() => {
                                            setIsModalAdjustmentOpen(true);
                                            setSelectedProduct(item.id);
                                        }}
                                        className="cursor-pointer flex items-center gap-1 hover:underline text-cyan-600"
                                    >
                                        <PencilRulerIcon size={20} /> Stock Adjustment
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsModalReversalOpen(true);
                                            setSelectedProduct(item.id);
                                        }}
                                        className="cursor-pointer flex items-center gap-1 hover:underline text-red-600"
                                    >
                                        <UndoIcon size={20} /> Reversal
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="3" className="text-end font-bold">
                                Total
                            </th>
                            <th className="text-end font-bold">{formatNumber(summarizeTotal(warehouseStock))}</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
                {totalPages > 1 && (
                    <Pagination
                        className="w-full px-4"
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
            <Modal isOpen={isModalAdjustmentOpen} onClose={closeModal} modalTitle="Stock Adjustment" maxWidth="max-w-md">
                <CreateStockAdjustment
                    isModalOpen={setIsModalAdjustmentOpen}
                    product={findProduct}
                    warehouse={warehouse}
                    warehouses={warehouses}
                    notification={notification}
                    date={getCurrentDate()}
                    fetchWarehouseStock={fetchWarehouseStock}
                />
            </Modal>
            <Modal isOpen={isModalReversalOpen} onClose={closeModal} modalTitle="Reversal" maxWidth="max-w-md">
                <CreateReversal
                    isModalOpen={setIsModalReversalOpen}
                    product={findProduct}
                    warehouse={warehouse}
                    warehouses={warehouses}
                    notification={notification}
                    date={getCurrentDate()}
                    fetchWarehouseStock={fetchWarehouseStock}
                />
            </Modal>
        </>
    );
};

export default ProductTable;
