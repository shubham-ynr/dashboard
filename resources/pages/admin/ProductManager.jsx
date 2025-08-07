import HeaderCard from "@/components/header-card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from "react";

// Sortable table row component
function SortableTableRow({ children, id, className, ...props }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={cn(
                'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
                isDragging && 'opacity-50 bg-muted/80 shadow-lg scale-105',
                className
            )}
            {...props}
        >
            {children}
        </TableRow>
    );
}

// Drag handle component
function DragHandle({ id }) {
    const {
        attributes,
        listeners,
    } = useSortable({ id });

    return (
        <div
            {...attributes}
            {...listeners}
            className="inline-flex items-center justify-center w-6 h-6 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded"
        >
            <GripVertical size={16} />
        </div>
    );
}

export default function ProductManager() {
    const { stats } = usePage().props;
    const breadcrumbs = [
        { href: "/", label: "Admin Dashboard", hidden: true },
        { href: "/admin/products", label: "Product Management" },
    ];
    const cards = [
        { title: "Total Products", value: 0, icon: "Box" },
        { title: "Total Categories", value: 0, icon: "PackageOpen" },
        {
            title: "Active Products",
            value: 0,
            icon: "ShieldCheck",
            iconClass: "text-green-500 border-green-700",
        },
        {
            title: "Inactive Products",
            value: 0,
            icon: "ShieldX",
            iconClass: "text-red-500 border-red-700",
        },
    ];

    const [productGroups, setProductGroups] = useState([
        {
            name: "WHMCS Module",
            products: [
                {
                    id: 1,
                    name: "PhonePe WHMCS Module",
                    type: "Other (License Software)",
                    payType: "Recurring",
                    stock: 974,
                    autoSetup: "After First Payment",
                },
                {
                    id: 2,
                    name: "PayU WHMCS Module",
                    type: "Other (License Software)",
                    payType: "Recurring",
                    stock: 986,
                    autoSetup: "After First Payment",
                },
            ],
        },
        {
            name: "Shared Licenses (Hidden)",
            products: [
                {
                    id: 3,
                    name: "Shared cPanel License for VPS",
                    type: "Other (Rc License)",
                    payType: "Recurring",
                    stock: 1000,
                    autoSetup: "After First Payment",
                },
                {
                    id: 4,
                    name: "Shared cPanel License for DED",
                    type: "Other (Rc License)",
                    payType: "Recurring",
                    stock: 1000,
                    autoSetup: "After First Payment",
                },
                {
                    id: 5,
                    name: "Shared Plesk License for VPS",
                    type: "Other (Rc License)",
                    payType: "Recurring",
                    stock: 1000,
                    autoSetup: "After First Payment",
                },
                {
                    id: 6,
                    name: "Shared Plesk License for DED",
                    type: "Other (Rc License)",
                    payType: "Recurring",
                    stock: 1000,
                    autoSetup: "After First Payment",
                },
                {
                    id: 7,
                    name: "Shared LiteSpeed License (Up-to X-Core)",
                    type: "Other (Rc License)",
                    payType: "Recurring",
                    stock: 1000,
                    autoSetup: "After First Payment",
                },
                {
                    id: 8,
                    name: "Shared CloudLinux License",
                    type: "Other (Rc License)",
                    payType: "Recurring",
                    stock: 1000,
                    autoSetup: "After First Payment",
                },
            ],
        },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleProductSort = (groupIndex, event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = productGroups[groupIndex].products.findIndex(item => item.id === active.id);
            const newIndex = productGroups[groupIndex].products.findIndex(item => item.id === over.id);
            
            const newGroups = [...productGroups];
            newGroups[groupIndex].products = arrayMove(
                newGroups[groupIndex].products, 
                oldIndex, 
                newIndex
            );
            setProductGroups(newGroups);
        }
    };

    return (
        <Layout breadcrumb={breadcrumbs}>
            <div className="flex items-center justify-between mb-7">
                <h1 className="text-xl sm:text-2xl font-semibold meedori">
                    Product Management
                    <p className="text-sm text-muted-foreground montserrat">
                        Manage products and inventory
                    </p>
                </h1>
            </div>
            <HeaderCard cards={cards} />
            <div className="flex sm:justify-end items-center justify-center py-2">
                <div className="group">
                    <Button
                        variant="outline"
                        className="rounded-sm rounded-r-none text-xs"
                    >
                        <Plus
                            size={15}
                            className="transition-transform duration-300 group-hover:rotate-90"
                        />
                        Add Product
                    </Button>
                </div>

                <div className="group">
                    <Button
                        variant="outline"
                        className="rounded-sm rounded-l-none text-xs"
                    >
                        <Plus
                            size={15}
                            className="transition-transform duration-300 group-hover:rotate-90"
                        />
                        Add Category
                    </Button>
                </div>
            </div>

            <div className="flex justify-end mb-4">
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                        // Here you would typically send the sorted data to your backend
                        console.log('Saving sort order:', productGroups);
                        // You can add a toast notification here
                        alert('Sort order saved successfully!');
                    }}
                    className="text-xs"
                >
                    Save Sort Order
                </Button>
            </div>
            <div className="flex flex-col border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-sidebar">
                            <TableHead className="w-16"></TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Pay Type</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Auto Setup</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productGroups.map((group, groupIndex) => (
                            <>
                                <TableRow key={`group-${groupIndex}`}>
                                    <TableCell colSpan={6} className="font-semibold bg-accent">
                                        ◆ Group Name: {group.name}
                                    </TableCell>
                                </TableRow>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={(event) => handleProductSort(groupIndex, event)}
                                >
                                    <SortableContext 
                                        items={group.products.map(p => p.id)} 
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {group.products.map((product, productIndex) => (
                                            <SortableTableRow 
                                                key={product.id} 
                                                id={product.id}
                                                className={productIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                                            >
                                                <TableCell className="w-16">
                                                    <DragHandle id={product.id} />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">
                                                            #{productIndex + 1}
                                                        </span>
                                                        {product.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{product.type}</TableCell>
                                                <TableCell>{product.payType}</TableCell>
                                                <TableCell>{product.stock}</TableCell>
                                                <TableCell>{product.autoSetup}</TableCell>
                                            </SortableTableRow>
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
}
