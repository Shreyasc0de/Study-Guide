import React, { useState } from 'react';
import { Search, Book, Lightbulb, AlertCircle } from 'lucide-react';

interface DictionaryEntry {
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
}

// Pre-populated SCM dictionary terms with AI-like comprehensive definitions
const scmDictionary: DictionaryEntry[] = [
  {
    term: "Supply Chain Management",
    definition: "The coordination and management of activities involved in sourcing, procurement, conversion, and logistics management. It encompasses the planning and management of all activities involved in sourcing, procurement, conversion, and logistics management activities.",
    category: "Fundamentals",
    relatedTerms: ["Logistics", "Procurement", "Inventory Management"]
  },
  {
    term: "Logistics",
    definition: "The detailed coordination of complex operations involving people, facilities, and supplies. In SCM, it refers to the management of the flow of goods, information, and other resources between the point of origin and point of consumption.",
    category: "Operations",
    relatedTerms: ["Transportation", "Warehousing", "Distribution"]
  },
  {
    term: "Procurement",
    definition: "The process of finding, agreeing terms, and acquiring goods, services, or works from an external source, often via a tendering or competitive bidding process. It involves strategic sourcing, supplier evaluation, and contract management.",
    category: "Sourcing",
    relatedTerms: ["Sourcing", "Vendor Management", "Contract Management"]
  },
  {
    term: "Inventory Management",
    definition: "The supervision of non-capitalized assets and stock items. It involves overseeing the constant flow of units into and out of an existing inventory, including raw materials, work-in-progress, and finished goods.",
    category: "Operations",
    relatedTerms: ["Stock Control", "Demand Forecasting", "EOQ"]
  },
  {
    term: "Just-in-Time (JIT)",
    definition: "A production strategy that strives to improve business return on investment by reducing in-process inventory and associated carrying costs. JIT focuses on continuous improvement and elimination of waste.",
    category: "Operations",
    relatedTerms: ["Lean Manufacturing", "Kanban", "Pull System"]
  },
  {
    term: "Bullwhip Effect",
    definition: "A supply chain phenomenon where small fluctuations in demand at the retail level amplify as they move up the supply chain to manufacturers and suppliers. This leads to inefficiencies and increased costs.",
    category: "Planning",
    relatedTerms: ["Demand Forecasting", "Information Sharing", "Supply Chain Visibility"]
  },
  {
    term: "Vendor Management",
    definition: "The process of developing and maintaining relationships with suppliers. It includes vendor selection, performance monitoring, contract negotiation, and risk assessment to ensure optimal supplier performance.",
    category: "Sourcing",
    relatedTerms: ["Supplier Relationship Management", "Procurement", "Risk Management"]
  },
  {
    term: "Distribution Center",
    definition: "A warehouse or other specialized building, often with refrigeration or air conditioning, which is stocked with products to be redistributed to retailers, to wholesalers, or directly to consumers.",
    category: "Logistics",
    relatedTerms: ["Warehouse", "Fulfillment Center", "Cross-docking"]
  },
  {
    term: "Economic Order Quantity (EOQ)",
    definition: "The optimal order quantity that minimizes total inventory costs, including ordering costs and carrying costs. It's a fundamental concept in inventory management that helps determine the most cost-effective quantity to order.",
    category: "Planning",
    relatedTerms: ["Inventory Management", "Reorder Point", "Safety Stock"]
  },
  {
    term: "Third-Party Logistics (3PL)",
    definition: "The use of an external company to perform logistics functions that have traditionally been performed within an organization. These functions can include warehousing, transportation, and distribution services.",
    category: "Outsourcing",
    relatedTerms: ["Fourth-Party Logistics", "Logistics Service Provider", "Outsourcing"]
  }
];

export const AIDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState<DictionaryEntry | null>(null);

  const categories = ['All', ...Array.from(new Set(scmDictionary.map(entry => entry.category)))];

  const filteredTerms = scmDictionary.filter(entry => {
    const matchesSearch = entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTermClick = (term: DictionaryEntry) => {
    setSelectedTerm(selectedTerm?.term === term.term ? null : term);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Book className="h-8 w-8 text-pink-600 dark:text-[#A3CFFF] mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">AI-Powered SCM Dictionary</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive definitions and explanations of Supply Chain Management terms, powered by AI insights.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-pink-500 dark:bg-[#1E4DB7] text-white'
                  : 'bg-gray-100 dark:bg-[#0D1F5B] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1E4DB7]/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Dictionary Terms */}
      <div className="space-y-3">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No terms found matching your search.</p>
          </div>
        ) : (
          filteredTerms.map(term => (
            <div
              key={term.term}
              className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <button
                onClick={() => handleTermClick(term)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-[#1E4DB7]/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {term.term}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-pink-100 dark:bg-[#1E4DB7]/30 text-pink-600 dark:text-[#A3CFFF] rounded-full mt-1">
                      {term.category}
                    </span>
                  </div>
                  <Lightbulb 
                    className={`h-5 w-5 transition-transform ${
                      selectedTerm?.term === term.term ? 'rotate-12 text-pink-500 dark:text-[#A3CFFF]' : 'text-gray-400'
                    }`} 
                  />
                </div>
              </button>
              
              {selectedTerm?.term === term.term && (
                <div className="px-6 pb-6 border-t border-gray-100 dark:border-[#1E4DB7]/20 bg-gray-50 dark:bg-[#1E4DB7]/5">
                  <div className="pt-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {term.definition}
                    </p>
                    
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Related Terms:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {term.relatedTerms.map(relatedTerm => (
                            <button
                              key={relatedTerm}
                              onClick={() => {
                                const foundTerm = scmDictionary.find(t => t.term === relatedTerm);
                                if (foundTerm) {
                                  setSelectedTerm(foundTerm);
                                  setSearchTerm(relatedTerm);
                                }
                              }}
                              className="px-3 py-1 text-xs bg-white dark:bg-[#0D1F5B] border border-gray-200 dark:border-[#1E4DB7]/30 rounded-full hover:bg-pink-50 dark:hover:bg-[#1E4DB7]/20 text-gray-600 dark:text-gray-300 transition-colors"
                            >
                              {relatedTerm}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* AI Disclaimer */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-[#1E4DB7]/10 rounded-lg border border-blue-200 dark:border-[#1E4DB7]/30">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-[#A3CFFF] mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-[#A3CFFF] mb-1">AI-Powered Definitions</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              These definitions are enhanced with AI insights to provide comprehensive, context-aware explanations. 
              Always verify critical information with authoritative sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};