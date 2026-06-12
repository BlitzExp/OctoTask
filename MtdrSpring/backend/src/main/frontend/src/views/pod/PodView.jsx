import { useEffect, useState } from 'react';
import OctoPage from '../../components/layout/OctoPage';
import PodEmptyState from '../../components/layout/PodEmptyState';
import { getTeamMatesController } from '../../controller/filterController';
import { fetchTeamTasksCon, getAllTasks } from '../../controller/tasksViewController';
import { isPrivileged } from '../../utils/roles';

function PodView({ user }) {
  const [members, setMembers] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.teamId) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const team = await getTeamMatesController(user.teamId);
        setMembers(team || []);

        let tasks = [];
        if (isPrivileged(user)) {
          tasks = await fetchTeamTasksCon(user.teamId);
        } else {
          tasks = await getAllTasks(user.id);
        }

        const counts = {};
        for (const task of tasks) {
          const key = String(task.userId);
          counts[key] = (counts[key] || 0) + 1;
        }
        setTaskCounts(counts);
      } catch (error) {
        console.error('Pod view error:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const isYou = (name) => name === user?.username;

  if (!user?.teamId) {
    return (
      <OctoPage user={user} title="Your pod" decorVariant="pod" mood="chill">
        <PodEmptyState />
      </OctoPage>
    );
  }

  return (
    <OctoPage
      user={user}
      title="Your pod"
      subtitle="The crew you ship with. OctoBuddy keeps everyone swimming in sync."
      mood="chill"
      decorVariant="pod"
    >
      <p className="octo-quote-banner">
        &ldquo;A great sprint starts with a pod that trusts each other.&rdquo;
      </p>

      {loading ? (
        <p className="octo-loading-text">Loading pod members…</p>
      ) : (
        <div className="octo-card">
          <div className="octo-card__head">
            <h2 className="octo-card__title">{members.length} pod member{members.length === 1 ? '' : 's'}</h2>
          </div>
          <div className="octo-card__body">
            <div className="octo-pod-grid">
              {members.map((member) => {
                const initial = (member.name || '?').charAt(0).toUpperCase();
                const tasks = taskCounts[String(member.id)] ?? 0;
                return (
                  <div key={member.id} className="octo-pod-member">
                    <div className="octo-pod-member__avatar" aria-hidden="true">
                      {initial}
                    </div>
                    <div>
                      <div className="octo-pod-member__name">
                        {member.name}
                        {isYou(member.name) && ' (you)'}
                      </div>
                      <div className="octo-pod-member__meta">
                        {tasks} task{tasks === 1 ? '' : 's'} on the board
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="octo-card">
        <div className="octo-card__head">
          <h2 className="octo-card__title">Pod tips from OctoBuddy</h2>
        </div>
        <div className="octo-card__body">
          <ul className="octo-tip-list">
            <li>Balance workload — check Analytics to see who&apos;s carrying the most.</li>
            <li>Drag overdue tasks on the board to update status in one move.</li>
            <li>Use filters on the board to narrow the swim to one developer.</li>
          </ul>
        </div>
      </div>
    </OctoPage>
  );
}

export default PodView;
