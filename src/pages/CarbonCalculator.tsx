
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plane, Car, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmissionsCard from "@/components/EmissionsCard";
import { 
  calculateFlightEmissions, 
  calculateTransactionEmissions, 
  FlightResponse, 
  TransactionResponse,
  FlightRequest,
  TransactionRequest 
} from "@/services/api";

// Flight form schema
const flightFormSchema = z.object({
  origin: z.string().min(3, "Origin airport code must be at least 3 characters"),
  destination: z.string().min(3, "Destination airport code must be at least 3 characters"),
  numberOfPassengers: z.coerce.number().int().min(1, "At least 1 passenger is required"),
});

// Transaction form schema
const transactionFormSchema = z.object({
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

type FlightFormValues = z.infer<typeof flightFormSchema>;
type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const CarbonCalculator = () => {
  const [activeTab, setActiveTab] = useState("flight");
  
  // Flight state
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightResult, setFlightResult] = useState<FlightResponse | null>(null);

  // Transaction state
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResponse | null>(null);

  // Flight form
  const flightForm = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
      numberOfPassengers: 1,
    },
  });

  // Transaction form
  const transactionForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
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

  // Flight submit handler
  const onFlightSubmit = async (values: FlightFormValues) => {
    setFlightLoading(true);
    try {
      // Ensure all required fields are present for the API call
      const flightRequest: FlightRequest = {
        origin: values.origin,
        destination: values.destination,
        numberOfPassengers: values.numberOfPassengers
      };
      
      const data = await calculateFlightEmissions(flightRequest);
      setFlightResult(data);
      toast.success("Flight emissions calculated successfully");
    } catch (error) {
      // Error is already handled in the API service
    } finally {
      setFlightLoading(false);
    }
  };

  // Transaction submit handler
  const onTransactionSubmit = async (values: TransactionFormValues) => {
    setTransactionLoading(true);
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
      setTransactionResult(data);
      toast.success("Transaction emissions calculated successfully");
    } catch (error) {
      // Error is already handled in the API service
    } finally {
      setTransactionLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12 animate-fadeIn">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary text-primary rounded-full mb-4">
          Carbon Calculator
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">Carbon Emissions Calculator</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Calculate the environmental impact of your flights and financial transactions with our precise emissions calculator.
        </p>
      </div>

      <Tabs defaultValue="flight" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="flight" className="text-base py-3">
            <Plane className="h-4 w-4 mr-2" />
            Flight Emissions
          </TabsTrigger>
          <TabsTrigger value="transaction" className="text-base py-3">
            <Car className="h-4 w-4 mr-2" />
            Transaction Emissions
          </TabsTrigger>
        </TabsList>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div>
            <TabsContent value="flight" className="mt-0">
              <Card className="animate-slideUp card-glass card-hover">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-secondary rounded-md mr-3">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Flight Details</CardTitle>
                  </div>
                  <CardDescription>
                    Enter the 3-letter IATA airport codes (e.g., LAX for Los Angeles, JFK for New York)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...flightForm}>
                    <form onSubmit={flightForm.handleSubmit(onFlightSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={flightForm.control}
                          name="origin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Origin Airport</FormLabel>
                              <FormControl>
                                <Input placeholder="LAX" {...field} className="uppercase" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={flightForm.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Destination Airport</FormLabel>
                              <FormControl>
                                <Input placeholder="DFW" {...field} className="uppercase" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={flightForm.control}
                        name="numberOfPassengers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Passengers</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={flightLoading}>
                        {flightLoading ? "Calculating..." : "Calculate Emissions"}
                        {!flightLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transaction" className="mt-0">
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
                  <Form {...transactionForm}>
                    <form onSubmit={transactionForm.handleSubmit(onTransactionSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={transactionForm.control}
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
                          control={transactionForm.control}
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
                          control={transactionForm.control}
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
                          control={transactionForm.control}
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
                          control={transactionForm.control}
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
                          control={transactionForm.control}
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
                        control={transactionForm.control}
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
                        control={transactionForm.control}
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
                      
                      <Button type="submit" className="w-full" disabled={transactionLoading}>
                        {transactionLoading ? "Calculating..." : "Calculate Emissions"}
                        {!transactionLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
          
          {/* Right Column - Results */}
          <div>
            <TabsContent value="flight" className="mt-0">
              {flightResult ? (
                <EmissionsCard
                  title="Flight Emissions"
                  emissions={flightResult.emissions_kg_co2e}
                  unit="kg CO₂e"
                  distance={flightResult.distance_km}
                  className="animate-slideUp"
                  style={{ animationDelay: "0.2s" }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 animate-slideUp" style={{ animationDelay: "0.2s" }}>
                  <div className="text-center p-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <Plane className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Emissions Results</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                      Fill out the form and calculate to view your flight's carbon emissions.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="transaction" className="mt-0">
              {transactionResult ? (
                <EmissionsCard
                  title={`${transactionResult.name} Emissions`}
                  emissions={transactionResult.kg_of_CO2e_emissions}
                  unit="kg CO₂e"
                  similarTo={transactionResult.similar_to}
                  disclaimer={transactionResult.disclaimer}
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
            </TabsContent>
          </div>
        </div>
      </Tabs>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-6">Why Calculate Your Emissions?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="animate-slideUp" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-xl font-medium mb-2">Awareness</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Understand the environmental impact of your daily activities and make informed decisions.
            </p>
          </div>
          <div className="animate-slideUp" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-xl font-medium mb-2">Reduction</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Identify opportunities to reduce your carbon footprint through changed habits.
            </p>
          </div>
          <div className="animate-slideUp" style={{ animationDelay: "0.5s" }}>
            <h3 className="text-xl font-medium mb-2">Action</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Take meaningful steps toward a more sustainable lifestyle with data-driven insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCalculator;
