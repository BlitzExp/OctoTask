import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import OctoPage from '../../components/layout/OctoPage';
import PodEmptyState from '../../components/layout/PodEmptyState';
import OctoMascot from '../../components/brand/OctoMascot';
import { fetchTeamTasksCon, getAllTasks } from '../../controller/tasksViewController';
import {
  fetchNumLateTasksAllController,
  fetchNumPendingTasksAllController,
} from '../../controller/analyticsController';
import { isPrivileged } from '../../utils/roles';

function Notifications({ user }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.teamId) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        let tasks = [];
        if (isPrivileged(user)) {
          tasks = await fetchTeamTasksCon(user.teamId);
        } else {
          tasks = await getAllTasks(user.id);
        }

        const [lateCount, activeCount] = await Promise.all([
          fetchNumLateTasksAllController(user.teamId),
          fetchNumPendingTasksAllController(user.teamId),
        ]);

        const items = [];

        const lateTasks = tasks.filter((t) => t.getStateLabel() === 'Late');
        for (const task of lateTasks.slice(0, 5)) {
          items.push({
            type: 'late',
            icon: FaExclamationTriangle,
            title: `Overdue: ${task.name}`,
            text: `${task.userName ?? 'Someone'} — needs attention on the board.`,
          });
        }

        if (lateCount > lateTasks.length) {
          items.push({
            type: 'late',
            icon: FaExclamationTriangle,
            title: `${lateCount - lateTasks.length} more overdue task${lateCount - lateTasks.length === 1 ? '' : 's'}`,
            text: 'Open the board to review everything in the Late column.',
          });
        }

        if (activeCount > 0) {
          items.push({
            type: 'info',
            icon: FaInfoCircle,
            title: `${activeCount} active task${activeCount === 1 ? '' : 's'} in the pod`,
            text: 'Pending and in-progress work is swimming along.',
          });
        }

        const doneCount = tasks.filter((t) => t.getStateLabel() === 'Done').length;
        if (doneCount > 0) {
          items.push({
            type: 'info',
            icon: FaCheckCircle,
            title: `${doneCount} task${doneCount === 1 ? '' : 's'} shipped`,
            text: 'Nice work — OctoBuddy celebrates every completion.',
          });
        }

        if (items.length === 0) {
          items.push({
            type: 'info',
            icon: FaInfoCircle,
            title: 'All quiet in the deep',
            text: 'OctoBuddy will surface alerts here when something needs your attention.',
          });
        }

        setAlerts(items);
      } catch (error) {
        console.error('Alerts error:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (!user?.teamId) {
    return (
      <OctoPage user={user} title="Alerts" decorVariant="alerts" mood="busy">
        <PodEmptyState />
      </OctoPage>
    );
  }

  return (
    <OctoPage
      user={user}
      title="Alerts"
      subtitle="What OctoBuddy thinks needs your eyes right now."
      mood="busy"
      decorVariant="alerts"
    >
      {loading ? (
        <div className="octo-card">
          <div className="octo-card__body" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <OctoMascot mood="curious" size={48} />
            <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}>Scanning the waters…</p>
          </div>
        </div>
      ) : (
        <div className="octo-alert-list">
          {alerts.map((alert, idx) => {
            const Icon = alert.icon;
            return (
              <div
                key={idx}
                className={`octo-alert-item octo-alert-item--${alert.type}`}
              >
                <Icon className="octo-alert-item__icon" size={16} aria-hidden="true" />
                <div>
                  <p className="octo-alert-item__title">{alert.title}</p>
                  <p className="octo-alert-item__text">{alert.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </OctoPage>
  );
}

export default Notifications;
