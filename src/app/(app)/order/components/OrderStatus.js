import StatusBadge from "@/components/StatusBadge";

const OrderStatus = ({ orders }) => {
    const filterOrderByStatus = (status) => orders.data?.filter((order) => order.status === status).length;
    return (
        <div className="mb-4 flex gap-4 ">
            <div className="bg-white rounded-3xl px-4 py-2 w-full">
                <StatusBadge status="Pending" />
                <h1 className="text-2xl font-bold">{filterOrderByStatus("Pending")}</h1>
            </div>
            <div className="bg-white rounded-3xl px-4 py-2 w-full">
                <StatusBadge status="In Progress" />
                <h1 className="text-2xl font-bold">{filterOrderByStatus("In Progress")}</h1>
            </div>
            <div className="bg-white rounded-3xl px-4 py-2 w-full">
                <StatusBadge status="Finished" />
                <h1 className="text-2xl font-bold">{filterOrderByStatus("Finished")}</h1>
            </div>
            <div className="bg-white rounded-3xl px-4 py-2 w-full">
                <StatusBadge status="Completed" />
                <h1 className="text-2xl font-bold">{filterOrderByStatus("Completed")}</h1>
            </div>
            <div className="bg-white rounded-3xl px-4 py-2 w-full">
                <StatusBadge status="Cancelled" />
                <h1 className="text-2xl font-bold">{filterOrderByStatus("Cancelled")}</h1>
            </div>
            <div className="bg-white rounded-3xl px-4 py-2 w-full">
                <StatusBadge status="Rejected" />
                <h1 className="text-2xl font-bold">{filterOrderByStatus("Rejected")}</h1>
            </div>
        </div>
    );
};

export default OrderStatus;
