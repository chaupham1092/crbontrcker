
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Plane } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-5xl">
      <section className="py-12 md:py-20 text-center animate-fadeIn">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary text-primary rounded-full mb-4">
          Calculate & Understand
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
          Monitor Your Carbon Footprint
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Quantify the environmental impact of your daily activities with our precise emissions calculator.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-6"
            onClick={() => navigate("/flight")}
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto px-6"
            onClick={() => navigate("/about")}
          >
            Learn More
          </Button>
        </div>
      </section>
      
      <section className="py-12 grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 card-hover animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <div className="p-3 bg-secondary rounded-lg w-fit mb-4">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-medium mb-4">Flight Emissions Calculator</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Calculate the carbon footprint of your air travel by entering your origin and destination airports, along with the number of passengers.
          </p>
          <Button 
            onClick={() => navigate("/flight")}
            className="w-full sm:w-auto"
          >
            Calculate Flight Emissions
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 card-hover animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <div className="p-3 bg-secondary rounded-lg w-fit mb-4">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-medium mb-4">Transaction Emissions Calculator</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Measure the carbon emissions associated with your financial transactions based on merchant categories and spending amounts.
          </p>
          <Button 
            onClick={() => navigate("/transaction")}
            className="w-full sm:w-auto"
          >
            Calculate Transaction Emissions
          </Button>
        </div>
      </section>
      
      <section className="py-12 text-center">
        <h2 className="text-3xl font-semibold mb-6">Why Calculate Your Emissions?</h2>
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
      </section>
    </div>
  );
};

export default Home;
