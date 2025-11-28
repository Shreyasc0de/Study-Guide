import React from 'react';
import { Landmark, ArrowRightLeft, Warehouse } from 'lucide-react';
import type { ContentPageProps } from '../../types';
import { CompletionButton } from '../CompletionButton';

const TopicCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ElementType }> = ({ title, children, icon: Icon }) => (
    <div className="bg-white dark:bg-[#0D1F5B] p-6 rounded-xl shadow-md border border-pink-100 dark:border-[#1E4DB7]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 dark:hover:border-[#1E4DB7]">
      <div className="flex items-center mb-3">
        <Icon className="h-6 w-6 text-pink-500 dark:text-[#A3CFFF] mr-3" />
        <h3 className="text-xl font-bold text-pink-700 dark:text-[#E6F3FF]">{title}</h3>
      </div>
      <div className="text-gray-600 dark:text-gray-200 space-y-3">{children}</div>
    </div>
);

export const FinanceLogistics: React.FC<ContentPageProps> = (props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Finance & Logistics 💰🚚</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Finance and logistics are two sides of the same coin in SCM. Finance focuses on managing costs, risks, and profitability, while logistics manages the efficient movement and storage of goods. When they work together, the supply chain becomes resilient and cost-effective.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <TopicCard title="Supply Chain Finance" icon={Landmark}>
            <p>A financial strategy that optimizes cash flow and strengthens buyer-supplier relationships.</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                <li><strong>Goal:</strong> A "win-win" where suppliers get paid faster and buyers improve their cash flow.</li>
                <li><strong>Key Components:</strong> Accounts payable/receivable financing and inventory financing.</li>
                <li><strong>Future Trends:</strong> Blockchain and AI are making financing more transparent, secure, and data-driven.</li>
            </ul>
        </TopicCard>

        <TopicCard title="Supply Chain Logistics" icon={Warehouse}>
          <p>The physical side of SCM, covering everything from procurement to final delivery.</p>
           <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                <li><strong>Key Components:</strong> Transportation, Warehousing, Inventory Management, and Order Fulfillment.</li>
                <li><strong>Modes of Transport:</strong> Road, rail, air, and sea—each with trade-offs in cost, speed, and capacity.</li>
                <li><strong>Inbound vs. Outbound:</strong> Managing the flow of goods into your facilities vs. out to your customers.</li>
            </ul>
        </TopicCard>
      </div>
      
      <TopicCard title="Where Finance & Logistics Meet" icon={ArrowRightLeft}>
          <p>The collaboration between these two areas is critical for success.</p>
           <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Resource Optimization:</strong> Balancing financial budgets with logistical needs to ensure maximum efficiency. For example, choosing a cheaper shipping mode that still meets delivery deadlines.</li>
                <li><strong>Cost Control:</strong> Systematically managing costs across procurement, production, and distribution to improve margins. This includes tracking KPIs like total logistics cost, inventory turns, and cost per unit.</li>
                <li><strong>Risk Mitigation:</strong> Financial analysts assess risks (e.g., supplier bankruptcy, currency fluctuations), while logistics analysts mitigate operational risks (e.g., shipping delays, port congestion).</li>
            </ul>
      </TopicCard>

       <div className="p-6 bg-green-100 dark:bg-[#4A90E2]/20 border-l-4 border-green-400 dark:border-[#A3CFFF] rounded-r-lg">
        <h4 className="font-bold text-green-800 dark:text-[#E6F3FF]">💡 Analyst's Role</h4>
        <p className="text-green-700 dark:text-gray-200">
          A <strong>finance-focused analyst</strong> works with numbers: costs, risks, and profitability. A <strong>logistics-focused analyst</strong> focuses on operations: transportation, warehousing, and efficiency. Both roles must collaborate to run simulations, optimize warehouses, plan transport, and align logistics with demand, ensuring the supply chain is both affordable and deliverable.
        </p>
      </div>
      <CompletionButton {...props} />
    </div>
  );
};