
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Car } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmissionsCard from "@/components/EmissionsCard";
import { calculateTransactionEmissions, TransactionResponse } from "@/services/api";

const formSchema = z.object({
  currencyISO: z.string().min(3, "Currency ISO is required"),
  categoryType: z.string().min(1, "Category type is required"),
  categoryValue: z.string().min(1, "Category value is required"),
  description: z.string().optional(),
  merchant: z.string().min(1, "Merchant name is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  transactionId: z.string().default(() => `tx_${Date.now()}`),
  transactionDate: z.string().default(() => new Date().toISOString().split("T")[0]),
  userType: z.string().default("PERSONAL"),
  geo: z.string().min(1, "Geography is required"),
  group: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionEmissions = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransactionResponse | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currencyISO: "USD",
      categoryType: "mcc",
      categoryValue: "5411",
      description: "",
      merchant: "",
      price: 0,
      transactionId: `tx_${Date.now()}`,
      transactionDate: new Date().toISOString().split("T")[0],
      userType: "PERSONAL",
      geo: "US",
      group: "Food",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const data = await calculateTransactionEmissions(values);
      setResult(data);
      toast.success("Transaction emissions calculated successfully");
    } catch (error) {
      // Error is already handled in the API service
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-12 animate-fadeIn">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary text-primary rounded-full mb-4">
          Transaction Calculator
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">Transaction Emissions Calculator</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Calculate the carbon emissions associated with your financial transactions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="animate-slideUp card-glass card-hover">
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="p-2 bg-secondary rounded-md mr-3">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Transaction Details</CardTitle>
            </div>
            <CardDescription>
              Enter your transaction information to calculate its carbon impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="merchant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant</FormLabel>
                        <FormControl>
                          <Input placeholder="Tesco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currencyISO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                            <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="geo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mcc">MCC (Merchant Category Code)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Value</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category value" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5411">5411 - Grocery Stores</SelectItem>
                            <SelectItem value="5812">5812 - Restaurants</SelectItem>
                            <SelectItem value="5541">5541 - Gas Stations</SelectItem>
                            <SelectItem value="4111">4111 - Transportation</SelectItem>
                            <SelectItem value="5311">5311 - Department Stores</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Transaction description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Shopping">Shopping</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Calculating..." : "Calculate Emissions"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {result ? (
          <EmissionsCard
            title={`${result.name} Emissions`}
            emissions={result.kg_of_CO2e_emissions}
            unit="kg CO₂e"
            similarTo={result.similar_to}
            disclaimer={result.disclaimer}
            className="animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 animate-slideUp" style={{ animationDelay: "0.2s" }}>
            <div className="text-center p-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Emissions Results</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Fill out the form and calculate to view your transaction's carbon impact.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionEmissions;
