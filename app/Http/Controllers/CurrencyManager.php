<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Currency;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CurrencyManager extends Controller
{
    private function apiResponse(bool $success, string $message, $data = null, int $status = 200): JsonResponse
    {
        $response = [
            'success' => $success,
            'message' => $message
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $status);
    }

    public function handleCurrency(Request $request): JsonResponse
    {
        $action = $request->input('action');

        switch ($action) {
            case 'create':
                return $this->createCurrency($request);
            case 'update':
                return $this->updateCurrency($request);
            case 'delete':
                return $this->deleteCurrency($request);
            case 'updateRates':
                return $this->updateExchangeRates($request);
            default:
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid action specified'
                ], 400);
        }
    }

    public function createCurrency(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:3|unique:currencies,code',
            'prefix' => 'required|string|max:10',
            'suffix' => 'nullable|string|max:10',
            'format' => 'required|string|max:20',
            'rate' => 'nullable|numeric|min:0',
            'is_default' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $defaultCurrency = Currency::where('is_default', true)->first();

            if (!$defaultCurrency) {
                return response()->json([
                    'success' => false,
                    'message' => 'No default currency found. Please set a default currency first.'
                ], 400);
            }

            if ($request->boolean('is_default')) {
                Currency::where('is_default', true)->update(['is_default' => false]);
                $rate = 1.0000;
            } else {
                $rate = $this->fetchExchangeRate($defaultCurrency->code, strtoupper($request->code));
            }

            $currency = Currency::create([
                'code' => strtoupper($request->code),
                'prefix' => $request->prefix,
                'suffix' => $request->suffix,
                'format' => $request->format,
                'rate' => $rate,
                'is_default' => $request->boolean('is_default')
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Currency created successfully with current exchange rate',
                'currency' => $currency
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create currency',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetchExchangeRate(string $fromCurrency, string $toCurrency): float
    {
        if (empty(env('EXCHANGERATE_API', ''))) {
            throw new \Exception('Exchange rate API key not configured');
        }

        $response = Http::get('https://api.exchangerate.host/live', [
            'access_key' => env('EXCHANGERATE_API', ''),
            'source' => $fromCurrency,
            'currencies' => $toCurrency
        ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to fetch exchange rate from API');
        }

        $data = $response->json();

        if (!$data['success']) {
            throw new \Exception('API returned error: ' . ($data['error']['info'] ?? 'Unknown error'));
        }

        $quotes = $data['quotes'] ?? [];
        $quoteKey = $fromCurrency . $toCurrency;

        if (isset($quotes[$quoteKey])) {
            return $quotes[$quoteKey];
        } else {
            throw new \Exception('Exchange rate not found for ' . $toCurrency);
        }
    }

    public function updateCurrency(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:currencies,id',
            'code' => 'required|string|max:3|unique:currencies,code,' . $request->id,
            'prefix' => 'nullable|string|max:10',
            'suffix' => 'nullable|string|max:10',
            'format' => 'required|string|max:20',
            'rate' => 'required|numeric|min:0',
            'is_default' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $currency = Currency::findOrFail($request->id);

            if ($request->boolean('is_default') && !$currency->is_default) {
                Currency::where('is_default', true)->update(['is_default' => false]);
            }

            $currency->update([
                'code' => strtoupper($request->code),
                'prefix' => $request->prefix,
                'suffix' => $request->suffix,
                'format' => $request->format,
                'rate' => $request->rate,
                'is_default' => $request->boolean('is_default')
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Currency updated successfully',
                'currency' => $currency
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update currency',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteCurrency(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:currencies,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $currency = Currency::findOrFail($request->id);

            if ($currency->is_default) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete the default currency'
                ], 400);
            }

            $currency->delete();

            return response()->json([
                'success' => true,
                'message' => 'Currency deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete currency',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateExchangeRates(Request $request): JsonResponse
    {
        try {
            // Get default currency
            $defaultCurrency = Currency::where('is_default', true)->first();

            if (!$defaultCurrency) {
                return response()->json([
                    'success' => false,
                    'message' => 'No default currency found'
                ], 400);
            }

            // Get all currencies except the default one
            $currencies = Currency::where('is_default', false)->get();

            if ($currencies->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No currencies to update'
                ], 400);
            }

            // Prepare currency codes for API request
            $currencyCodes = $currencies->pluck('code')->implode(',');

            if (empty(env('EXCHANGERATE_API', ''))) {
                return response()->json([
                    'success' => false,
                    'message' => 'There is no API key set for the exchange rates. Please update it in the .env file.'
                ], 400);
            }

            // Make API request to exchangerate.host
            $response = Http::get('https://api.exchangerate.host/live', [
                'access_key' => env('EXCHANGERATE_API', ''),
                'source' => $defaultCurrency->code,
                'currencies' => $currencyCodes
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to fetch exchange rates from API'
                ], 500);
            }

            $data = $response->json();

            if (!$data['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'API returned error: ' . ($data['error']['info'] ?? 'Unknown error')
                ], 500);
            }

            DB::beginTransaction();

            $updatedCount = 0;
            $quotes = $data['quotes'] ?? [];

            foreach ($currencies as $currency) {
                $quoteKey = $defaultCurrency->code . $currency->code;

                if (isset($quotes[$quoteKey])) {
                    $currency->update(['rate' => $quotes[$quoteKey]]);
                    $updatedCount++;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully updated {$updatedCount} currency rates",
                'updated_count' => $updatedCount,
                'timestamp' => $data['timestamp'] ?? null
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update exchange rates',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update single currency rate
     */
    public function updateSingleRate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'currency_id' => 'required|exists:currencies,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get the currency to update
            $currency = Currency::findOrFail($request->currency_id);

            // Get default currency
            $defaultCurrency = Currency::where('is_default', true)->first();

            if (!$defaultCurrency) {
                return response()->json([
                    'success' => false,
                    'message' => 'No default currency found'
                ], 400);
            }

            // Don't update the default currency
            if ($currency->is_default) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot update rate for default currency'
                ], 400);
            }

            if (empty(env('EXCHANGERATE_API', ''))) {
                return response()->json([
                    'success' => false,
                    'message' => 'There is no API key set for the exchange rates. Please update it in the .env file.'
                ], 400);
            }

            // Make API request to exchangerate.host
            $response = Http::get('https://api.exchangerate.host/live', [
                'access_key' => env('EXCHANGERATE_API', ''),
                'source' => $defaultCurrency->code,
                'currencies' => $currency->code
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to fetch exchange rate from API'
                ], 500);
            }

            $data = $response->json();

            if (!$data['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'API returned error: ' . ($data['error']['info'] ?? 'Unknown error')
                ], 500);
            }

            $quotes = $data['quotes'] ?? [];
            $quoteKey = $defaultCurrency->code . $currency->code;

            if (isset($quotes[$quoteKey])) {
                $currency->update(['rate' => $quotes[$quoteKey]]);

                return response()->json([
                    'success' => true,
                    'message' => "Rate updated for {$currency->code}",
                    'new_rate' => $quotes[$quoteKey],
                    'timestamp' => $data['timestamp'] ?? null
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Exchange rate not found for this currency'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update currency rate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Set a currency as default
     */
    public function setDefaultCurrency(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'currency_id' => 'required|exists:currencies,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $currency = Currency::findOrFail($request->currency_id);

            // Unset all other default currencies
            Currency::where('is_default', true)->update(['is_default' => false]);

            // Set the selected currency as default with rate 1.0000
            $currency->update([
                'is_default' => true,
                'rate' => 1.0000
            ]);

            // Update all other currencies' rates relative to the new default
            $otherCurrencies = Currency::where('id', '!=', $currency->id)->get();

            foreach ($otherCurrencies as $otherCurrency) {
                try {
                    $newRate = $this->fetchExchangeRate($currency->code, $otherCurrency->code);
                    $otherCurrency->update(['rate' => $newRate]);
                } catch (\Exception $e) {
                    // If we can't fetch the rate, keep the existing rate
                    // This prevents the entire operation from failing
                    continue;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "{$currency->code} has been set as the default currency",
                'currency' => $currency
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to set default currency',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all currencies
     */
    public function getCurrencies(): JsonResponse
    {
        try {
            $currencies = Currency::orderBy('is_default', 'desc')
                ->orderBy('code')
                ->get();

            return response()->json([
                'success' => true,
                'currencies' => $currencies
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch currencies',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
