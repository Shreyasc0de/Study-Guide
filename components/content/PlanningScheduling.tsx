import React from 'react';
import { BrainCircuit, BarChart3, CloudCog } from 'lucide-react';
import type { ContentPageProps } from '../../types';
import { CompletionButton } from '../CompletionButton';

const InfoBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-[#0D1F5B] p-6 rounded-xl shadow-md border border-pink-100 dark:border-[#1E4DB7]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 dark:hover:border-[#1E4DB7]">
      <h3 className="text-xl font-bold text-pink-700 dark:text-[#E6F3FF] mb-3">{title}</h3>
      <div className="text-gray-600 dark:text-gray-200 space-y-3">{children}</div>
    </div>
);

export const PlanningScheduling: React.FC<ContentPageProps> = (props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Planning & Scheduling 🗓️</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Effective planning and scheduling are the brains of the supply chain, ensuring that all activities are synchronized to meet customer demand efficiently. This involves forecasting, resource allocation, and creating detailed timelines.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <InfoBox title="Demand Planning & Forecasting">
            <p>The process of predicting future customer demand. It uses historical data and statistical models to make accurate predictions.</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Quantitative Methods:</strong> Uses historical data (e.g., time series, moving averages).</li>
                <li><strong>Qualitative Methods:</strong> Relies on expert opinion and market research, especially when data is limited.</li>
                <li><strong>Error Analysis:</strong> Crucial for refining models and improving forecast accuracy over time.</li>
            </ul>
        </InfoBox>

        <InfoBox title="PSI (Purchase, Sales, and Inventory) Planning">
          <p>A comprehensive strategy that aligns purchasing, sales, and inventory management to optimize stock levels and minimize costs.</p>
           <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Aligns Functions:</strong> Ensures purchasing doesn't overstock what sales can't sell.</li>
                <li><strong>Minimizes Costs:</strong> Prevents high carrying costs from excess inventory.</li>
                <li><strong>Ensures Satisfaction:</strong> Avoids stockouts, keeping customers happy.</li>
            </ul>
        </InfoBox>
      </div>

      <InfoBox title="Software and Systems for Scheduling">
        <p>Modern supply chains rely on a variety of tools to manage complexity.</p>
        <div className="grid sm:grid-cols-2 gap-4">
            <div>
                <CloudCog className="h-6 w-6 text-pink-500 dark:text-[#A3CFFF] mb-2"/>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">Spreadsheet Software (Excel, Google Sheets)</h4>
                <p className="text-sm">Flexible and easy for modeling, but can be limited for large-scale, real-time operations.</p>
            </div>
             <div>
                <BarChart3 className="h-6 w-6 text-pink-500 dark:text-[#A3CFFF] mb-2"/>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">APS & ERP Systems (SAP, Oracle)</h4>
                <p className="text-sm">Advanced systems for optimizing schedules and integrating all supply chain functions (demand, inventory, procurement) in real-time.</p>
            </div>
             <div>
                <BrainCircuit className="h-6 w-6 text-pink-500 dark:text-[#A3CFFF] mb-2"/>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">BI & Simulation Tools</h4>
                <p className="text-sm">Tools like Tableau or AnyLogic help visualize performance, identify bottlenecks, and test "what-if" scenarios without real-world risk.</p>
            </div>
        </div>
      </InfoBox>
      
       <div className="p-6 bg-green-100 dark:bg-[#4A90E2]/20 border-l-4 border-green-400 dark:border-[#A3CFFF] rounded-r-lg">
        <h4 className="font-bold text-green-800 dark:text-[#E6F3FF]">💡 Analyst's Role</h4>
        <p className="text-green-700 dark:text-gray-200">
          The analyst is central to this process. They collect and analyze data, validate material availability, choose manufacturing strategies (Lean, Agile, JIT), use quality tools (Pareto, Ishikawa charts), and balance stock levels through PSI planning. They act as the "conductors of the production orchestra."
        </p>
      </div>
      <CompletionButton {...props} />
    </div>
  );
};