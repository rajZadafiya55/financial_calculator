import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  ];

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://open.er-api.com/v6/latest/${fromCurrency}`
        );
        const data = await res.json();
        if (data.result === "success") {
          setExchangeRates(data.rates);
        }
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, amount]);

  const conversion = useMemo(() => {
    const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
    const convertedAmount = amount * rate;

    return {
      rate,
      convertedAmount,
      rateText: `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`,
    };
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatAmount = (amount: number, currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return `${currency?.symbol || ""}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const popularPairs = [
    { from: "USD", to: "INR", label: "USD → INR" },
    { from: "INR", to: "USD", label: "INR → USD" },
    { from: "EUR", to: "USD", label: "EUR → USD" },
    { from: "GBP", to: "USD", label: "GBP → USD" },
  ];

  const setPopularPair = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setAmount(value); // allow only positive numbers or empty
    }
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-financial-primary">
            Currency Converter
          </CardTitle>
          <CardDescription>
            Convert between major world currencies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0000"
              className="text-lg font-semibold"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                className="rounded-full"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 space-y-4 border-t">
            <div className="bg-financial-primary/10 p-4 rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-financial-primary" />
                </div>
              ) : (
                <div className="bg-muted/50 p-3 rounded-lg mt-2">
                  <div className="text-center text-sm text-muted-foreground">
                    <strong>Selected Rate:</strong>
                    <br />1 {fromCurrency} ={" "}
                    {exchangeRates[toCurrency]
                      ? exchangeRates[toCurrency].toFixed(4)
                      : "N/A"}{" "}
                    {toCurrency}
                  </div>
                  <div className="text-xs text-muted-foreground text-center mt-1">
                    Last updated:{" "}
                    {exchangeRates && exchangeRates[toCurrency]
                      ? "Live from API"
                      : "N/A"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-financial-primary">
            Popular Currency Pairs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {popularPairs.map((pair) => {
              const rate = exchangeRates[pair.from]?.[pair.to] || 1;
              const fromCurrency = currencies.find((c) => c.code === pair.from);
              const toCurrency = currencies.find((c) => c.code === pair.to);

              return (
                <div
                  key={`${pair.from}-${pair.to}`}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setPopularPair(pair.from, pair.to)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="font-medium">{pair.label}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      1 {pair.from} = {rate.toFixed(4)} {pair.to}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Click to select
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t">
            <div className="bg-financial-warning/10 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground text-center">
                <strong>Note:</strong> Exchange rates are fetched in real-time
                from a live API and may vary slightly.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverter;
