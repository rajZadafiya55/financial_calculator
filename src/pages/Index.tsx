import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator, PiggyBank, Receipt, DollarSign } from "lucide-react";
import SipCalculator from "@/components/calculators/SipCalculator";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import TaxCalculator from "@/components/calculators/TaxCalculator";
import CurrencyConverter from "@/components/calculators/CurrencyConverter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            All-in-One Financial Calculator
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Comprehensive financial tools to help you make informed decisions
            about investments, loans, taxes, and currency conversions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="sip" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card shadow-card">
            <TabsTrigger
              value="sip"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center space-x-2">
                <PiggyBank className="h-5 w-5" />
                <span className="hidden sm:inline">SIP Calculator</span>
                <span className="sm:hidden">SIP</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="loan"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span className="hidden sm:inline">Loan Calculator</span>
                <span className="sm:hidden">Loan</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="tax"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span className="hidden sm:inline">Tax Calculator</span>
                <span className="sm:hidden">Tax</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="currency"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span className="hidden sm:inline">Currency Converter</span>
                <span className="sm:hidden">Currency</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sip" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                SIP Calculator
              </h2>
              <p className="text-muted-foreground text-lg">
                Calculate your Systematic Investment Plan returns and see how
                your money grows over time.
              </p>
            </div>
            <SipCalculator />
          </TabsContent>

          <TabsContent value="loan" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Loan Calculator
              </h2>
              <p className="text-muted-foreground text-lg">
                Calculate your loan EMI, total interest, and payment breakdown
                for informed borrowing decisions.
              </p>
            </div>
            <LoanCalculator />
          </TabsContent>

          <TabsContent value="tax" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Tax Calculator
              </h2>
              <p className="text-muted-foreground text-lg">
                Calculate your income tax liability under both old and new tax
                regimes for India.
              </p>
            </div>
            <TaxCalculator />
          </TabsContent>

          <TabsContent value="currency" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Currency Converter
              </h2>
              <p className="text-muted-foreground text-lg">
                Convert between major world currencies with real-time exchange
                rates.
              </p>
            </div>
            <CurrencyConverter />
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 text-center cursor-pointer">
            <CardHeader>
              <PiggyBank className="h-12 w-12 mx-auto text-financial-secondary" />
              <CardTitle className="text-lg">SIP Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Plan your systematic investments and visualize wealth creation
                over time with detailed breakdowns.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 text-center cursor-pointer">
            <CardHeader>
              <Calculator className="h-12 w-12 mx-auto text-financial-primary" />
              <CardTitle className="text-lg">Loan Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Calculate EMIs, compare loan options, and understand the total
                cost of borrowing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 text-center cursor-pointer">
            <CardHeader>
              <Receipt className="h-12 w-12 mx-auto text-financial-warning" />
              <CardTitle className="text-lg">Tax Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Compare tax regimes and optimize your tax liability with proper
                planning and deductions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 text-center cursor-pointer">
            <CardHeader>
              <DollarSign className="h-12 w-12 mx-auto text-financial-success" />
              <CardTitle className="text-lg">Currency Exchange</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Stay updated with currency rates and convert between major world
                currencies instantly.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
