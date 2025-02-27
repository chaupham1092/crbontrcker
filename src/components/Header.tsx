
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <Globe className="h-6 w-6 text-primary animate-pulse" />
          <h1 className="text-xl font-medium">Carbon Balance</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Button 
            variant="ghost" 
            className={`${location.pathname === "/" ? "bg-secondary font-medium" : ""}`}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button 
            variant="ghost" 
            className={`${location.pathname === "/flight" ? "bg-secondary font-medium" : ""}`}
            onClick={() => navigate("/flight")}
          >
            Flight Emissions
          </Button>
          <Button 
            variant="ghost" 
            className={`${location.pathname === "/transaction" ? "bg-secondary font-medium" : ""}`}
            onClick={() => navigate("/transaction")}
          >
            Transaction Emissions
          </Button>
          <Button 
            variant="ghost" 
            className={`${location.pathname === "/about" ? "bg-secondary font-medium" : ""}`}
            onClick={() => navigate("/about")}
          >
            About
          </Button>
        </nav>
        
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => document.getElementById("mobile-menu")?.classList.toggle("hidden")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div id="mobile-menu" className="hidden md:hidden absolute w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 animate-slideInRight">
        <div className="py-4 space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start rounded-none px-6 ${location.pathname === "/" ? "bg-secondary font-medium" : ""}`}
            onClick={() => {
              navigate("/");
              document.getElementById("mobile-menu")?.classList.add("hidden");
            }}
          >
            Home
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start rounded-none px-6 ${location.pathname === "/flight" ? "bg-secondary font-medium" : ""}`}
            onClick={() => {
              navigate("/flight");
              document.getElementById("mobile-menu")?.classList.add("hidden");
            }}
          >
            Flight Emissions
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start rounded-none px-6 ${location.pathname === "/transaction" ? "bg-secondary font-medium" : ""}`}
            onClick={() => {
              navigate("/transaction");
              document.getElementById("mobile-menu")?.classList.add("hidden");
            }}
          >
            Transaction Emissions
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start rounded-none px-6 ${location.pathname === "/about" ? "bg-secondary font-medium" : ""}`}
            onClick={() => {
              navigate("/about");
              document.getElementById("mobile-menu")?.classList.add("hidden");
            }}
          >
            About
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
