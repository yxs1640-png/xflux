import { getMonitorAlertsForUser } from "@/lib/monitor-alerts";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { MonitorAlertsBanner } from "./monitor-alerts-banner";

export async function MonitorAlertsBannerSlot() {
  const session = await requireDashboardSession();
  const alerts = await getMonitorAlertsForUser(session.user.id);

  return (
    <MonitorAlertsBanner
      initialUnreadCount={alerts.unreadCount}
      initialHits={alerts.hits.map((h) => ({
        id: h.id,
        text: h.text,
        authorUsername: h.authorUsername,
        targetUsername: h.targetUsername,
        detectedAt: h.detectedAt.toISOString(),
      }))}
      canWebhook={alerts.canWebhook}
    />
  );
}
