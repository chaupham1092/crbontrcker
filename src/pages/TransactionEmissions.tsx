
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingCart, Receipt, ArrowRight, DollarSign, MapPin, Tag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateTransactionEmissions, TransactionResponse, TransactionRequest } from "@/services/api";

// Transaction form schema
const formSchema = z.object({
  currencyISO: z.string().min(3, "Currency is required"),
  categoryType: z.string().min(1, "Category type is required"),
  categoryValue: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  merchant: z.string().min(1, "Merchant name is required"),
  price: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  transactionId: z.string().default(() => `tx_${Date.now()}`),
  transactionDate: z.string().default(() => new Date().toISOString().split("T")[0]),
  userType: z.string().default("PERSONAL"),
  geo: z.string().min(1, "Country is required"),
  group: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Category mappings for better user experience
const categoryMappings = {
  "5411": {
    name: "Grocery Stores",
    group: "Food",
    icon: <ShoppingCart className="h-4 w-4" />
  },
  "5812": {
    name: "Restaurants & Dining",
    group: "Food",
    icon: <Receipt className="h-4 w-4" />
  },
  "5541": {
    name: "Gas & Fuel",
    group: "Transportation",
    icon: <ShoppingCart className="h-4 w-4" />
  },
  "4111": {
    name: "Public Transportation",
    group: "Transportation",
    icon: <Receipt className="h-4 w-4" />
  },
  "5311": {
    name: "Department Stores",
    group: "Shopping",
    icon: <ShoppingCart className="h-4 w-4" />
  }
};

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
      // Ensure all required fields are present for the API call
      const transactionRequest: TransactionRequest = {
        currencyISO: values.currencyISO,
        categoryType: values.categoryType,
        categoryValue: values.categoryValue,
        description: values.description || "",
        merchant: values.merchant,
        price: values.price,
        transactionId: values.transactionId,
        transactionDate: values.transactionDate,
        userType: values.userType,
        geo: values.geo,
        group: values.group || "Food",
      };
      
      const data = await calculateTransactionEmissions(transactionRequest);
      setResult(data);
      toast.success("Purchase emissions calculated successfully");
    } catch (error) {
      // Error is already handled in the API service
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Purchase Emissions Calculator</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Calculate the carbon footprint of your purchases based on category and amount.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="p-2 bg-secondary rounded-md mr-3">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Purchase Details</CardTitle>
            </div>
            <CardDescription>
              Enter your purchase information to calculate its carbon footprint
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
                        <FormLabel className="flex items-center gap-1.5">
                          <Receipt className="h-3.5 w-3.5" />
                          Store/Merchant
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Tesco, Amazon, Shell, etc." {...field} />
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
                        <FormLabel className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5" />
                          Purchase Amount
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5" />
                          Currency
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          Country
                        </FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="categoryValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        Purchase Category
                      </FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        // Update the category group based on the selected category
                        if (categoryMappings[value as keyof typeof categoryMappings]) {
                          form.setValue('group', categoryMappings[value as keyof typeof categoryMappings].group);
                        }
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select purchase category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(categoryMappings).map(([key, { name, icon }]) => (
                            <SelectItem key={key} value={key} className="flex items-center">
                              <div className="flex items-center gap-2">
                                {icon}
                                <span>{name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Receipt className="h-3.5 w-3.5" />
                        Description (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="What did you purchase?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Hidden fields - handled automatically */}
                <input type="hidden" {...form.register('categoryType')} value="mcc" />
                <input type="hidden" {...form.register('group')} />
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Calculating..." : "Calculate Carbon Footprint"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {result ? (
          <Card className="overflow-hidden">
            <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Result</span>
                  <CardTitle className="mt-2">
                    Carbon Footprint
                  </CardTitle>
                  <CardDescription>
                    Your purchase at <strong>{form.getValues('merchant') || 'this merchant'}</strong>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-8">
                <h3 className="text-4xl font-bold text-green-700 dark:text-green-500">
                  {result.kg_of_CO2e_emissions.toFixed(2)}
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">kg CO₂e</span>
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Carbon footprint of your {result.name.toLowerCase()}
                </p>
              </div>
              
              {result.similar_to && result.similar_to.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Equivalent Impact:
                  </h4>
                  <ul className="space-y-2 pl-6 text-gray-600 dark:text-gray-300">
                    {result.similar_to.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.disclaimer && (
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                  <strong className="font-medium">Note:</strong> {result.disclaimer}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-center p-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Carbon Footprint Results</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Fill out the form and calculate to view your purchase's carbon footprint.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionEmissions;
