import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Layout from "../../components/Layout";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcwDot, MoreVertical, SquarePen, RefreshCcw, Trash, Check, X, Star } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrency } from "../../hooks/use-currency";

export default function CurrencyManager() {
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const { currencies } = usePage().props;
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        code: "",
        prefix: "",
        suffix: "",
        format: "1,234.56",
        rate: "1.0000",
        is_default: false,
    });
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newCurrency, setNewCurrency] = useState({
        code: "",
        prefix: "",
        suffix: "",
        format: "1,234.56",
        is_default: false,
    });

    const {
        updateCurrencies: updateCurrenciesApi,
        createCurrency,
        updateCurrency,
        deleteCurrency,
        updateSingleRate,
        setDefaultCurrency,
    } = useCurrency();

    const updateCurrencies = async () => {
        setLoading(true);
        const success = await updateCurrenciesApi();
        setLoading(false);
        return success;
    };

    const handleEdit = (currency) => {
        setEditId(currency.id);
        setEditData({
            id: currency.id,
            code: currency.code || "",
            prefix: currency.prefix || "",
            suffix: currency.suffix || "",
            format: currency.format || "1,234.56",
            rate: currency.rate || "1.0000",
            is_default: currency.is_default || false,
        });
        setIsAddingNew(false);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleNewCurrencyChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCurrency((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        setProcessing(true);
        const success = await updateCurrency(editData);
        if (success) setEditId(null);
        setProcessing(false);
    };

    const handleAddNew = () => {
        setIsAddingNew(true);
        setEditId(null);
        setNewCurrency({
            code: "",
            prefix: "",
            suffix: "",
            format: "1,234.56",
            is_default: false,
        });
    };

    const handleSaveNew = async () => {
        setProcessing(true);
        const success = await createCurrency(newCurrency);
        if (success) setIsAddingNew(false);
        setProcessing(false);
    };

    const handleCancelNew = () => {
        setIsAddingNew(false);
        setNewCurrency({
            code: "",
            prefix: "",
            suffix: "",
            format: "1,234.56",
            is_default: false,
        });
    };

    const handleDelete = async (currencyId) => {
        setProcessing(true);
        await deleteCurrency(currencyId);
        setProcessing(false);
    };

    const handleUpdateRate = async (currencyId) => {
        setProcessing(true);
        await updateSingleRate(currencyId);
        setProcessing(false);
    };

    const handleSetDefault = async (currencyId) => {
        setProcessing(true);
        await setDefaultCurrency(currencyId);
        setProcessing(false);
    };

    return (
        <Layout breadcrumb={[{ href: "/", label: "Dashboard" }]}>
            <div className="flex items-center justify-between mb-7">
            <h1 className="text-md sm:text-2xl font-semibold meedori">
                    Currency Management
                    <p className="text-xs sm:text-sm text-muted-foreground montserrat">
                        Manage currencies and exchange rates
                    </p>
                </h1>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="text-sm group hover:bg-muted"
                            onClick={handleAddNew}
                            disabled={
                                isAddingNew || editId !== null || processing
                            }
                        >
                            <Plus
                                size={20}
                                className="transition-transform duration-300 group-hover:rotate-90"
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Add new Currency</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex items-center justify-end mb-4 py-2">
                <Button
                    variant="outline"
                    className="text-sm rounded-xs"
                    onClick={updateCurrencies}
                    disabled={loading}
                >
                    <RefreshCcwDot
                        className={`${loading ? "animate-spin" : ""}`}
                    />{" "}
                    Update Exchange Rates
                </Button>
            </div>
            <Table className="border-b">
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead className="min-w-[40px] max-w-[60px]">
                            ID
                        </TableHead>
                        <TableHead className="min-w-[100px] max-w-[120px]">
                            Currency Code
                        </TableHead>
                        <TableHead className="min-w-[60px] max-w-[80px]">
                            Prefix
                        </TableHead>
                        <TableHead className="min-w-[60px] max-w-[80px]">
                            Suffix
                        </TableHead>
                        <TableHead className="min-w-[100px] max-w-[120px]">
                            Format
                        </TableHead>
                        <TableHead className="min-w-[80px] max-w-[100px]">
                            Base Rate
                        </TableHead>
                        <TableHead className="min-w-[60px] max-w-[80px]">
                            Default
                        </TableHead>
                        <TableHead className="min-w-[80px] max-w-[120px]">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currencies.map((currency) => (
                        <TableRow
                            key={currency.id}
                            className="cursor-pointer border-b"
                        >
                            {editId === currency.id ? (
                                <>
                                    <TableCell className="pl-3 min-w-[40px] max-w-[60px]">
                                        {currency.id}
                                    </TableCell>
                                    <TableCell className="min-w-[100px] max-w-[120px]">
                                        <Input
                                            type="text"
                                            name="code"
                                            value={editData.code || ""}
                                            onChange={handleEditChange}
                                            className="w-full rounded-xs text-xs"
                                        />
                                    </TableCell>
                                    <TableCell className="min-w-[60px] max-w-[80px]">
                                        <Input
                                            type="text"
                                            name="prefix"
                                            value={editData.prefix || ""}
                                            onChange={handleEditChange}
                                            className="w-full rounded-xs text-xs"
                                        />
                                    </TableCell>
                                    <TableCell className="min-w-[60px] max-w-[80px]">
                                        <Input
                                            type="text"
                                            name="suffix"
                                            value={editData.suffix || ""}
                                            onChange={handleEditChange}
                                            className="w-full rounded-xs text-xs"
                                        />
                                    </TableCell>
                                    <TableCell className="min-w-[100px] max-w-[120px]">
                                        <Select
                                            name="format"
                                            value={
                                                editData.format || "1,234.56"
                                            }
                                            onValueChange={(value) =>
                                                handleEditChange({
                                                    target: {
                                                        name: "format",
                                                        value,
                                                    },
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full rounded-xs text-xs">
                                                <SelectValue placeholder="Select format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[
                                                    {
                                                        value: "1,234.56",
                                                        label: "1,234.56",
                                                    },
                                                    {
                                                        value: "1.234,56",
                                                        label: "1.234,56",
                                                    },
                                                    {
                                                        value: "1 234.56",
                                                        label: "1 234.56",
                                                    },
                                                    {
                                                        value: "1 234,56",
                                                        label: "1 234,56",
                                                    },
                                                ].map((format) => (
                                                    <SelectItem
                                                        key={format.value}
                                                        value={format.value}
                                                    >
                                                        {format.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="min-w-[80px] max-w-[100px]">
                                        <Input
                                            type="number"
                                            name="rate"
                                            step="0.0001"
                                            value={editData.rate || ""}
                                            onChange={handleEditChange}
                                            className="w-full rounded-xs text-xs"
                                        />
                                    </TableCell>
                                    <TableCell className="min-w-[60px] max-w-[80px]">
                                        <Checkbox
                                            type="checkbox"
                                            name="is_default"
                                            checked={
                                                editData.is_default || false
                                            }
                                            onChange={handleEditChange}
                                            className="rounded-xs"
                                        />
                                    </TableCell>

                                    <TableCell className="min-w-[80px] max-w-[120px]">
                                        <div className="flex gap-1">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={handleSave}
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <RefreshCcw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setEditId(null)}
                                                disabled={processing}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell className="pl-3 min-w-[40px] max-w-[60px]">
                                        {currency.id}
                                    </TableCell>
                                    <TableCell className="min-w-[100px] max-w-[120px]">
                                        {currency.code}
                                    </TableCell>
                                    <TableCell className="min-w-[60px] max-w-[80px]">
                                        {currency.prefix}
                                    </TableCell>
                                    <TableCell className="min-w-[60px] max-w-[80px]">
                                        {currency.suffix}
                                    </TableCell>
                                    <TableCell className="min-w-[100px] max-w-[120px]">
                                        {currency.format}
                                    </TableCell>
                                    <TableCell className="min-w-[80px] max-w-[100px]">
                                        {currency.rate}
                                    </TableCell>
                                    <TableCell className="min-w-[60px] max-w-[80px]">
                                        {currency.is_default ? (
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-700"></span>
                                            </span>
                                        ) : (
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700"></span>
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="min-w-[80px] max-w-[120px]">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="text-sm"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-32 space-y-1 rounded-xs py-1"
                                            >
                                                <DropdownMenuItem
                                                    className="text-xs rounded-xs"
                                                    onClick={() =>
                                                        handleEdit(currency)
                                                    }
                                                    disabled={processing}
                                                >
                                                    <SquarePen /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-xs rounded-xs"
                                                    disabled={
                                                        currency.is_default ||
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        handleUpdateRate(
                                                            currency.id
                                                        )
                                                    }
                                                >
                                                    <RefreshCcw /> Update Rate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-xs rounded-xs"
                                                    disabled={
                                                        currency.is_default ||
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        handleSetDefault(
                                                            currency.id
                                                        )
                                                    }
                                                >
                                                    <Star /> Set Default
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-xs rounded-xs text-red-600 hover:!text-red-600"
                                                    disabled={
                                                        currency.is_default ||
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            currency.id
                                                        )
                                                    }
                                                >
                                                    <Trash /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                    {isAddingNew && (
                        <TableRow className="cursor-pointer border-b bg-muted/30">
                            <TableCell className="pl-3 min-w-[40px] max-w-[60px]">
                                <span className="text-muted-foreground text-xs">
                                    NEW
                                </span>
                            </TableCell>
                            <TableCell className="min-w-[100px] max-w-[120px]">
                                <Input
                                    type="text"
                                    name="code"
                                    value={newCurrency.code || ""}
                                    onChange={handleNewCurrencyChange}
                                    className="w-full rounded-xs text-xs"
                                    placeholder="USD"
                                />
                            </TableCell>
                            <TableCell className="min-w-[60px] max-w-[80px]">
                                <Input
                                    type="text"
                                    name="prefix"
                                    value={newCurrency.prefix || ""}
                                    onChange={handleNewCurrencyChange}
                                    className="w-full rounded-xs text-xs"
                                    placeholder="$"
                                />
                            </TableCell>
                            <TableCell className="min-w-[60px] max-w-[80px]">
                                <Input
                                    type="text"
                                    name="suffix"
                                    value={newCurrency.suffix || ""}
                                    onChange={handleNewCurrencyChange}
                                    className="w-full rounded-xs text-xs"
                                    placeholder=""
                                />
                            </TableCell>
                            <TableCell className="min-w-[100px] max-w-[120px]">
                                <Select
                                    name="format"
                                    value={newCurrency.format || "1,234.56"}
                                    onValueChange={(value) =>
                                        handleNewCurrencyChange({
                                            target: {
                                                name: "format",
                                                value,
                                            },
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full rounded-xs text-xs">
                                        <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            {
                                                value: "1,234.56",
                                                label: "1,234.56",
                                            },
                                            {
                                                value: "1.234,56",
                                                label: "1.234,56",
                                            },
                                            {
                                                value: "1 234.56",
                                                label: "1 234.56",
                                            },
                                            {
                                                value: "1 234,56",
                                                label: "1 234,56",
                                            },
                                        ].map((format) => (
                                            <SelectItem
                                                key={format.value}
                                                value={format.value}
                                            >
                                                {format.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="min-w-[80px] max-w-[100px]">
                                <span className="text-xs text-muted-foreground">
                                    Auto-fetched
                                </span>
                            </TableCell>
                            <TableCell className="min-w-[60px] max-w-[80px]">
                                <Checkbox
                                    type="checkbox"
                                    name="is_default"
                                    checked={newCurrency.is_default || false}
                                    onChange={handleNewCurrencyChange}
                                    className="rounded-xs"
                                />
                            </TableCell>
                            <TableCell className="min-w-[80px] max-w-[120px]">
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleSaveNew}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <RefreshCcw className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCancelNew}
                                        disabled={processing}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="h-[200dvh]">

            </div>
        </Layout>
    );
}
