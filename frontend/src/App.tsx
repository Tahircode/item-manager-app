import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import ViewItems from "./pages/ViewItems";
import AddItem from "./pages/AddItem";
import { AnimatePresence, motion } from "framer-motion";

const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <ViewItems />
            </AnimatedPage>
          }
        />
        <Route
          path="/add"
          element={
            <AnimatedPage>
              <AddItem />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-50">
        {/* Navbar */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Item Manager App</h1>
            <nav className="flex space-x-6">
              <Link
                to="/"
                className="text-gray-700 relative group hover:text-blue-600 transition-colors duration-200"
              >
                View Items
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/add"
                className="text-gray-700 relative group hover:text-blue-600 transition-colors duration-200"
              >
                Add Item
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow px-4 py-6">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}
