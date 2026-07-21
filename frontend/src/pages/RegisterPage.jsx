import { Link } from 'react-router-dom';

const ParticipantFields = ({ title, showBatchId = true }) => (
  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
    <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
        <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jane Doe" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
        <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="jane@university.edu" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
        <input type="tel" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+880..." />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">T-Shirt Size</label>
        <select className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
          <option>XXL</option>
        </select>
      </div>
      {showBatchId && (
        <>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Batch</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 20th" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Student ID</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1234567" />
          </div>
        </>
      )}
    </div>
  </div>
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Link to="/" className="text-2xl font-black text-slate-900 tracking-tighter hover:opacity-80 transition-opacity">
            GSTU<span className="text-blue-500">Hackethon</span>
          </Link>
          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Register Your Team
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Form your squad and get ready to build the future.
          </p>
        </div>

        <form className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          
          {/* Team Info */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b-2 border-blue-500 inline-block pb-1">Team Details</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Team Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-lg" placeholder="e.g. The Innovators" />
            </div>
          </div>

          {/* Participants */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-blue-500 inline-block pb-1">Team Members</h3>
            <ParticipantFields title="Participant 1 (Team Leader)" />
            <ParticipantFields title="Participant 2" />
            <ParticipantFields title="Participant 3" />
          </div>

          {/* Supervisor */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-blue-500 inline-block pb-1">Supervisor</h3>
            <ParticipantFields title="Faculty Supervisor" showBatchId={false} />
          </div>

          <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all text-xl">
            Submit Registration
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
