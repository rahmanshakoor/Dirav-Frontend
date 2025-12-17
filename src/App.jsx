import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import Savings from './pages/Savings';
import Opportunities from './pages/Opportunities';
import AIAdvisor from './pages/AIAdvisor';
import Blogs from './pages/Blogs';
import { FinancesProvider } from './context/FinancesContext';

function App() {
  return (
    <FinancesProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="planning" element={<Planning />} />
          <Route path="savings" element={<Savings />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="advisor" element={<AIAdvisor />} />
          <Route path="blogs" element={<Blogs />} />
        </Route>
      </Routes>
    </FinancesProvider>
  );
}

export default App;
