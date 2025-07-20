"use client";
import axios from "@/libs/axios";
import DateTimeNow from "@/libs/dateTimeNow";
import { useState } from "react";

const CreateOrder = ({ isModalOpen, notification, fetchOrders }) => {
    const { today, thisMonth, lastMonth, thisYear, lastYear, thisTime } = DateTimeNow();
    const [formData, setFormData] = useState({
        date_issued: today,
        name: "",
        description: "",
        phone_number: "",
        phone_type: "",
        address: "",
    });

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/orders", formData);
            notification("success", response.data.message);
            isModalOpen(false);
            fetchOrders();
        } catch (error) {
            notification("error", error.response?.data?.message || "Something went wrong.");
        }
    };
    return (
        <form onSubmit={handleCreateOrder}>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="mb-4">
                        <label>Tanggal</label>
                        <input
                            type="datetime-local"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.date_issued}
                            onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label>Nama</label>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label>No Telepon</label>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label>Alamat</label>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <div className="mb-4">
                        <label>Perangkat</label>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.phone_type}
                            onChange={(e) => setFormData({ ...formData, phone_type: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label>Deskripsi Kerusakan</label>
                        <textarea
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    className="text-slate-500 bg-white hover:outline hover:outline-gray-500  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    onClick={() => isModalOpen(false)}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default CreateOrder;
