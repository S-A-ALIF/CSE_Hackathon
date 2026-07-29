export default function DetailsInfoModal({ isOpen, onClose, data, type }) {
  if (!isOpen || !data) return null;

  const isTeam = type === 'team';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
            {isTeam ? '👥' : '👤'}
          </span>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {isTeam ? data.name : data.name || data.email}
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              {isTeam ? 'Team Information & Members' : 'Member Profile & Identity'}
            </p>
          </div>
        </div>

        {isTeam ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Team ID</span>
                <p className="text-sm font-mono font-semibold text-slate-800 mt-0.5 break-all">{data.id}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Created On</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {new Date(data.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Team Leader</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {data.leader_name || data.leader_email || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                <p className="text-sm font-bold mt-0.5">
                  {data.is_banned ? (
                    <span className="text-red-600">🚫 Banned ({data.ban_reason || 'No reason'})</span>
                  ) : (
                    <span className="text-emerald-600">✅ Active</span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Team Members ({data.members?.length || 0})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {data.members && data.members.length > 0 ? (
                  data.members.map((m, idx) => (
                    <div
                      key={m.id || idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {m.name || 'Unnamed Member'} {data.leader_id === m.id && '👑'}
                        </div>
                        <div className="text-xs text-slate-500">{m.email}</div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                          {m.role || 'Member'}
                        </span>
                        {m.student_id && (
                          <div className="text-[11px] text-slate-500 mt-1">ID: {m.student_id}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No members found.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Full Name</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{data.name || 'Not Provided'}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Email Address</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{data.email}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Student ID</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{data.student_id || 'N/A'}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Batch & Session</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{data.batch_session || 'N/A'}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Phone Number</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{data.phone_number || 'N/A'}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Team Affiliation</span>
                <p className="text-sm font-semibold text-blue-600 mt-0.5">{data.team_name || 'No Team'}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">System Role</span>
                <p className="text-sm font-bold uppercase mt-0.5 text-slate-800">{data.role}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Account Status</span>
                <p className="text-sm font-bold mt-0.5">
                  {data.is_banned ? (
                    <span className="text-red-600">🚫 Banned ({data.ban_reason || 'No reason'})</span>
                  ) : (
                    <span className="text-emerald-600">✅ Active</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
