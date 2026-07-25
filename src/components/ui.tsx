import Link from "next/link";
import { Icon } from "./Icon";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";

const buttonClasses: Record<ButtonVariant, string> = {
  primary: "primary-btn",
  secondary: "secondary-btn",
  ghost: "ghost-btn",
  danger: "danger-btn",
  icon: "icon-btn",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`${buttonClasses[variant]} ${className}`.trim()} {...props} />;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return <header className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</header>;
}
export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <div className="section-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}
export function VerifiedBadge({ children = "Verified NEXXA Supplier" }: { children?: React.ReactNode }) { return <span className="verified-badge"><Icon name="check" size={12}/>{children}</span>; }
export function EmptyState({ icon = "package", title, description, actionLabel, href }: { icon?: "package"|"cart"|"store"|"headset"; title: string; description: string; actionLabel?: string; href?: string }) { return <div className="empty-state"><span><Icon name={icon}/></span><h2>{title}</h2><p>{description}</p>{actionLabel && href && <Link href={href} className="primary-btn">{actionLabel}</Link>}</div>; }
