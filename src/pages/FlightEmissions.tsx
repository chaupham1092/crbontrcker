
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plane } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EmissionsCard from "@/components/EmissionsCard";
import { calculateFlightEmissions, FlightResponse } from "@/services/api";

const formSchema = z.object({
  origin: z.string().min(3, "Origin airport code must be at least 3 characters"),
  destination: z.string().min(3, "Destination airport code must be at least 3 characters"),
  numberOfPassengers: z.coerce.number().int().min(1, "At least 1 passenger is required"),
});

type FormValues = z.infer<typeof formSchema>;

const FlightEmissions = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FlightResponse | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      numberOfPassengers: 1,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const data = await calculateFlightEmissions(values);
      setResult(data);
      toast.success("Flight emissions calculated successfully");
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
          Flight Calculator
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">Flight Emissions Calculator</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Calculate the carbon emissions of your flights by entering your origin and destination airport codes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                  control={form.control}
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
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Calculating..." : "Calculate Emissions"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {result ? (
          <EmissionsCard
            title="Flight Emissions"
            emissions={result.emissions_kg_co2e}
            unit="kg CO₂e"
            distance={result.distance_km}
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
      </div>
    </div>
  );
};

export default FlightEmissions;
