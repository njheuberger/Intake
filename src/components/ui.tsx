import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function PageHeader({
  title,
  eyebrow,
  actions,
}: {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--accent-strong)]">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-normal text-white sm:text-4xl">{title}</h1>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl shadow-black/10 ${className}`}>{children}</section>;
}

export function ButtonLink({ children, className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--accent)] px-5 py-3 text-base font-semibold text-[#06110f] transition hover:bg-[var(--accent-strong)] ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({ children, className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-5 py-3 text-base font-semibold text-white transition hover:border-[var(--accent)] ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function SubmitButton({ children = "Save" }: { children?: ReactNode }) {
  return (
    <button className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--accent)] px-6 py-3 text-base font-semibold text-[#06110f] transition hover:bg-[var(--accent-strong)]">
      {children}
    </button>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] bg-black/10 p-8 text-center">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-2xl text-base leading-7 text-[var(--muted)]">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Notice({ message, tone = "success" }: { message?: string | null; tone?: "success" | "error" }) {
  if (!message) return null;
  const colors = tone === "error" ? "border-[var(--danger)] text-rose-100" : "border-[var(--accent)] text-emerald-100";
  return <div className={`mb-5 rounded-md border bg-black/20 px-4 py-3 text-sm ${colors}`}>{message}</div>;
}

export const fieldClass =
  "mt-2 min-h-12 w-full rounded-md border border-[var(--border)] bg-[#10171e] px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]";

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-200">
      {label}
      <input className={fieldClass} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder} />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 5,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-200">
      {label}
      <textarea className={fieldClass} name={name} defaultValue={defaultValue ?? ""} rows={rows} required={required} />
    </label>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  required,
  includeBlank = false,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string | null;
  required?: boolean;
  includeBlank?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-200">
      {label}
      <select className={fieldClass} name={name} defaultValue={defaultValue ?? ""} required={required}>
        {includeBlank ? <option value="">Select...</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-md border border-[var(--border)] bg-[#10171e] px-4 py-3 text-base text-slate-100">
      <input className="h-5 w-5 accent-[var(--accent)]" type="checkbox" name={name} defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}
