import OctoPage from '../../components/layout/OctoPage';
import { formatRole } from '../../utils/roles';

function ProfileView({ user, onNavigate }) {
  const initial = (user?.username || '?').charAt(0).toUpperCase();

  return (
    <OctoPage
      user={user}
      title="Your profile"
      subtitle="Account details for your OctoBuddy workspace."
      mood="curious"
      decorVariant="profile"
    >
      <div className="octo-profile-grid">
        <div className="octo-card">
          <div className="octo-card__head">
            <h2 className="octo-card__title">Account</h2>
          </div>
          <div className="octo-card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div className="octo-pod-member__avatar" style={{ width: 56, height: 56, fontSize: 'var(--font-size-lg)' }} aria-hidden="true">
                {initial}
              </div>
              <div>
                <div className="octo-pod-member__name" style={{ fontSize: 'var(--font-size-md)' }}>
                  {user?.username}
                </div>
                <div className="octo-pod-member__meta">{formatRole(user?.role)} · Octo Pod</div>
              </div>
            </div>
            <div className="octo-profile-field">
              <span className="octo-profile-field__label">Username</span>
              <span className="octo-profile-field__value">{user?.username ?? '—'}</span>
            </div>
            <div className="octo-profile-field">
              <span className="octo-profile-field__label">Email</span>
              <span className="octo-profile-field__value">{user?.email ?? '—'}</span>
            </div>
            <div className="octo-profile-field">
              <span className="octo-profile-field__label">Role</span>
              <span className="octo-profile-field__value">{formatRole(user?.role)}</span>
            </div>
            <div className="octo-profile-field">
              <span className="octo-profile-field__label">Team</span>
              <span className="octo-profile-field__value">Octo Pod</span>
            </div>
          </div>
        </div>

        <div className="octo-card">
          <div className="octo-card__head">
            <h2 className="octo-card__title">Your shortcuts</h2>
          </div>
          <div className="octo-card__body">
            <div className="octo-quick-grid">
              <button type="button" className="octo-quick-card" onClick={() => onNavigate('taskDashboard')}>
                <span className="octo-quick-card__label">My board</span>
                <span className="octo-quick-card__desc">Jump to your tasks.</span>
              </button>
              <button type="button" className="octo-quick-card" onClick={() => onNavigate('analytics')}>
                <span className="octo-quick-card__label">My stats</span>
                <span className="octo-quick-card__desc">See your sprint performance.</span>
              </button>
            </div>
            <p className="octo-quote-banner" style={{ marginTop: 'var(--space-4)' }}>
              &ldquo;Preferences and notifications settings are coming soon — OctoBuddy is still growing tentacles.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </OctoPage>
  );
}

export default ProfileView;
