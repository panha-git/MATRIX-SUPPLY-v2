import Link from "next/link";
import { Icon } from "./Icon";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return <header className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</header>;
}
export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <div className="section-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <div className={`card ${className}`}>{children}</div>; }
export function StatCard({ label, value, detail }: { label: string; value: React.ReactNode; detail?: string }) { return <Card className="stat-card"><p>{label}</p><strong>{value}</strong>{detail && <span>{detail}</span>}</Card>; }
export function VerifiedBadge({ children = "Verified Cambodian Supplier" }: { children?: React.ReactNode }) { return <span className="verified-badge"><Icon name="check" size={12}/>{children}</span>; }
export function StatusBadge({ status }: { status: string }) { return <span className={`status-badge status-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>; }
export function EmptyState({ icon = "package", title, description, actionLabel, href }: { icon?: "package"|"cart"|"store"|"headset"; title: string; description: string; actionLabel?: string; href?: string }) { return <div className="empty-state"><span><Icon name={icon}/></span><h2>{title}</h2><p>{description}</p>{actionLabel && href && <Link href={href} className="primary-btn">{actionLabel}</Link>}</div>; }
export function LoadingState({ label = "Loading marketplace information…" }: { label?: string }) { return <div className="loading-state"><i/><p>{label}</p></div>; }
export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) { return <section className="form-section"><div><h2>{title}</h2>{description && <p>{description}</p>}</div><div className="form-grid">{children}</div></section>; }
