
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plane, CreditCard, ArrowRight, Globe, Leaf, LineChart, ShoppingCart, Receipt, DollarSign, MapPin, Tag } from "lucide-react";
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

type FlightFormValues = z.infer<typeof flightFormSchema>;
type TransactionFormValues = z.infer<typeof transactionFormSchema>;

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
    icon: <CreditCard className="h-4 w-4" />
  },
  "4111": {
    name: "Public Transportation",
    group: "Transportation",
    icon: <CreditCard className="h-4 w-4" />
  },
  "5311": {
    name: "Department Stores",
    group: "Shopping",
    icon: <ShoppingCart className="h-4 w-4" />
  }
};

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
      toast.success("Purchase emissions calculated successfully");
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
          Calculate the environmental impact of your flights and purchases with our precise emissions calculator.
        </p>
      </div>

      <Tabs defaultValue="flight" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="flight" className="text-base py-3">
            <Plane className="h-4 w-4 mr-2" />
            Flight Emissions
          </TabsTrigger>
          <TabsTrigger value="transaction" className="text-base py-3">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase Emissions
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
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Purchase Details</CardTitle>
                  </div>
                  <CardDescription>
                    Enter your purchase information to calculate its carbon footprint
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
                          control={transactionForm.control}
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
                          control={transactionForm.control}
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
                          control={transactionForm.control}
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
                        control={transactionForm.control}
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
                                transactionForm.setValue('group', categoryMappings[value as keyof typeof categoryMappings].group);
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
                        control={transactionForm.control}
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
                      <input type="hidden" {...transactionForm.register('categoryType')} value="mcc" />
                      <input type="hidden" {...transactionForm.register('group')} />
                      
                      <Button type="submit" className="w-full" disabled={transactionLoading}>
                        {transactionLoading ? "Calculating..." : "Calculate Carbon Footprint"}
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
                <Card className="animate-slideUp overflow-hidden" style={{ animationDelay: "0.2s" }}>
                  <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Result</span>
                        <CardTitle className="mt-2">
                          Carbon Footprint
                        </CardTitle>
                        <CardDescription>
                          Your purchase at <strong>{transactionForm.getValues('merchant') || 'this merchant'}</strong>
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                        <Leaf className="h-4 w-4" />
                        <span className="text-xs font-medium">Impact Details</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center mb-8">
                      <h3 className="text-4xl font-bold text-green-700 dark:text-green-500">
                        {transactionResult.kg_of_CO2e_emissions.toFixed(2)}
                        <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">kg CO₂e</span>
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Carbon footprint of your {transactionResult.name.toLowerCase()}
                      </p>
                    </div>
                    
                    {transactionResult.similar_to && transactionResult.similar_to.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                          <LineChart className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                          Equivalent Impact:
                        </h4>
                        <ul className="space-y-2 pl-6 text-gray-600 dark:text-gray-300">
                          {transactionResult.similar_to.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {transactionResult.disclaimer && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                        <strong className="font-medium">Note:</strong> {transactionResult.disclaimer}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 animate-slideUp" style={{ animationDelay: "0.2s" }}>
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
            </TabsContent>
          </div>
        </div>
      </Tabs>
      
      {/* About Section */}
      <div className="mt-16 bg-gray-50 dark:bg-gray-800/30 rounded-xl p-8 animate-slideUp">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary text-primary rounded-full mb-4">
            About Our Service
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Understanding Carbon Footprints</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn how our carbon calculator works and why tracking emissions is important for environmental sustainability.
          </p>
        </div>

        <div className="grid gap-10 md:gap-16">
          <section>
            <div className="flex items-center mb-4">
              <div className="p-2 bg-secondary rounded-md mr-3">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium">How It Works</h3>
            </div>
            
            <div className="pl-10 space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Our calculator provides accurate calculations of carbon emissions for various activities:
              </p>
              <ul className="space-y-2">
                <li className="flex">
                  <span className="mr-2">•</span>
                  <span><strong>Flight Emissions:</strong> Calculates CO₂ emissions based on origin, destination, and passenger count.</span>
                </li>
                <li className="flex">
                  <span className="mr-2">•</span>
                  <span><strong>Purchase Emissions:</strong> Estimates the carbon impact of purchases based on merchant category, price, and location.</span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                The calculations take into account factors such as distance traveled, fuel efficiency, and industry-specific emissions data to provide the most accurate estimates possible.
              </p>
            </div>
          </section>
          
          <section>
            <div className="flex items-center mb-4">
              <div className="p-2 bg-secondary rounded-md mr-3">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Why Track Your Carbon Footprint?</h3>
            </div>
            
            <div className="pl-10 space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Understanding and monitoring your carbon footprint is the first step toward meaningful environmental action. By measuring the impact of your activities, you can:
              </p>
              <ul className="space-y-2">
                <li className="flex">
                  <span className="mr-2">•</span>
                  <span><strong>Gain Awareness:</strong> Recognize which activities contribute most to your environmental impact.</span>
                </li>
                <li className="flex">
                  <span className="mr-2">•</span>
                  <span><strong>Make Informed Choices:</strong> Use data to guide decisions about travel, purchases, and lifestyle.</span>
                </li>
                <li className="flex">
                  <span className="mr-2">•</span>
                  <span><strong>Reduce Emissions:</strong> Set goals to lower your personal or business carbon footprint.</span>
                </li>
                <li className="flex">
                  <span className="mr-2">•</span>
                  <span><strong>Track Progress:</strong> Monitor improvements over time as you make more sustainable choices.</span>
                </li>
              </ul>
            </div>
          </section>
          
          <section>
            <div className="flex items-center mb-4">
              <div className="p-2 bg-secondary rounded-md mr-3">
                <LineChart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Our Data Sources</h3>
            </div>
            
            <div className="pl-10 space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                This calculator uses a combination of industry-standard calculation methodologies and data sources:
              </p>
              <ul className="space-y-2">
                <li className="flex">
                  <span className="mr-2">•</span>
                  <span><strong>Flight Emissions:</strong> Based on ICAO and IATA data on aircraft fuel efficiency, flight routes, and load factors.</span>
                </li>
                <li className="flex">
                  <span className="mr-2">•</span>
                  <span><strong>Purchase Emissions:</strong> Calculated using environmentally-extended input-output (EEIO) models that map spending categories to emissions.</span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                <strong>Disclaimer:</strong> All calculations are estimates based on available data and should be used for informational purposes only. The actual environmental impact may vary.
              </p>
            </div>
          </section>
        </div>
      </div>

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
