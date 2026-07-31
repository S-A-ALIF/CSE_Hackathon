import React, { useState } from 'react';

const FAQS = [
  {
    question: "How do I join or create a team?",
    answer: "Navigate to the 'Team' tab on the left sidebar. From there, you can either create a new team and share your team code, join an existing team using a code provided by your leader, or accept a team invitation directly from your Notifications menu (bell icon)."
  },
  {
    question: "How do I manage my team?",
    answer: "If you are the team leader, you can use the 'Manage Team' option in the Team tab to send invitations, remove members, or edit the team name. Remember that teams must meet the minimum size limit before the registration deadline!"
  },
  {
    question: "When will the problem statements be revealed?",
    answer: "The problem statements remain locked until the hackathon officially starts. Keep an eye on the countdown on the landing page!"
  },
  {
    question: "How do I submit my project?",
    answer: "Once the workspace is opened by the administrators, you can navigate to the 'Workspace' tab to link your GitHub repository and submit your final project details."
  },
  {
    question: "Can I change my team after registering?",
    answer: "You can leave your team and join another one at any time before the registration window closes. After registration closes, team compositions are locked."
  },
  {
    question: "Who can I contact for technical support?",
    answer: "If you encounter any bugs or need technical support, please reach out to the hackathon administration or volunteers present at the venue."
  }
];

export default function QnAPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Q&A / Help Center</h1>
        <p className="text-slate-500 mt-2">
          Find answers to the most common questions about participating in the hackathon.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
            >
              <span className="font-semibold text-slate-800 pr-4">{faq.question}</span>
              <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
            >
              <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed border-t border-slate-50 mx-6">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
