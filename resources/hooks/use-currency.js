import { toast } from "sonner";
import { router } from "@inertiajs/react";

export function useCurrency() {
    const makeApiCall = async (
        endpoint,
        data = null,
        successMessage = "Operation completed successfully"
    ) => {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
                ...(data && { body: JSON.stringify(data) }),
            });

            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message || successMessage);
                router.reload();
                return true;
            } else {
                if (responseData.errors) {
                    const errorMessages = Object.values(
                        responseData.errors
                    ).flat();
                    const errorList = errorMessages
                        .map((error) => `<li>${error}</li>`)
                        .join("");
                    toast.error(
                        `Validation Errors:\n${errorMessages.join('\n')}`
                    );
                } else {
                    toast.error(responseData.message || "Operation failed");
                }
                return false;
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Network error occurred");
            return false;
        }
    };

    const updateCurrencies = async () => {
        return await makeApiCall(
            route("currencies.update-rates"),
            null,
            "Exchange rates updated successfully"
        );
    };

    const createCurrency = async (currencyData) => {
        return await makeApiCall(
            route("currencies.handle"),
            {
                action: "create",
                ...currencyData,
            },
            "Currency created successfully"
        );
    };

    const updateCurrency = async (currencyData) => {
        return await makeApiCall(
            route("currencies.handle"),
            {
                action: "update",
                ...currencyData,
            },
            "Currency updated successfully"
        );
    };

    const deleteCurrency = async (currencyId) => {
        if (!confirm("Are you sure you want to delete this currency?")) {
            return false;
        }

        return await makeApiCall(
            route("currencies.handle"),
            {
                action: "delete",
                id: currencyId,
            },
            "Currency deleted successfully"
        );
    };

    const updateSingleRate = async (currencyId) => {
        return await makeApiCall(
            route("currencies.update-single-rate"),
            {
                currency_id: currencyId,
            },
            "Currency rate updated successfully"
        );
    };

    const setDefaultCurrency = async (currencyId) => {
        return await makeApiCall(
            route("currencies.set-default"),
            {
                currency_id: currencyId,
            },
            "Default currency set successfully"
        );
    };

    return {
        makeApiCall,
        updateCurrencies,
        createCurrency,
        updateCurrency,
        deleteCurrency,
        updateSingleRate,
        setDefaultCurrency,
    };
} 