import React, { useState, useMemo } from "react";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const TaxCalculator = () => {
  const [annualIncome, setAnnualIncome] = useState<string>("1200000");
  const [deductions, setDeductions] = useState<string>("150000");
  const [regime, setRegime] = useState("old");

  const annualIncomeNum = parseFloat(annualIncome) || 0;
  const deductionsNum = parseFloat(deductions) || 0;

  const taxCalculation = useMemo(() => {
    const taxableIncome = Math.max(0, annualIncome - deductions);
    let tax = 0;
    let taxBreakdown: Array<{ name: string; value: number; color: string }> =
      [];

    if (regime === "old") {
      // Old Tax Regime Slabs (2023-24)
      const slabs = [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: Infinity, rate: 30 },
      ];

      let remainingIncome = taxableIncome;

      slabs.forEach((slab, index) => {
        if (remainingIncome > 0 && taxableIncome > slab.min) {
          const taxableAtThisSlab = Math.min(
            remainingIncome,
            slab.max - slab.min
          );
          const taxAtThisSlab = (taxableAtThisSlab * slab.rate) / 100;

          if (taxAtThisSlab > 0) {
            taxBreakdown.push({
              name: `${slab.rate}% (₹${slab.min.toLocaleString()} - ${
                slab.max === Infinity ? "∞" : "₹" + slab.max.toLocaleString()
              })`,
              value: taxAtThisSlab,
              color: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"][index],
            });
          }

          tax += taxAtThisSlab;
          remainingIncome -= taxableAtThisSlab;
        }
      });
    } else {
      // New Tax Regime Slabs (2023-24)
      const slabs = [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 600000, rate: 5 },
        { min: 600000, max: 900000, rate: 10 },
        { min: 900000, max: 1200000, rate: 15 },
        { min: 1200000, max: 1500000, rate: 20 },
        { min: 1500000, max: Infinity, rate: 30 },
      ];

      let remainingIncome = taxableIncome;

      slabs.forEach((slab, index) => {
        if (remainingIncome > 0 && taxableIncome > slab.min) {
          const taxableAtThisSlab = Math.min(
            remainingIncome,
            slab.max - slab.min
          );
          const taxAtThisSlab = (taxableAtThisSlab * slab.rate) / 100;

          if (taxAtThisSlab > 0) {
            taxBreakdown.push({
              name: `${slab.rate}% (₹${slab.min.toLocaleString()} - ${
                slab.max === Infinity ? "∞" : "₹" + slab.max.toLocaleString()
              })`,
              value: taxAtThisSlab,
              color: [
                "#10b981",
                "#3b82f6",
                "#8b5cf6",
                "#f59e0b",
                "#ef4444",
                "#dc2626",
              ][index],
            });
          }

          tax += taxAtThisSlab;
          remainingIncome -= taxableAtThisSlab;
        }
      });
    }

    // Add cess (4% on tax)
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    return {
      taxableIncome: Math.round(taxableIncome),
      baseTax: Math.round(tax),
      cess: Math.round(cess),
      totalTax: Math.round(totalTax),
      netIncome: Math.round(annualIncome - totalTax),
      taxBreakdown,
      effectiveRate: annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0,
    };
  }, [annualIncome, deductions, regime]);

  const pieData = [
    {
      name: "Taxable Income",
      value: taxCalculation.taxableIncome,
      color: "#3b82f6",
    },
    { name: "Net Income", value: taxCalculation.netIncome, color: "#10b981" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyUSD = (amount: number) => {
    const usdAmount = amount / 83; // 1 USD = 83 INR
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(usdAmount);
  };

  const handleNumericInput =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (
        value === "" ||
        (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)
      ) {
        setter(value);
      }
    };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-financial-primary">
            Tax Calculator
          </CardTitle>
          <CardDescription>
            Calculate your income tax for India (FY 2023-24)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="annual-income">Annual Income</Label>
            <Input
              id="annual-income"
              type="text"
              value={annualIncome}
              onChange={handleNumericInput(setAnnualIncome)}
              placeholder="0"
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deductions">Deductions (80C, 80D, etc.)</Label>
           <Input
              id="deductions"
              type="text"
              value={deductions}
              onChange={handleNumericInput(setDeductions)}
              placeholder="0"
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label>Tax Regime</Label>
            <Select value={regime} onValueChange={setRegime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="old">
                  Old Regime (with deductions)
                </SelectItem>
                <SelectItem value="new">
                  New Regime (lower rates, no deductions)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-4 border-t">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxable Income:</span>
                  <span className="font-semibold">
                    {formatCurrency(taxCalculation.taxableIncome)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  ({formatCurrencyUSD(taxCalculation.taxableIncome)})
                </div>
              </div>
            </div>

            <div className="bg-financial-danger/10 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Payable:</span>
                  <span className="font-bold text-financial-danger text-lg">
                    {formatCurrency(taxCalculation.totalTax)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  ({formatCurrencyUSD(taxCalculation.totalTax)})
                </div>
              </div>
            </div>

            <div className="bg-financial-success/10 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net Income:</span>
                  <span className="font-bold text-financial-success text-lg">
                    {formatCurrency(taxCalculation.netIncome)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  ({formatCurrencyUSD(taxCalculation.netIncome)})
                </div>
              </div>
            </div>

            <div className="bg-financial-warning/10 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Effective Tax Rate:
                </span>
                <span className="font-bold text-financial-warning">
                  {taxCalculation.effectiveRate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-financial-primary">
            Income Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Breakdown Cards Below PieChart */}
          <div className="grid grid-cols-1 gap-4 mt-6">
            {pieData.map((item, idx) => {
              const percent = ((item.value / annualIncome) * 100).toFixed(1);
              return (
                <div
                  key={item.name}
                  className="p-4 rounded-lg shadow-card flex flex-col gap-2"
                  style={{ background: item.color + "1A" }} // 1A for 10% opacity
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-financial-primary">
                      {item.name}
                    </span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: item.color }}
                    >
                      {percent}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    ({formatCurrencyUSD(item.value)})
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxCalculator;
