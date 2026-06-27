export function Card({ children, className = '' }) {
  return <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 ${className}`}>{children}</div>;
}

export function Button({ children, className = '', variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-primary text-white hover:bg-primaryDark',
    emergency: 'bg-emergency text-white hover:bg-red-700',
    light: '!bg-white !text-primary border border-white shadow-lg hover:!bg-blue-50 hover:!text-primaryDark',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-700',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
  };
  return (
    <button {...props} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Field({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <input {...props} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none ring-primary/20 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
    </label>
  );
}

export function TextArea({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <textarea {...props} className="min-h-28 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none ring-primary/20 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
    </label>
  );
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <select {...props} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none ring-primary/20 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
        {children}
      </select>
    </label>
  );
}

export function Alert({ children, type = 'info' }) {
  const color = type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-800';
  return <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${color}`}>{children}</div>;
}
