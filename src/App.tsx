import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ProductProvider } from "@/contexts/ProductContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserOrders from "./pages/UserOrders";
import CreateProduct from "./pages/CreateProduct";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(()=>{
    window.scrollTo({top:0,behavior:'smooth'})
  },[])

  return(
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductProvider>
        <CartProvider>
          <AdminProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin/user-orders" element={<UserOrders />} />
                <Route path="/admin/create-product" element={<CreateProduct />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdminProvider>
        </CartProvider>
      </ProductProvider>
    </TooltipProvider>
  </QueryClientProvider>
)
}

export default App;
