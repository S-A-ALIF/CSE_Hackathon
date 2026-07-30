import { useTheme } from '../contexts/ThemeContext';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const options = [
    {
      id: 'light',
      title: 'Light',
      description: 'Always use light theme',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      )
    },
    {
      id: 'dark',
      title: 'Dark',
      description: 'Always use dark theme',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )
    },
    {
      id: 'system',
      title: 'Same as Device',
      description: 'Follow system settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Appearance & Theme</h3>
        <p className="text-sm text-slate-500 mt-1">
          Customize how the application looks on your device. Choose between light mode, dark mode, or automatically match your system theme.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className={`p-2.5 rounded-xl ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}>
                  {opt.icon}
                </span>

                {isSelected && (
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    ✓
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-base">{opt.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
