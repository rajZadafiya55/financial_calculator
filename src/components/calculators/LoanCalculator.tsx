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

const LoanCalculator = () => {
  const [tenureType, setTenureType] = useState("years");
  const [loanAmount, setLoanAmount] = useState<string>("1000000");
  const [annualRate, setAnnualRate] = useState<string>("8.5");
  const [tenure, setTenure] = useState<string>("20");

  const loanAmountNum = parseFloat(loanAmount) || 0;
  const annualRateNum = parseFloat(annualRate) || 0;
  const tenureNum = parseFloat(tenure) || 0;
  const loanCalculation = useMemo(() => {
    if (!loanAmountNum || !annualRateNum || !tenureNum) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        totalMonths: 0,
      };
    }

    const monthlyRate = annualRateNum / 100 / 12;
    const totalMonths = tenureType === "years" ? tenureNum * 12 : tenureNum;

    let emi = 0;
    if (monthlyRate > 0) {
      emi =
        (loanAmountNum * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      emi = loanAmountNum / totalMonths;
    }

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmountNum;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      totalMonths,
    };
  }, [loanAmountNum, annualRateNum, tenureNum, tenureType]);

  const pieData = [
    {
      name: "Total Interest",
      value: loanCalculation.totalInterest,
      color: "#ef4444",
    },
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

  // input handler (block negatives, allow only numbers/decimal)
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
            Loan Calculator
          </CardTitle>
          <CardDescription>
            Calculate your loan EMI and total payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="loan-amount">Loan Amount</Label>
            <Input
              id="loan-amount"
              type="text"
              value={loanAmount}
              onChange={handleNumericInput(setLoanAmount)}
              placeholder="00000"
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual-rate">Annual Interest Rate (%)</Label>
            <Input
              id="annual-rate"
              type="text"
              value={annualRate}
              onChange={handleNumericInput(setAnnualRate)}
              placeholder="0%"
              className="text-lg font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure</Label>
              <Input
                id="tenure"
                type="text"
                value={tenure}
                onChange={handleNumericInput(setTenure)}
                placeholder="0"
                className="text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label>Tenure Type</Label>
              <Select value={tenureType} onValueChange={setTenureType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="years">Years</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 space-y-4 border-t">
            <div className="bg-financial-primary/10 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly EMI:</span>
                  <span className="font-bold text-financial-primary text-lg">
                    {formatCurrency(loanCalculation.emi)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  ({formatCurrencyUSD(loanCalculation.emi)})
                </div>
              </div>
            </div>

            <div className="bg-financial-danger/10 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest:</span>
                  <span className="font-bold text-financial-danger text-lg">
                    {formatCurrency(loanCalculation.totalInterest)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  ({formatCurrencyUSD(loanCalculation.totalInterest)})
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Payment:</span>
                  <span className="font-semibold">
                    {formatCurrency(loanCalculation.totalPayment)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  ({formatCurrencyUSD(loanCalculation.totalPayment)})
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-financial-primary">
            Payment Breakdown
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
              const percent = (
                (item.value / loanCalculation.totalPayment) *
                100
              ).toFixed(1);
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

export default LoanCalculator;
