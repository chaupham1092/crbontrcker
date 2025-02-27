
import { toast } from "sonner";

const API_BASE_URL = "https://api.magicapi.dev/api/v1/connectearth/connect";
// Get API key from environment variable, with fallback
const API_KEY = import.meta.env.VITE_CONNECT_EARTH_API_KEY || "cm7440ae70001jv035vpcchux";

interface FlightRequest {
  origin: string;
  destination: string;
  numberOfPassengers: number;
}

interface FlightResponse {
  distance_km: number;
  emissions_kg_co2e: number;
}

interface TransactionRequest {
  currencyISO: string;
  categoryType: string;
  categoryValue: string;
  description: string;
  merchant: string;
  price: number;
  transactionId: string;
  transactionDate: string;
  userType: string;
  geo: string;
  group: string;
}

interface TransactionResponse {
  transactionId: string;
  transactionDate: string;
  emissions_level: string;
  name: string;
  kg_of_CO2e_emissions: number;
  mt_of_CO2e_emissions: number;
  similar_to: string[];
  modifiers: any[];
  factor_version: string;
  disclaimer: string;
}

export async function calculateFlightEmissions(data: FlightRequest): Promise<FlightResponse> {
  try {
    console.log("Flight request data:", data);
    
    // For testing purposes, if this is a localhost or development environment
    // generate some realistic test data based on the input
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      // Create realistic test data
      const originCode = data.origin.toUpperCase();
      const destinationCode = data.destination.toUpperCase();
      
      // Generate a distance based on the airport codes - simulation only
      const generateDistance = () => {
        // Get character codes and use them to generate a pseudo-random but consistent distance
        const originSum = [...originCode].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const destSum = [...destinationCode].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const combinedSum = originSum + destSum;
        
        // Generate a distance between 100 and 10000 km based on the combined sum
        return 100 + (combinedSum % 9900);
      };
      
      const distance = generateDistance();
      
      // Calculate emissions - roughly 0.1-0.3 kg CO2 per passenger per km
      const emissionsPerKm = 0.1 + (Math.random() * 0.2);
      const totalEmissions = distance * emissionsPerKm * data.numberOfPassengers;
      
      // Return simulated response
      return {
        distance_km: distance,
        emissions_kg_co2e: totalEmissions
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/flight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-magicapi-key": API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to calculate flight emissions");
    }

    const result = await response.json();
    console.log("Flight API response:", result);
    return result;
  } catch (error) {
    console.error("Error calculating flight emissions:", error);
    toast.error("Failed to calculate flight emissions. Please try again.");
    throw error;
  }
}

export async function calculateTransactionEmissions(data: TransactionRequest): Promise<TransactionResponse> {
  try {
    console.log("Transaction request data:", data);
    
    // For testing purposes, if this is a localhost or development environment
    // generate some realistic test data based on the input
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      // Create realistic test data based on category and price
      const categoryMapping: Record<string, { emissionFactor: number, name: string }> = {
        "5411": { emissionFactor: 0.3, name: "Grocery purchase" },
        "5812": { emissionFactor: 0.8, name: "Restaurant dining" },
        "5541": { emissionFactor: 1.2, name: "Gas purchase" }, 
        "4111": { emissionFactor: 0.4, name: "Public transportation" },
        "5311": { emissionFactor: 0.6, name: "Department store purchase" }
      };
      
      const category = data.categoryValue;
      const categoryInfo = categoryMapping[category] || { emissionFactor: 0.5, name: "Purchase" };
      
      // Calculate emissions based on price and category
      const emissions = data.price * categoryInfo.emissionFactor / 100;
      
      // Generate similar_to examples
      const similarToExamples = [
        `Driving a car for ${(emissions * 3).toFixed(1)} miles`,
        `Charging a smartphone ${(emissions * 100).toFixed(0)} times`,
        `Using a laptop for ${(emissions * 5).toFixed(1)} hours`
      ];
      
      // Return simulated response
      return {
        transactionId: data.transactionId,
        transactionDate: data.transactionDate,
        emissions_level: emissions < 1 ? "LOW" : emissions < 5 ? "MEDIUM" : "HIGH",
        name: categoryInfo.name,
        kg_of_CO2e_emissions: emissions,
        mt_of_CO2e_emissions: emissions / 1000,
        similar_to: similarToExamples,
        modifiers: [],
        factor_version: "v1.0",
        disclaimer: "This is a simulation for demonstration purposes. Actual emissions may vary."
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-magicapi-key": API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to calculate transaction emissions");
    }

    const result = await response.json();
    console.log("Transaction API response:", result);
    return result;
  } catch (error) {
    console.error("Error calculating transaction emissions:", error);
    toast.error("Failed to calculate transaction emissions. Please try again.");
    throw error;
  }
}

export type { FlightRequest, FlightResponse, TransactionRequest, TransactionResponse };
