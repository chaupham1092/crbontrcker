
import { toast } from "sonner";

const API_BASE_URL = "https://api.magicapi.dev/api/v1/connectearth/connect";
const API_KEY = "cm7440ae70001jv035vpcchux"; // This is a public API key from the docs

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

    return await response.json();
  } catch (error) {
    console.error("Error calculating flight emissions:", error);
    toast.error("Failed to calculate flight emissions. Please try again.");
    throw error;
  }
}

export async function calculateTransactionEmissions(data: TransactionRequest): Promise<TransactionResponse> {
  try {
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

    return await response.json();
  } catch (error) {
    console.error("Error calculating transaction emissions:", error);
    toast.error("Failed to calculate transaction emissions. Please try again.");
    throw error;
  }
}

export type { FlightRequest, FlightResponse, TransactionRequest, TransactionResponse };
