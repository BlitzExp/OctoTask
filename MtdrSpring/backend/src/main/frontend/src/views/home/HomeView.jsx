import { useEffect, useState } from 'react';
import { FaFile, FaChartBar, FaUsers, FaBell } from 'react-icons/fa';
import OctoPage from '../../components/layout/OctoPage';
import PodEmptyState from '../../components/layout/PodEmptyState';
import {
  fetchNumTasksAllController,
  fetchNumCompletedTasksAllController,
  fetchNumPendingTasksAllController,
  fetchNumLateTasksAllController,
} from '../../controller/analyticsController';
import { getTeamMatesController, getAllSprintsController } from '../../controller/filterController';

function HomeView({ user, onNavigate }) {
  const [stats, setStats] = useState({ total: 0, done: 0, active: 0, late: 0 });
  const [podSize, setPodSize] = useState(0);
  const [sprintName, setSprintName] = useState('—');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.teamId) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const [total, done, active, late, members, sprints] = await Promise.all([
          fetchNumTasksAllController(user.teamId),
          fetchNumCompletedTasksAllController(user.teamId),
          fetchNumPendingTasksAllController(user.teamId),
          fetchNumLateTasksAllController(user.teamId),
          getTeamMatesController(user.teamId),
          getAllSprintsController(user.teamId),
        ]);
        setStats({ total, done, active, late });
        setPodSize(members?.length ?? 0);
        const current = sprints?.[0];
        setSprintName(current?.name ?? 'Current sprint');
      } catch (error) {
        console.error('Home snapshot error:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (!user?.teamId) {
    return (
      <OctoPage user={user} title="Home base" decorVariant="home" mood="wave">
        <PodEmptyState />
      </OctoPage>
    );
  }

  const completionPct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const quickLinks = [
    {
      id: 'taskDashboard',
      icon: FaFile,
      label: 'Open the board',
      desc: 'Drag tasks across your swim lanes.',
    },
    {
      id: 'analytics',
      icon: FaChartBar,
      label: 'Check analytics',
      desc: 'See how the pod is performing.',
    },
    {
      id: 'team',
      icon: FaUsers,
      label: 'Meet your pod',
      desc: `${podSize} swimmer${podSize === 1 ? '' : 's'} on deck.`,
    },
    {
      id: 'notifications',
      icon: FaBell,
      label: 'View alerts',
      desc: stats.late > 0 ? `${stats.late} need attention` : 'All calm for now.',
    },
  ];

  return (
    <OctoPage
      user={user}
      title="Home base"
      subtitle="Your OctoBuddy command center — a quick pulse on the pod before you dive in."
      greeting={`Welcome back, ${user?.username}`}
      mood="wave"
      decorVariant="home"
    >
      {loading ? (
        <p className="octo-loading-text">Loading your pod snapshot…</p>
      ) : (
        <>
          <div className="octo-stat-grid">
            <div className="octo-stat-card octo-stat-card--accent">
              <span className="octo-stat-label">On the board</span>
              <span className="octo-stat-value">{stats.total}</span>
              <span className="octo-stat-sub">{sprintName}</span>
            </div>
            <div className="octo-stat-card">
              <span className="octo-stat-label">Shipped</span>
              <span className="octo-stat-value">{stats.done}</span>
              <span className="octo-stat-sub">{completionPct}% complete</span>
            </div>
            <div className="octo-stat-card">
              <span className="octo-stat-label">Active</span>
              <span className="octo-stat-value">{stats.active}</span>
              <span className="octo-stat-sub">Pending & in progress</span>
            </div>
            <div className="octo-stat-card">
              <span className="octo-stat-label">Overdue</span>
              <span className="octo-stat-value">{stats.late}</span>
              <span className="octo-stat-sub">Needs attention</span>
            </div>
          </div>

          <div className="octo-quick-links">
            {quickLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className="octo-quick-link"
                onClick={() => onNavigate(link.id)}
              >
                <link.icon className="octo-quick-link__icon" aria-hidden="true" />
                <span className="octo-quick-link__label">{link.label}</span>
                <span className="octo-quick-link__desc">{link.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </OctoPage>
  );
}

export default HomeView;
