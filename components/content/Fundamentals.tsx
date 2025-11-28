import React from 'react';
import { Zap, Truck, Package, Users, Handshake, RefreshCw } from 'lucide-react';
import type { ContentPageProps } from '../../types';
import { CompletionButton } from '../CompletionButton';

const Card: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-[#0D1F5B] p-6 rounded-xl shadow-md border border-pink-100 dark:border-[#1E4DB7]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 dark:hover:border-[#1E4DB7]">
    <div className="flex items-center mb-3">
      <Icon className="h-6 w-6 text-pink-500 dark:text-[#A3CFFF] mr-3" />
      <h3 className="text-xl font-bold text-pink-700 dark:text-[#E6F3FF]">{title}</h3>
    </div>
    <div className="text-gray-600 dark:text-gray-200 space-y-2">{children}</div>
  </div>
);

export const Fundamentals: React.FC<ContentPageProps> = (props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">SCM Fundamentals 📖</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Supply Chain Management (SCM) is the process of managing the entire flow of goods, services, and information—from the initial sourcing of raw materials to the delivery of the final product to the customer. It's about getting the right product to the right place, at the right time, in the right quantity, and at the right cost.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Logistics" icon={Truck}>
          <p>The backbone of SCM. It involves the planning, implementation, and control of the efficient, effective forward and reverse flow and storage of goods and services.</p>
        </Card>
        <Card title="Procurement" icon={Handshake}>
          <p>The act of sourcing and acquiring goods and services. Focuses on cost savings, quality control, and risk reduction from suppliers.</p>
        </Card>
        <Card title="Manufacturing" icon={Zap}>
          <p>The process of converting raw materials into finished goods. Key goals are waste reduction, efficiency, and responsiveness to demand.</p>
        </Card>
        <Card title="Inventory Planning" icon={Package}>
          <p>Balancing customer demand with working capital. It involves forecasting demand and deciding how much inventory to keep at various points in the chain.</p>
        </Card>
        <Card title="Warehousing" icon={Package}>
            <p>The storage of goods. Efficient warehousing helps reduce delays, prevent stockouts, and manage distribution smoothly.</p>
        </Card>
        <Card title="Customer Service" icon={Users}>
          <p>The final, crucial link. Ensuring customer loyalty and satisfaction through on-time delivery, order accuracy, and effective problem resolution.</p>
        </Card>
      </div>

      <div className="p-6 bg-blue-100 dark:bg-[#1E4DB7]/20 border-l-4 border-blue-400 dark:border-[#4A90E2] rounded-r-lg">
        <h4 className="font-bold text-blue-800 dark:text-[#E6F3FF]">📌 Key Takeaway</h4>
        <p className="text-blue-700 dark:text-gray-200">
          A successful supply chain connects suppliers, manufacturers, logistics providers, and customers in a seamless network. It's vulnerable to disruptions like natural disasters or political issues, making resilience a key goal for modern SCM.
        </p>
      </div>

       <div className="p-6 bg-green-100 dark:bg-[#4A90E2]/20 border-l-4 border-green-400 dark:border-[#A3CFFF] rounded-r-lg">
        <h4 className="font-bold text-green-800 dark:text-[#E6F3FF]">💡 Analyst's Role</h4>
        <p className="text-green-700 dark:text-gray-200">
          A supply chain analyst collaborates with all these teams. They analyze performance, forecast demand, manage risks, and support continuous improvement to make the entire supply chain more efficient and effective.
        </p>
      </div>
       <CompletionButton {...props} />
    </div>
  );
};