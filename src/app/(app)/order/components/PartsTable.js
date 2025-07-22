import formatNumber from "@/libs/formatNumber";

const PartsTable = ({ parts, totalPrice }) => {
    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-sm table">
                    <thead>
                        <tr>
                            <th className="">Nama Part</th>
                            <th className="">Harga</th>
                            <th className=" w-16">Jumlah</th>
                            <th className="">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parts.length > 0 ? (
                            parts?.map((part, index) => (
                                <tr key={index}>
                                    <td className="">{part.product?.name}</td>
                                    <td className="text-right">{formatNumber(part.price)}</td>
                                    <td className="text-center">{formatNumber(-part.quantity)}</td>
                                    <td className="text-right">{formatNumber(part.price * -part.quantity)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    Tidak ada pergantian sparepart
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {parts.length > 0 && (
                        <tfoot>
                            <tr>
                                <th></th>
                                <th className="text-right" colSpan="2">
                                    Total
                                </th>
                                <th className="text-right">{formatNumber(totalPrice)}</th>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </>
    );
};

export default PartsTable;
