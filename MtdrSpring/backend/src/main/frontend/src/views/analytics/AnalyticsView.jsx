import { useState } from 'react';
import { MdCalendarMonth, MdInsertDriveFile } from 'react-icons/md';
import './AnalyticsView.css';

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LabelList } from 'recharts';



function AnalyticsView() {

  const [timeFilter, setTimeFilter] = useState('last7days');

  const mockData = {
    totalTasks: 150,
    completedTasks: 90,
    pendingTasks: 30,
    lateTasks: 10,
    inProgressTasks: 20,

    gradePerMember: [
      { member: 'Edgar', grade: 85 },
      { member: 'Jose', grade: 78 },
      { member: 'Eloy', grade: 92 },
      { member: 'Juan', grade: 88 },
      { member: 'Diego', grade: 95 },
    ],

    tasksPerUser: [
      { member: 'Edgar', tasks: 30, completedTasks: 28, lateTasks: 0 },
      { member: 'Jose', tasks: 25, completedTasks: 10, lateTasks: 3 },
      { member: 'Eloy', tasks: 35, completedTasks: 24, lateTasks: 1 },
      { member: 'Juan', tasks: 20, completedTasks: 12, lateTasks: 5 },
      { member: 'Diego', tasks: 15, completedTasks: 9, lateTasks: 1 },
    ],

    timePerMember: [
      { member: 'Edgar', totalTime: 6 },
      { member: 'Jose', totalTime: 8 },
      { member: 'Eloy', totalTime: 4 },
      { member: 'Juan', totalTime: 7 },
      { member: 'Diego', totalTime: 5 },
    ],

    recentActivity: [
      { member: 'Edgar', action: 'Completed Task "Design Homepage"', time: '2 hours ago' },
      { member: 'Diego', action: 'Created Task "Implement Login"', time: '3 hours ago' },
      { member: 'Eloy', action: 'Updated Task "Fix Bug #123"', time: '5 hours ago' },
      { member: 'Juan', action: 'Commented on Task "Write Sprint"', time: '1 day ago' },
      { member: 'Jose', action: 'Completed Task "Deploy to Production"', time: '2 days ago' },
    ],
  }

  function getMissingAndOngoingTasks() {
    const { pendingTasks, lateTasks, inProgressTasks } = mockData;
    return pendingTasks + lateTasks + inProgressTasks;
  }

  return (
    <main className="analytics-container">
      
      <div className="analytics-dashboard">
        <div className="analytics-title-row">
          <h1 className="analytics-title">Analytics</h1>
          <div className="analytics-filter-container">
            <p className="analytics-filter-label">Time Range:</p>
            <select className="analytics-filter" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
              <option value="lastyear">Last Year</option>
            </select>
          </div>
        </div>
        <div className="analytics-mainKPI-row">
            <div className="analytics-kpi-card kpi-horizontal">
              <div className="analytics-kpi-icon-circle">
                <MdInsertDriveFile size={48} color="#FFFFFF" />
              </div>
              <div className="analytics-kpi-content">
                <span className='analytics-kpi-label'>Missing & On Going Tasks</span>
                <span className="analytics-kpi-value">{getMissingAndOngoingTasks()}</span>
              </div>
            </div>
            <div className="analytics-kpi-card kpi-horizontal">
              <div className="analytics-kpi-progress-circle">
                {/* Tamaño dinámico para el círculo de progreso */}
                {mockData.totalTasks > 0 && (
                  <RadialBarChart width={96} height={96} cx={48} cy={48} innerRadius={36} outerRadius={44} barSize={14}
                    data={[{ name: 'Completed', value: Math.round((mockData.completedTasks/mockData.totalTasks)*100), fill: '#fff' }]}
                    style={{ background: 'transparent', maxWidth: '100%', height: 'auto' }}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar 
                      minAngle={0}
                      background={{ fill: '#5c5766' }}
                      clockWise={true}
                      dataKey="value"
                      cornerRadius={44}
                      fill="#fff"
                    />
                  </RadialBarChart>
                )}
                <div className="analytics-kpi-progress-text">{mockData.totalTasks > 0 ? Math.round((mockData.completedTasks/mockData.totalTasks)*100) : 0}%</div>
              </div>
              <div className="analytics-kpi-content">
                <span className='analytics-kpi-label'>Completed Tasks</span>
                <span className="analytics-kpi-value">{mockData.completedTasks}</span>
              </div>
            </div>
            <div className="analytics-kpi-card kpi-horizontal">
              <div className="analytics-kpi-icon-circle">
                <MdCalendarMonth size={48} color="#FFFFFF" />
              </div>
              <div className="analytics-kpi-content">
                <span className='analytics-kpi-label'>Late Tasks</span>
                <span className="analytics-kpi-value">{mockData.lateTasks}</span>
              </div>
            </div>
        </div>
        <div className="analytics-charts-row">
          <div className="analytics-chart-grades">
            <h2 className="analytics-chart-title">Tasks per User</h2>
            <ResponsiveContainer width="100%" height="100%" minHeight={120}>
              <BarChart
                data={mockData.tasksPerUser.map(user => ({
                  ...user,
                  pendingTasks: user.tasks - user.completedTasks,
                  lateTasks: user.lateTasks !== undefined ? user.lateTasks : (mockData.lateTasks > 0 ? Math.floor(mockData.lateTasks / mockData.tasksPerUser.length) : 0)
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                barCategoryGap={10}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="member" stroke="#fff" tick={{ fontSize: 14 }} />
                <YAxis stroke="#fff" allowDecimals={false} tick={{ fontSize: 14 }} />
                <Tooltip cursor={{ fill: '#444', opacity: 0.2 }} contentStyle={{ background: '#222', border: 'none', color: '#fff' }} />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="completedTasks" fill="#7ed957" name="Completed" maxBarSize={32} radius={[8,8,0,0]}>
                  <LabelList dataKey="completedTasks" position="top" fill="#fff" fontSize={14} />
                </Bar>
                <Bar dataKey="pendingTasks" fill="#ff9800" name="Pending" maxBarSize={32} radius={[8,8,0,0]}>
                  <LabelList dataKey="pendingTasks" position="top" fill="#fff" fontSize={14} />
                </Bar>
                <Bar dataKey="lateTasks" fill="#c56261" name="Late" maxBarSize={32} radius={[8,8,0,0]}>
                  <LabelList dataKey="lateTasks" position="top" fill="#fff" fontSize={14} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="analytics-chart-tasks">
            <h2 className="analytics-chart-title">Hours per Member</h2>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart 
                data={mockData.timePerMember}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="member" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  cursor={{ fill: '#444', opacity: 0.2 }} 
                  contentStyle={{ background: '#222', border: 'none', color: '#fff' }} 
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="totalTime" fill="#8884d8" name="Total Hours" maxBarSize={40} radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="totalTime" position="top" fill="#fff" fontSize={14} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="analytics-activity-row">
          <div className="analytics-recent-activity">
            <div className="analytics-chart-grades">
            <h2 className="analytics-chart-title">KPI's per Member</h2>
            <ResponsiveContainer width="100%" height="100%" minHeight={120}>
              <BarChart
                data={mockData.gradePerMember}
                margin={{ top: 0, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="member" stroke="#fff" tick={{ fontSize: 14 }} />
                <YAxis stroke="#fff" domain={[0, 100]} tick={{ fontSize: 14 }} />
                <Tooltip cursor={{ fill: '#444', opacity: 0.2 }} contentStyle={{ background: '#222', border:
                   'none', color: '#fff' }} />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="grade" fill="#795be6" maxBarSize={48} name="Grade" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
          <div className="analytics-recent-activity">
            <h2 className="analytics-chart-title">Recent Activity</h2>
            <div className="analytics-activity-list">
              {mockData.recentActivity.map((activity, idx) => (
                <div key={idx} className="analytics-activity-item">
                  <span className="analytics-activity-member">{activity.member}</span>
                  <span className="analytics-activity-action">{activity.action}</span>
                  <span className="analytics-activity-time">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AnalyticsView;