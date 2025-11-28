import React from 'react';
import { Lock, Leaf } from 'lucide-react';
import type { ContentPageProps } from '../../types';
import { CompletionButton } from '../CompletionButton';

const SectionCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-[#0D1F5B] p-6 rounded-xl shadow-md border border-pink-100 dark:border-[#1E4DB7]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 dark:hover:border-[#1E4DB7]">
        <div className="flex items-center mb-4">
            <Icon className="h-8 w-8 text-pink-500 dark:text-[#A3CFFF] mr-4" />
            <h3 className="text-2xl font-bold text-pink-700 dark:text-[#E6F3FF]">{title}</h3>
        </div>
        <div className="text-gray-600 dark:text-gray-200 space-y-4">{children}</div>
    </div>
);


export const SecuritySustainability: React.FC<ContentPageProps> = (props) => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Security & Sustainability 🔐🌱</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                Modern supply chains must be not only efficient but also secure and responsible. Security protects assets, data, and operations from threats, while sustainability ensures that business practices are environmentally, socially, and economically viable for the long term.
            </p>

            <SectionCard title="Supply Chain Security" icon={Lock}>
                <p>Security involves practices and policies that safeguard the integrity, resilience, and reliability of the supply chain. It's about protecting the flow of goods, information, and resources from origin to consumption.</p>
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Key Areas:</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Physical Security:</strong> Protecting facilities, goods, and warehouses from theft, damage, or unauthorized access.</li>
                        <li><strong>Cybersecurity:</strong> Safeguarding ERP systems, databases, and digital communications from breaches. This is critical, as 98% of organizations have experienced a breach via their supply chain.</li>
                        <li><strong>Risk Assessment:</strong> Continuously identifying vulnerabilities (e.g., supplier weaknesses, geopolitical events) and planning mitigation strategies.</li>
                    </ul>
                </div>
            </SectionCard>

            <SectionCard title="Supply Chain Sustainability" icon={Leaf}>
                <p>Sustainability means conducting business in a way that balances environmental, social, and economic goals. It's not just about "being green"—it's about long-term resilience and responsibility.</p>
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">The Three Pillars:</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Environmental:</strong> Reducing carbon emissions, minimizing waste, and using resources efficiently (e.g., optimizing transport routes, using recyclable packaging).</li>
                        <li><strong>Social:</strong> Ensuring fair labor practices, ethical sourcing, and safe working conditions across the entire supply chain.</li>
                        <li><strong>Economic:</strong> Driving efficiency and lowering costs to ensure long-term profitability and viability.</li>
                    </ul>
                </div>
            </SectionCard>
            
            <div className="p-6 bg-green-100 dark:bg-[#4A90E2]/20 border-l-4 border-green-400 dark:border-[#A3CFFF] rounded-r-lg">
                <h4 className="font-bold text-green-800 dark:text-[#E6F3FF]">💡 Analyst's Role: The Guardian of Resilience</h4>
                <p className="text-green-700 dark:text-gray-200">
                    The supply chain analyst is a key player in both areas. They conduct risk assessments, track compliance, and help design protection strategies. For sustainability, they use data to measure KPIs (like carbon footprint), benchmark against industry standards, perform lifecycle assessments of products, and use predictive analytics to model the impact of sustainable initiatives. They are the bridge between innovation and execution, ensuring the supply chain is both safe and responsible.
                </p>
            </div>
            <CompletionButton {...props} />
        </div>
    );
};