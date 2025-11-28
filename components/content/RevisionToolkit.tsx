import React, { useState } from 'react';
import { HelpCircle, ListChecks, ChevronDown, ChevronUp } from 'lucide-react';

const glossaryTerms = {
    'SCM (Supply Chain Management)': 'The management of the flow of goods, services, and information, from origin to consumption.',
    'Logistics': 'The process of planning and executing the efficient transportation and storage of goods from the point of origin to the point of consumption.',
    'Procurement': 'The process of finding and agreeing to terms, and acquiring goods, services, or works from an external source.',
    'EOQ (Economic Order Quantity)': 'A formula used to determine the optimal order quantity that a company should purchase to minimize inventory costs such as holding costs, shortage costs, and order costs.',
    'JIT (Just-in-Time)': 'An inventory management strategy to increase efficiency and decrease waste by receiving goods only as they are needed in the production process.',
    'KPI (Key Performance Indicator)': 'A measurable value that demonstrates how effectively a company is achieving key business objectives.',
    'ERP (Enterprise Resource Planning)': 'A type of software that organizations use to manage day-to-day business activities such as accounting, procurement, project management, and manufacturing.',
    'PSI (Purchase, Sales, and Inventory) Planning': 'A strategy to align purchasing, sales, and inventory management to optimize stock levels and minimize costs.',
    'Lean Manufacturing': 'A production method aimed primarily at reducing times within the production system as well as response times from suppliers and to customers.',
    'Agile Supply Chain': 'Focuses on responsiveness and flexibility to meet the changing needs of customers. Best for volatile markets.',
};

const practiceQuestions = [
    {
        question: "What are the five core functions of a supply chain?",
        answer: "Logistics, Procurement, Manufacturing, Inventory Planning, and Customer Service."
    },
    {
        question: "What is the primary goal of Supply Chain Finance (SCF)?",
        answer: "To create a 'win-win' situation by optimizing cash flow for both buyers and suppliers, allowing suppliers to be paid earlier while buyers can extend payment terms."
    },
    {
        question: "What is the difference between a 'Lean' and 'Agile' supply chain strategy?",
        answer: "A 'Lean' strategy focuses on efficiency and cost reduction, best for stable, predictable demand. An 'Agile' strategy focuses on flexibility and responsiveness, best for volatile markets with unpredictable demand."
    },
    {
        question: "Why is cybersecurity a critical concern in modern SCM?",
        answer: "Because supply chains rely heavily on interconnected digital systems (ERP, cloud services). A single weak vendor or breach can create huge vulnerabilities, disrupting operations and compromising sensitive data."
    },
     {
        question: "Name two quantitative and two qualitative forecasting methods.",
        answer: "Quantitative: Time Series Analysis, Moving Average. Qualitative: Expert Opinion, Market Research/Surveys."
    },
];

const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-pink-200 dark:border-[#1E4DB7]/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left font-semibold text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-[#A3CFFF] transition-colors"
            >
                <span>{title}</span>
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {isOpen && <div className="pb-4 text-gray-600 dark:text-gray-300">{children}</div>}
        </div>
    );
}

export const RevisionToolkit: React.FC = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Revision Toolkit 🛠️</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                Use these tools to solidify your knowledge and prepare for exams. Review key terms and test yourself with common questions.
            </p>

            <div className="bg-white dark:bg-[#0D1F5B] p-6 rounded-xl shadow-md border border-pink-100 dark:border-[#1E4DB7]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 dark:hover:border-[#1E4DB7]">
                <div className="flex items-center mb-4">
                    <ListChecks className="h-8 w-8 text-pink-500 dark:text-[#A3CFFF] mr-4" />
                    <h3 className="text-2xl font-bold text-pink-700 dark:text-[#E6F3FF]">Glossary of Key Terms</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(glossaryTerms).map(([term, definition]) => (
                        <div key={term}>
                            <h4 className="font-bold text-gray-800 dark:text-gray-100">{term}</h4>
                            <p className="text-gray-600 dark:text-gray-200 text-sm">{definition}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-[#0D1F5B] p-6 rounded-xl shadow-md border border-pink-100 dark:border-[#1E4DB7]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 dark:hover:border-[#1E4DB7]">
                <div className="flex items-center mb-4">
                    <HelpCircle className="h-8 w-8 text-pink-500 dark:text-[#A3CFFF] mr-4" />
                    <h3 className="text-2xl font-bold text-pink-700 dark:text-[#E6F3FF]">Practice Questions</h3>
                </div>
                 <div className="space-y-2">
                    {practiceQuestions.map((q, index) => (
                        <AccordionItem key={index} title={q.question}>
                            <p className="pt-2 border-t border-pink-100 dark:border-[#1E4DB7]/50">{q.answer}</p>
                        </AccordionItem>
                    ))}
                </div>
            </div>
        </div>
    );
};