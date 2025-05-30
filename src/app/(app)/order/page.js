import Button from "@/components/Button";
import MainPage from "../main";
import { PlusIcon } from "lucide-react";

const Order = () => {
    return (
        <MainPage headerTitle="Order">
            <Button buttonType="primary" className={`flex item-center gap-2`}>
                <PlusIcon size={20} /> Add Order
            </Button>
        </MainPage>
    );
};

export default Order;
