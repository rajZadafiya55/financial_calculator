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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("5000");
  const [expectedReturn, setExpectedReturn] = useState<string>("12");
  const [duration, setDuration] = useState<string>("10");

  // convert safely for calculation
  const monthlyInvestmentNum = parseFloat(monthlyInvestment) || 0;
  const expectedReturnNum = parseFloat(expectedReturn) || 0;
  const durationNum = parseFloat(duration) || 0;

  const sipCalculation = useMemo(() => {
    const monthlyRate = expectedReturnNum / 100 / 12;
    const months = durationNum * 12;

    let maturityValue = 0;
    if (monthlyRate > 0) {
      maturityValue =
        monthlyInvestmentNum *
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate));
    } else {
      maturityValue = monthlyInvestmentNum * months;
    }

    const totalInvested = monthlyInvestmentNum * months;
    const wealthGained = maturityValue - totalInvested;

    return {
      totalInvested: Math.round(totalInvested),
      maturityValue: Math.round(maturityValue),
      wealthGained: Math.round(wealthGained),
    };
  }, [monthlyInvestmentNum, expectedReturnNum, durationNum]);

  const pieData = [
    {
      name: "Invested Amount",
      value: sipCalculation.totalInvested,
      color: "#3b82f6",
    },
    {
      name: "Wealth Gained",
      value: sipCalculation.wealthGained,
      color: "#10b981",
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

  // common handler for numeric-only input
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
            SIP Calculator
          </CardTitle>
          <CardDescription>
            Calculate your Systematic Investment Plan returns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="monthly-investment">Monthly Investment</Label>
            <Input
              id="monthly-investment"
              type="text"
              value={monthlyInvestment}
              onChange={handleNumericInput(setMonthlyInvestment)}
              placeholder="0000"
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected-return">
              Expected Return (% per annum)
            </Label>
            <Input
              id="expected-return"
              type="text"
              value={expectedReturn}
              onChange={handleNumericInput(setExpectedReturn)}
              placeholder="0%"
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (years)</Label>
            <Input
              id="duration"
              type="text"
              value={duration}
              onChange={handleNumericInput(setDuration)}
              placeholder="0"
              className="text-lg font-semibold"
            />
          </div>

          <div className="pt-4 space-y-4 border-t">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Invested:</span>
                  <span className="font-semibold">
                    {formatCurrency(sipCalculation.totalInvested)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  ({formatCurrencyUSD(sipCalculation.totalInvested)})
                </div>
              </div>
            </div>

            <div className="bg-financial-secondary/10 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maturity Value:</span>
                  <span className="font-bold text-financial-secondary text-lg">
                    {formatCurrency(sipCalculation.maturityValue)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  ({formatCurrencyUSD(sipCalculation.maturityValue)})
                </div>
              </div>
            </div>

            <div className="bg-financial-success/10 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wealth Gained:</span>
                  <span className="font-bold text-financial-success text-lg">
                    {formatCurrency(sipCalculation.wealthGained)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  ({formatCurrencyUSD(sipCalculation.wealthGained)})
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-financial-primary">
            Investment Breakdown
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
                (item.value / sipCalculation.maturityValue) *
                100
              ).toFixed(1);
              return (
                <div
                  key={item.name}
                  className={`p-4 rounded-lg shadow-card flex flex-col gap-2`}
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

export default SipCalculator;
