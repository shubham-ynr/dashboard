import HeaderCard from "@/components/header-card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";

export default function ProductManager() {
    const { stats } = usePage().props;
    const breadcrumbs = [
        { href: "/", label: "Admin Dashboard", hidden: true },
        { href: "/admin/products", label: "Product Management" },
    ];
    const cards = [
        { title: "Total Products", value:  0, icon: "Box" },
        { title: "Total Categories", value:  0, icon: "PackageOpen" },
        { title: "Active Products", value:  0, icon: "ShieldCheck", iconClass: "text-green-500 border-green-700" },
        { title: "Inactive Products", value:  0, icon: "ShieldX", iconClass: "text-red-500 border-red-700" },
    ];

    return (
        <Layout breadcrumb={breadcrumbs} >
            <div className="flex items-center justify-between mb-7">
                <h1 className="text-xl sm:text-2xl font-semibold meedori">
                    Product Management
                    <p className="text-sm text-muted-foreground montserrat">Manage products and inventory</p>
                </h1>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="text-sm group hover:bg-muted"
                        >
                            <Plus
                                size={20}
                                className="transition-transform duration-300 group-hover:rotate-90"
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Add new product</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <HeaderCard cards={cards} />
        </Layout>
    );
}