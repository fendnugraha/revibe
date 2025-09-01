import Breadcrumb from "@/components/Breadcrumb";
import MainPage from "../main";
import OrderListTable from "./components/OrderListTable";

export const metadata = {
    title: "Revibe | Order Page",
};

const OrderPage = () => {
    return (
        <MainPage headerTitle="Order">
            <Breadcrumb
                BreadcrumbArray={[
                    { name: "Order", href: "/order" },
                    { name: "List Order", href: "/order" },
                ]}
            />
            <OrderListTable />
        </MainPage>
    );
};

export default OrderPage;
