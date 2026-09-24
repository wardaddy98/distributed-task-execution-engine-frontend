const baseClassName =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50';

const variantClassNames = {
  primary: {
    normal: 'border-transparent bg-sky-500 text-slate-950 enabled:hover:bg-sky-400',
    outlined: 'border-sky-400 text-sky-300 enabled:hover:bg-sky-400/10',
    text: 'border-transparent text-sky-300 enabled:hover:bg-sky-400/10',
  },
  secondary: {
    normal: 'border-transparent bg-slate-700 text-slate-100 enabled:hover:bg-slate-600',
    outlined: 'border-slate-500 text-slate-200 enabled:hover:bg-slate-700/60',
    text: 'border-transparent text-slate-300 enabled:hover:bg-slate-700/60',
  },
};

const Button = ({
  color = 'primary',
  variant = 'normal',
  type = 'button',
  className = '',
  children,
  ...props
}) => (
  <button
    type={type}
    className={`${baseClassName} ${variantClassNames[color][variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
