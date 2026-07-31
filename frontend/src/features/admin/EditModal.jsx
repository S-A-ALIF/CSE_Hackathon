import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { toast } from 'sonner';
import ConfirmModal from '../../components/ConfirmModal';

export default function EditModal({ isOpen, onClose, data, type, onSaved }) {
  if (!isOpen || !data) return null;

  const isTeam = type === 'team';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [batchSession, setBatchSession] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.name || '');
      setEmail(data.email || '');
      setRole(data.role || 'student');
      setStudentId(data.student_id || '');
      setBatchSession(data.batch_session || '');
      setPhoneNumber(data.phone_number || '');
      setIsBanned(Boolean(data.is_banned));
      setBanReason(data.ban_reason || '');
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const executeSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    const endpoint = isTeam
      ? `${API_URL}/api/v1/admin/teams/${data.id}`
      : `${API_URL}/api/v1/admin/members/${data.id}`;

    const bodyData = isTeam
      ? { name, is_banned: isBanned, ban_reason: isBanned ? banReason : undefined }
      : {
          name,
          email,
          role,
          student_id: studentId || undefined,
          batch_session: batchSession || undefined,
          phone_number: phoneNumber || undefined,
          is_banned: isBanned,
          ban_reason: isBanned ? banReason : undefined
        };

    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(`${isTeam ? 'Team' : 'Member'} updated successfully!`);
        setShowConfirm(false);
        onSaved();
        onClose();
      } else {
        toast.error(result.message || 'Failed to update details');
      }
    } catch (err) {
      console.error('Error updating:', err);
      toast.error('Network error during save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black text-slate-900 mb-1">
          Edit {isTeam ? 'Team' : 'Member'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Modify details or adjust moderation/ban status below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              {isTeam ? 'Team Name' : 'Full Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-900 text-sm"
            />
          </div>

          {!isTeam && (
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900 text-sm"
              />
            </div>
          )}

          {!isTeam && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 1902001"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Session
                  </label>
                  <select
                    value={batchSession}
                    onChange={(e) => setBatchSession(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold text-sm bg-white"
                  >
                    <option value="" disabled>Select Session</option>
                    <option value="2020-21">2020-21</option>
                    <option value="2021-22">2021-22</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+880..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    System Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Moderation / Ban Controls */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-3 mt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isBanned}
                onChange={(e) => setIsBanned(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className="font-bold text-red-700 text-sm">
                Ban this {isTeam ? 'Team' : 'User Account'}
              </span>
            </label>

            {isBanned && (
              <div>
                <label className="block text-xs font-bold uppercase text-red-600 mb-1">
                  Reason for Ban
                </label>
                <input
                  type="text"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="e.g. Violation of rule #4 (plagiarism)"
                  className="w-full px-4 py-2 rounded-xl border border-red-300 focus:ring-2 focus:ring-red-500 font-semibold text-sm"
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-600/30"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <ConfirmModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={executeSave}
          title={`Save changes to ${isTeam ? 'Team' : 'Member'}?`}
          message={`Are you sure you want to update the information for "${name || data.email || data.name}"?`}
          confirmText="Save Changes"
          variant="info"
          requireInput={false}
        />
      </div>
    </div>
  );
}
