
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-md mx-auto text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl font-medium mb-6">Page Not Found</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Button onClick={() => navigate("/")}>
          Return Home
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
