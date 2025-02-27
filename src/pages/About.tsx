
import { Globe, Leaf, LineChart } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-12 animate-fadeIn">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary text-primary rounded-full mb-4">
          About Our Service
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">Understanding Carbon Footprints</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Learn how our carbon calculator works and why tracking emissions is important for environmental sustainability.
        </p>
      </div>

      <div className="grid gap-12">
        <section className="animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-secondary rounded-md mr-3">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-medium">How It Works</h2>
          </div>
          
          <div className="pl-10 space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Our calculator uses Connect Earth's API to provide accurate calculations of carbon emissions for various activities:
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <span className="mr-2">•</span>
                <span><strong>Flight Emissions:</strong> Calculates CO₂ emissions based on origin, destination, and passenger count.</span>
              </li>
              <li className="flex">
                <span className="mr-2">•</span>
                <span><strong>Transaction Emissions:</strong> Estimates the carbon impact of purchases based on merchant category, price, and location.</span>
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              The calculations take into account factors such as distance traveled, fuel efficiency, and industry-specific emissions data to provide the most accurate estimates possible.
            </p>
          </div>
        </section>
        
        <section className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-secondary rounded-md mr-3">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-medium">Why Track Your Carbon Footprint?</h2>
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
        
        <section className="animate-slideUp" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-secondary rounded-md mr-3">
              <LineChart className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-medium">Our Data Sources</h2>
          </div>
          
          <div className="pl-10 space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              This calculator is powered by Connect Earth's API, which uses a combination of industry-standard calculation methodologies and data sources:
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <span className="mr-2">•</span>
                <span><strong>Flight Emissions:</strong> Based on ICAO and IATA data on aircraft fuel efficiency, flight routes, and load factors.</span>
              </li>
              <li className="flex">
                <span className="mr-2">•</span>
                <span><strong>Transaction Emissions:</strong> Calculated using environmentally-extended input-output (EEIO) models that map spending categories to emissions.</span>
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              <strong>Disclaimer:</strong> All calculations are estimates based on available data and should be used for informational purposes only. The actual environmental impact may vary.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
