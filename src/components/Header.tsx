
import { Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <Globe className="h-6 w-6 text-primary animate-pulse" />
          <h1 className="text-xl font-medium">Carbon Balance</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
