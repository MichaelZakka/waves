import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Panel } from "@/components/admin/Fields/Fields";
import { CleanupUnused, PageChecks, StatusIcon } from "@/components/admin/health/HealthWidgets";
import LocalTime from "@/components/admin/LocalTime";
import { requireAdmin } from "@/lib/auth";
import { formatBytes, getHealthReport, summarise, type Check } from "@/lib/health";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Website health" };

function CheckList({ checks }: { checks: Check[] }) {
  return (
    <ul className={styles.checks}>
      {checks.map((check) => (
        <li key={check.label} className={styles.check}>
          <StatusIcon severity={check.severity} />
          <span className={styles.checkLabel}>{check.label}</span>
          <span className={styles.checkValue}>
            {check.value}
            {check.at && (
              <>
                {" "}
                <LocalTime iso={check.at} />
              </>
            )}
            {check.detail && <span className={styles.detail}>{check.detail}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function HealthPage() {
  await requireAdmin();
  const report = await getHealthReport();
  const { problems, warnings } = summarise(report);
  const overall = problems ? "problem" : warnings ? "warning" : "ok";

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Website health</h1>
        <p className={styles.intro}>
          Checks on the pages, content, storage and security. Reload this page to run them again.
        </p>
      </header>

      <div className={styles.banner} data-severity={overall} role="status">
        <StatusIcon severity={overall} />
        <p>
          {overall === "ok"
            ? "Everything looks good."
            : [
                problems && `${problems} problem${problems === 1 ? "" : "s"} to fix`,
                warnings && `${warnings} thing${warnings === 1 ? "" : "s"} worth a look`,
              ]
                .filter(Boolean)
                .join(" and ") + "."}
        </p>
      </div>

      <Panel title="Pages" description="Each public page is requested from the server, the way a visitor's browser would.">
        <PageChecks />
      </Panel>

      <Panel
        title="Content"
        description="Missing photos, image descriptions and texts that visitors would notice."
      >
        {report.content.length === 0 ? (
          <p className={styles.empty}>No content issues found.</p>
        ) : (
          <ul className={styles.issues}>
            {report.content.map((issue, index) => (
              <li key={index} className={styles.issue}>
                <StatusIcon severity={issue.severity} />
                <span className={styles.issueText}>
                  <span className={styles.issueWhere}>{issue.where}</span>
                  {issue.message}
                </span>
                <Link href={issue.href} className={styles.fix}>
                  Fix
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Storage" description="Where edited content and uploaded images are saved.">
        <CheckList checks={report.storage} />
        <CleanupUnused count={report.unusedUploads.count} size={formatBytes(report.unusedUploads.bytes)} />
      </Panel>

      <Panel title="Security">
        <CheckList checks={report.security} />
      </Panel>

      <Panel title="Server">
        <CheckList checks={report.server} />
      </Panel>
    </div>
  );
}
