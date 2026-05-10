import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";

type PanelProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}>;

export function Panel({
  actions,
  children,
  className,
  subtitle,
  title,
}: PanelProps) {
  return (
    <section className={clsx("panel", className)}>
      <header className="panel__header">
        <div>
          <p className="eyebrow">Recovered surface</p>
          <h2>{title}</h2>
          {subtitle ? <p className="panel__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="panel__actions">{actions}</div> : null}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  );
}
