import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Boxes,
  CalendarClock,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  FileStack,
  Gauge,
  HardHat,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Settings2,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navigation = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard, active: true },
  { label: "Equipment", href: "#equipment", icon: Boxes },
  { label: "Certificates", href: "#certificates", icon: BadgeCheck },
  { label: "Documents", href: "#documents", icon: FileStack },
  { label: "Inspections", href: "#inspections", icon: ClipboardCheck },
  { label: "Maintenance", href: "#maintenance", icon: Wrench },
];

const equipment = [
  {
    identifier: "EQ-00428",
    name: "Hydraulic roof bolter",
    site: "North shaft",
    certificate: "MCC-2024-0841",
    status: "In service",
    tone: "green",
    updated: "Today, 09:42",
    initials: "HR",
    color: "lime",
  },
  {
    identifier: "EQ-00391",
    name: "Flameproof motor, 45 kW",
    site: "Plant 02",
    certificate: "MCC-2023-0198",
    status: "Review due",
    tone: "amber",
    updated: "Yesterday",
    initials: "FM",
    color: "blue",
  },
  {
    identifier: "EQ-00376",
    name: "Underground personnel carrier",
    site: "West decline",
    certificate: "MCC-2025-0103",
    status: "In service",
    tone: "green",
    updated: "10 Nov, 14:18",
    initials: "PC",
    color: "orange",
  },
  {
    identifier: "EQ-00344",
    name: "Gas detection controller",
    site: "Section 4",
    certificate: "MCC-2022-0627",
    status: "Action needed",
    tone: "red",
    updated: "08 Nov, 11:06",
    initials: "GD",
    color: "violet",
  },
] as const;

const upcoming = [
  {
    day: "18",
    month: "NOV",
    title: "Flameproof motor, 45 kW",
    detail: "Certificate review · EQ-00391",
    tone: "amber",
  },
  {
    day: "21",
    month: "NOV",
    title: "Roof bolter inspection",
    detail: "Routine inspection · EQ-00428",
    tone: "green",
  },
  {
    day: "26",
    month: "NOV",
    title: "Personnel carrier service",
    detail: "Scheduled maintenance · EQ-00376",
    tone: "blue",
  },
] as const;

const activity = [
  {
    icon: FileStack,
    title: "Technical file updated",
    detail: "Hydraulic roof bolter · Rev 03",
    time: "09:42",
    color: "green",
  },
  {
    icon: BadgeCheck,
    title: "Certificate linked",
    detail: "Personnel carrier · MCC-2025-0103",
    time: "Yesterday",
    color: "blue",
  },
  {
    icon: ClipboardCheck,
    title: "Inspection recorded",
    detail: "Gas detection controller · EQ-00344",
    time: "10 Nov",
    color: "orange",
  },
] as const;

function BrandMark() {
  return (
    <div className="brand-lockup" aria-label="MineCert">
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="brand-name">
        mine<span>cert</span>
      </span>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="brand-link" href="#overview" aria-label="MineCert overview">
        <BrandMark />
      </a>

      <div
        className="workspace-switcher"
        role="group"
        aria-label="Current workspace: Demo Mining Group"
      >
        <span className="workspace-monogram">MM</span>
        <span className="workspace-copy">
          <span className="workspace-label">WORKSPACE</span>
          <span className="workspace-name">Demo Mining Group</span>
        </span>
        <ChevronDown size={15} strokeWidth={1.8} />
      </div>

      <div className="nav-section-label">WORKSPACE</div>
      <nav className="primary-nav" aria-label="Main navigation">
        {navigation.map(({ label, href, icon: Icon, active }) => (
          <a
            className={`nav-link${active ? " nav-link-active" : ""}`}
            href={href}
            key={label}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {label === "Inspections" && <span className="nav-count">3</span>}
          </a>
        ))}
      </nav>

      <div className="nav-section-label nav-section-spaced">INSIGHTS</div>
      <nav className="primary-nav" aria-label="Insights navigation">
        <a className="nav-link" href="#compliance">
          <Gauge size={18} strokeWidth={1.8} />
          <span>Compliance</span>
        </a>
        <a className="nav-link" href="#activity">
          <ShieldCheck size={18} strokeWidth={1.8} />
          <span>Audit trail</span>
        </a>
      </nav>

      <div className="sidebar-spacer" />

      <a className="help-card" href="#planned-modules">
        <span className="help-icon">
          <LifeBuoy size={17} />
        </span>
        <span>
          <strong>Platform roadmap</strong>
          <small>See upcoming capabilities</small>
        </span>
        <ArrowUpRight size={14} className="help-arrow" />
      </a>

      <div className="sidebar-footer">
        <span className="avatar avatar-sidebar">TM</span>
        <span className="user-copy">
          <strong>Alex Dlamini</strong>
          <small>Workspace admin</small>
        </span>
        <Settings2 size={17} strokeWidth={1.8} />
      </div>
    </aside>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  changeTone,
  footnote,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  changeTone: "positive" | "neutral" | "warning";
  footnote: string;
  accent: string;
}) {
  return (
    <article className="metric-card">
      <div className="metric-topline">
        <span className={`metric-icon ${accent}`}>
          <Icon size={18} strokeWidth={1.8} />
        </span>
        <span className={`metric-change ${changeTone}`}>
          {changeTone === "positive" ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}
          {change}
        </span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-footnote">{footnote}</div>
    </article>
  );
}

function StatusBadge({ status, tone }: { status: string; tone: string }) {
  return (
    <span className={`status-badge ${tone}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export default function Home() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>Overview</strong>
          </div>
          <div className="topbar-actions">
            <span className="environment-tag">
              <span className="environment-dot" />
              DEMO WORKSPACE
            </span>
            <button className="icon-button search-button" type="button" aria-label="Search (coming soon)" disabled>
              <Search size={18} strokeWidth={1.8} />
              <span className="search-shortcut">⌘ K</span>
            </button>
            <button className="icon-button notification-button" type="button" aria-label="Notifications (coming soon)" disabled>
              <Bell size={18} strokeWidth={1.8} />
              <span className="notification-dot" />
            </button>
            <span className="avatar avatar-topbar" aria-label="Alex Dlamini">
              TM
            </span>
          </div>
        </header>

        <main className="dashboard" id="overview">
          <div className="demo-notice">
            <span className="demo-notice-icon">
              <CircleHelp size={15} />
            </span>
            <span>
              <strong>Preview workspace</strong>
              <span className="demo-notice-copy">
                You&apos;re viewing illustrative sample data. No live records are connected.
              </span>
            </span>
            <a href="#planned-modules">
              What&apos;s next <ArrowRight size={14} />
            </a>
          </div>

          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                WEDNESDAY, 11 NOVEMBER
              </div>
              <h1>Good morning, Alex<span>.</span></h1>
              <p className="welcome-subtitle">
                Here&apos;s the latest across your equipment and certification records.
              </p>
            </div>
            <a className="primary-button" href="#planned-modules">
              <ArrowRight size={16} strokeWidth={2} />
              Explore the roadmap
            </a>
          </section>

          <section className="metrics-grid" aria-label="Workspace snapshot">
            <MetricCard
              icon={Boxes}
              label="Equipment tracked"
              value="1,284"
              change="+8.2%"
              changeTone="positive"
              footnote="vs. previous quarter"
              accent="metric-lime"
            />
            <MetricCard
              icon={FileStack}
              label="Technical documents"
              value="3,642"
              change="+12.4%"
              changeTone="positive"
              footnote="across all equipment"
              accent="metric-blue"
            />
            <MetricCard
              icon={BadgeCheck}
              label="Active certificates"
              value="976"
              change="94.6%"
              changeTone="positive"
              footnote="of linked equipment"
              accent="metric-violet"
            />
            <MetricCard
              icon={CalendarClock}
              label="Attention required"
              value="12"
              change="4 overdue"
              changeTone="warning"
              footnote="inspections & reviews"
              accent="metric-orange"
            />
          </section>

          <div className="content-grid">
            <section className="panel equipment-panel" id="equipment">
              <div className="panel-header">
                <div>
                  <div className="panel-kicker">ASSET REGISTER</div>
                  <h2>Equipment overview</h2>
                  <p className="panel-description">
                    A snapshot of recently updated equipment records.
                  </p>
                </div>
                <a className="text-link" href="#planned-modules">
                  View register <ArrowRight size={15} />
                </a>
              </div>

              <div className="table-scroll">
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th scope="col">EQUIPMENT</th>
                      <th scope="col">CERTIFICATE</th>
                      <th scope="col">STATUS</th>
                      <th scope="col">LAST UPDATED</th>
                      <th scope="col"><span className="sr-only">Open</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map((item) => (
                      <tr key={item.identifier}>
                        <td>
                          <div className="equipment-cell">
                            <span className={`equipment-avatar ${item.color}`}>
                              {item.initials}
                            </span>
                            <span className="equipment-copy">
                              <strong>{item.name}</strong>
                              <span>{item.identifier} <i /> {item.site}</span>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="certificate-number">{item.certificate}</span>
                        </td>
                        <td><StatusBadge status={item.status} tone={item.tone} /></td>
                        <td><span className="updated-time">{item.updated}</span></td>
                        <td>
                          <a
                            className="row-link"
                            href="#planned-modules"
                            aria-label={`Open ${item.name}`}
                          >
                            <ArrowUpRight size={15} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <span>Showing 4 of 1,284 sample records</span>
                <a href="#planned-modules">See all equipment <ArrowRight size={14} /></a>
              </div>
            </section>

            <aside className="right-rail">
              <section className="panel schedule-panel" id="certificates">
                <div className="panel-header compact">
                  <div>
                    <div className="panel-kicker">UP NEXT</div>
                    <h2>Upcoming reviews</h2>
                  </div>
                  <a className="round-link" href="#planned-modules" aria-label="View all reviews">
                    <ArrowUpRight size={15} />
                  </a>
                </div>
                <div className="schedule-list">
                  {upcoming.map((item) => (
                    <div className="schedule-item" key={item.title}>
                      <div className={`date-tile ${item.tone}`}>
                        <strong>{item.day}</strong>
                        <span>{item.month}</span>
                      </div>
                      <div className="schedule-copy">
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </div>
                      <ArrowUpRight size={14} className="schedule-arrow" />
                    </div>
                  ))}
                </div>
                <a className="panel-bottom-link" href="#planned-modules">
                  Open calendar <ArrowRight size={14} />
                </a>
              </section>

              <section className="panel activity-panel" id="activity">
                <div className="panel-header compact">
                  <div>
                    <div className="panel-kicker">RECENT CHANGES</div>
                    <h2>Activity</h2>
                  </div>
                  <span className="activity-live">
                    <span />
                    SAMPLE
                  </span>
                </div>
                <div className="activity-list">
                  {activity.map(({ icon: Icon, title, detail, time, color }) => (
                    <div className="activity-item" key={title}>
                      <span className={`activity-icon ${color}`}>
                        <Icon size={15} strokeWidth={1.8} />
                      </span>
                      <div className="activity-copy">
                        <strong>{title}</strong>
                        <span>{detail}</span>
                      </div>
                      <time>{time}</time>
                    </div>
                  ))}
                </div>
                <a className="panel-bottom-link" href="#planned-modules">
                  View activity log <ArrowRight size={14} />
                </a>
              </section>
            </aside>
          </div>

          <section className="next-steps-panel" id="planned-modules">
            <div className="next-steps-mark">
              <HardHat size={21} strokeWidth={1.7} />
            </div>
            <div className="next-steps-copy">
              <span className="panel-kicker">BUILT FOR THE FULL LIFECYCLE</span>
              <h2>Your operational workspace is taking shape.</h2>
              <p>
                Equipment registration, document control, certificate workflows,
                and inspections are the next capabilities on the roadmap.
              </p>
            </div>
            <span className="roadmap-label">
              FOUNDATION IN PROGRESS <span />
            </span>
            <span id="documents" className="anchor-target" />
            <span id="inspections" className="anchor-target" />
            <span id="maintenance" className="anchor-target" />
            <span id="compliance" className="anchor-target" />
          </section>

          <footer className="dashboard-footer">
            <span>MineCert <i /> A clearer view of equipment assurance.</span>
            <span>South Africa <i /> v0.1 foundation</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
