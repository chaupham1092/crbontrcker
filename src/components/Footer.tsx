
import { Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Globe className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm">Carbon Balance © {new Date().getFullYear()}</span>
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-500">
            <p>All calculations are for informational purposes only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
