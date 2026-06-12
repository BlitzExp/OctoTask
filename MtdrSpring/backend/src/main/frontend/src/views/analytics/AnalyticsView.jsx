import { useEffect, useMemo, useState } from 'react';
import { FaClipboardList, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './AnalyticsView.css';
import OctoMascot from '../../components/brand/OctoMascot';
import DeveloperMultiFilter from '../../components/analytics/DeveloperMultiFilter';
import OctoBuddyDecor from '../../components/brand/OctoBuddyDecor';

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LabelList } from 'recharts';

import {
  chartColors,
  chartPalette,
  chartTooltipStyle,
  chartLegendStyle,
  chartGridProps,
  chartCursorStyle,
  chartRadialTrack,
} from '../../theme/charts';
import { getAllSprintsController, getTeamMatesController } from '../../controller/filterController';
import { fetchNumTasksSprintController, fetchNumTasksAllController 
  , fetchNumCompletedTasksSprintController, fetchNumCompletedTasksAllController,
  fetchNumPendingTasksSprintController, fetchNumPendingTasksAllController,
  fetchNumLateTasksAllController, fetchNumLateTasksSprintController,
  fetchMembersStatus, fetchWorkHours, fetchAVGTasksPerMemberController,
  fetchAVGHours, fetchCompletedTasksByMemberPerSprintController, calculateKPI, calculateKPIAVG,
  fetchWorkHoursByMemberPerSprintController
} from '../../controller/analyticsController';
import { isPrivileged as isPrivilegedUser } from '../../utils/roles';

function isDeveloperFilterActive(selectedIds, optionCount) {
  return selectedIds.length > 0 && selectedIds.length < optionCount;
}

function filterRowsByMembers(rows, memberNames) {
  if (!memberNames?.length || !Array.isArray(rows)) {
    return rows ?? [];
  }
  const allowed = new Set(memberNames);
  return rows.filter((row) => allowed.has(row?.user_name));
}

function filterKpiByMembers(rows, memberNames) {
  if (!memberNames?.length || !Array.isArray(rows)) {
    return rows ?? [];
  }
  const allowed = new Set(memberNames);
  return rows.filter((row) => allowed.has(row?.member));
}

function filterSprintChartByMembers(chartData, memberNames) {
  if (!memberNames?.length) {
    return chartData;
  }
  const allowed = new Set(memberNames);
  return {
    data: chartData.data,
    members: chartData.members.filter((name) => allowed.has(name)),
  };
}

function aggregateSprintKpis(rows) {
  const totals = (rows ?? []).reduce(
    (acc, row) => {
      acc.numCompletedTasks += Number(row?.completed_tasks) || 0;
      acc.numPendingTasks += Number(row?.pending_tasks) || 0;
      acc.numLateTasks += Number(row?.late_tasks) || 0;
      return acc;
    },
    { numCompletedTasks: 0, numPendingTasks: 0, numLateTasks: 0 },
  );
  totals.numTotalTasks =
    totals.numCompletedTasks + totals.numPendingTasks + totals.numLateTasks;
  return totals;
}

function aggregateAllSprintsKpis(rows) {
  const totals = (rows ?? []).reduce(
    (acc, row) => {
      acc.numCompletedTasks += Number(row?.avg_completed_tasks) || 0;
      acc.numPendingTasks += Number(row?.avg_pending_tasks) || 0;
      acc.numLateTasks += Number(row?.avg_late_tasks) || 0;
      return acc;
    },
    { numCompletedTasks: 0, numPendingTasks: 0, numLateTasks: 0 },
  );
  return {
    numCompletedTasks: Math.round(totals.numCompletedTasks),
    numPendingTasks: Math.round(totals.numPendingTasks),
    numLateTasks: Math.round(totals.numLateTasks),
    numTotalTasks: Math.round(
      totals.numCompletedTasks + totals.numPendingTasks + totals.numLateTasks,
    ),
  };
}

function formatDeveloperFilterLabel(selectedNames) {
  if (!selectedNames?.length) {
    return 'All pod';
  }
  if (selectedNames.length === 1) {
    return selectedNames[0];
  }
  if (selectedNames.length <= 3) {
    return selectedNames.join(', ');
  }
  return `${selectedNames.length} developers`;
}

function AnalyticsView({ user }) {
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedDeveloperIds, setSelectedDeveloperIds] = useState([]);


  const [numLateTasks, setNumLateTasks] = useState(0);
  const [numPendingTasks, setNumPendingTasks] = useState(0);
  const [numCompletedTasks, setNumCompletedTasks] = useState(0);
  const [numTotalTasks, setNumTotalTasks] = useState(0);

  const [membersStatus, setMembersStatus] = useState([]);
  const [workHours, setWorkHours ] = useState([]);
  const [avgTasksPerMember, setAvgTasksPerMember ] = useState([]);

  const [completedByMemberPerSprint, setCompletedByMemberPerSprint] = useState([]);
  const [workHoursByMemberPerSprint, setWorkHoursByMemberPerSprint] = useState([]);

  const [kpiGrades, setKpiGrades] = useState([]);

  const completedPerSprintChart = useMemo(() => {
    const rows = Array.isArray(completedByMemberPerSprint) ? completedByMemberPerSprint : [];
    const membersSet = new Set();
    const sprintOrder = [];
    const bySprint = new Map();

    for (const row of rows) {
      const rawSprintName = row?.sprint_name;
      const sprintName = rawSprintName != null ? String(rawSprintName).trim() : '';
      const sprintId = row?.sprint_id;
      let sprintLabel = sprintName;
      if (!sprintLabel && sprintId != null) sprintLabel = String(sprintId);
      if (sprintLabel && !/^sprint\s+/i.test(sprintLabel)) sprintLabel = `Sprint ${sprintLabel}`;
      if (!sprintLabel) sprintLabel = 'Sprint';

      const memberName = typeof row?.user_name === 'string' ? row.user_name.trim() : '';
      if (!memberName) continue;

      membersSet.add(memberName);

      if (!bySprint.has(sprintLabel)) {
        bySprint.set(sprintLabel, { sprint: sprintLabel });
        sprintOrder.push(sprintLabel);
      }

      const sprintRow = bySprint.get(sprintLabel);
      sprintRow[memberName] = Number(row?.completed_tasks) || 0;
    }

    return {
      data: sprintOrder.map((key) => bySprint.get(key)),
      members: Array.from(membersSet).sort((a, b) => a.localeCompare(b)),
    };
  }, [completedByMemberPerSprint]);

  const workHoursPerSprintChart = useMemo(() => {
    const rows = Array.isArray(workHoursByMemberPerSprint) ? workHoursByMemberPerSprint : [];
    const membersSet = new Set();
    const sprintOrder = [];
    const bySprint = new Map();

    for (const row of rows) {
      const rawSprintName = row?.sprint_name;
      const sprintName = rawSprintName != null ? String(rawSprintName).trim() : '';
      const sprintId = row?.sprint_id;
      let sprintLabel = sprintName;
      if (!sprintLabel && sprintId != null) sprintLabel = String(sprintId);
      if (sprintLabel && !/^sprint\s+/i.test(sprintLabel)) sprintLabel = `Sprint ${sprintLabel}`;
      if (!sprintLabel) sprintLabel = 'Sprint';

      const memberName = typeof row?.user_name === 'string' ? row.user_name.trim() : '';
      if (!memberName) continue;

      membersSet.add(memberName);

      if (!bySprint.has(sprintLabel)) {
        bySprint.set(sprintLabel, { sprint: sprintLabel });
        sprintOrder.push(sprintLabel);
      }

      const sprintRow = bySprint.get(sprintLabel);
      sprintRow[memberName] = Number(row?.total_work_hours) || 0;
    }

    return {
      data: sprintOrder.map((key) => bySprint.get(key)),
      members: Array.from(membersSet).sort((a, b) => a.localeCompare(b)),
    };
  }, [workHoursByMemberPerSprint]);

  useEffect(() => {
    async function fetchSprints() {
      try {
        const sprintsData = await getAllSprintsController(user.teamId);
        const sprintsWithAll = [...sprintsData, { id: 'allsprints', name: 'All Sprints' }];
        setSprints(sprintsWithAll);

        const initialSprintId = sprintsData.length > 0 ? sprintsData[0].id : 'allsprints';
        setSelectedSprint(initialSprintId);
        fetchDataForSprint(initialSprintId);
      } catch (error) {
        console.error('Error fetching sprints:', error);
      }
    }
    fetchSprints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.teamId]);

  useEffect(() => {
    async function fetchMembers() {
      if (!user?.teamId) {
        return;
      }
      try {
        const members = await getTeamMatesController(user.teamId);
        setTeamMembers(members || []);
        if (isPrivilegedUser(user)) {
          setSelectedDeveloperIds((members || []).map((member) => String(member.id)));
        } else {
          setSelectedDeveloperIds([String(user.id)]);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    }
    fetchMembers();
  }, [user]);

  const developerOptions = isPrivilegedUser(user)
    ? teamMembers
    : teamMembers.filter((member) => Number(member.id) === Number(user?.id));

  const isFilteringDevelopers = isDeveloperFilterActive(
    selectedDeveloperIds,
    developerOptions.length,
  );

  const selectedDeveloperNames = useMemo(() => {
    if (!isFilteringDevelopers) {
      return null;
    }
    const selected = new Set(selectedDeveloperIds.map(String));
    return developerOptions
      .filter((member) => selected.has(String(member.id)))
      .map((member) => member.name);
  }, [developerOptions, isFilteringDevelopers, selectedDeveloperIds]);

  const filteredMembersStatus = useMemo(
    () => filterRowsByMembers(membersStatus, selectedDeveloperNames),
    [membersStatus, selectedDeveloperNames],
  );

  const filteredWorkHours = useMemo(
    () => filterRowsByMembers(workHours, selectedDeveloperNames),
    [workHours, selectedDeveloperNames],
  );

  const filteredKpiGrades = useMemo(
    () => filterKpiByMembers(kpiGrades, selectedDeveloperNames),
    [kpiGrades, selectedDeveloperNames],
  );

  const filteredCompletedPerSprintChart = useMemo(
    () => filterSprintChartByMembers(completedPerSprintChart, selectedDeveloperNames),
    [completedPerSprintChart, selectedDeveloperNames],
  );

  const filteredWorkHoursPerSprintChart = useMemo(
    () => filterSprintChartByMembers(workHoursPerSprintChart, selectedDeveloperNames),
    [workHoursPerSprintChart, selectedDeveloperNames],
  );

  const displayKpis = useMemo(() => {
    if (!isFilteringDevelopers) {
      return {
        numLateTasks,
        numPendingTasks,
        numCompletedTasks,
        numTotalTasks,
      };
    }

    if (selectedSprint === 'allsprints') {
      const rows = filterRowsByMembers(avgTasksPerMember, selectedDeveloperNames);
      return aggregateAllSprintsKpis(rows);
    }

    const rows = filterRowsByMembers(membersStatus, selectedDeveloperNames);
    return aggregateSprintKpis(rows);
  }, [
    isFilteringDevelopers,
    selectedDeveloperNames,
    selectedSprint,
    numLateTasks,
    numPendingTasks,
    numCompletedTasks,
    numTotalTasks,
    avgTasksPerMember,
    membersStatus,
  ]);


  async function fetchDataForSprint(sprintId) {
    try {
      if (sprintId === 'allsprints') {
        const totalTasks = await fetchNumTasksAllController(user.teamId);
        const completedTasks = await fetchNumCompletedTasksAllController(user.teamId);
        const pendingTasks = await fetchNumPendingTasksAllController(user.teamId);
        const lateTasks = await fetchNumLateTasksAllController(user.teamId);
        const avgTasksPerMember = await fetchAVGTasksPerMemberController(user.teamId);
        const avgHoursPerMember = await fetchAVGHours(user.teamId);

        const completedByMemberPerSprint = await fetchCompletedTasksByMemberPerSprintController(user.teamId);
        const workHoursByMemberPerSprint = await fetchWorkHoursByMemberPerSprintController(user.teamId);

         const kpiGrades = calculateKPIAVG(avgTasksPerMember, avgHoursPerMember);


        setNumTotalTasks(totalTasks);
        setNumCompletedTasks(completedTasks);
        setNumPendingTasks(pendingTasks);
        setNumLateTasks(lateTasks);

        setMembersStatus([]);
        setWorkHours([]);
        setAvgTasksPerMember(avgTasksPerMember);
        setKpiGrades(kpiGrades);
        setCompletedByMemberPerSprint(completedByMemberPerSprint);
        setWorkHoursByMemberPerSprint(workHoursByMemberPerSprint);
      } else {
        const totalTasks = await fetchNumTasksSprintController(user.teamId, sprintId);
        const completedTasks = await fetchNumCompletedTasksSprintController(user.teamId, sprintId);
        const pendingTasks = await fetchNumPendingTasksSprintController(user.teamId, sprintId);
        const lateTasks = await fetchNumLateTasksSprintController(user.teamId, sprintId);
        const membersStatus = await fetchMembersStatus(user.teamId, sprintId);
        const workHours = await fetchWorkHours(user.teamId, sprintId);

        const kpiGrades = calculateKPI(membersStatus, workHours);

        setNumTotalTasks(totalTasks);
        setNumCompletedTasks(completedTasks);
        setNumPendingTasks(pendingTasks);
        setNumLateTasks(lateTasks);


        
        setAvgTasksPerMember([]);
        setMembersStatus(membersStatus);
        setWorkHours(workHours);
        setKpiGrades(kpiGrades);
        setCompletedByMemberPerSprint([]);
        setWorkHoursByMemberPerSprint([]);
      }
    } catch (error) {
      console.error('Error fetching data for sprint:', error);
    }
  }

  async function handleSprintChange(e) {
    const sprintId = e.target.value;
    setSelectedSprint(sprintId);
    await fetchDataForSprint(sprintId);
  }

  const completionPct = displayKpis.numTotalTasks > 0
    ? Math.round((displayKpis.numCompletedTasks / displayKpis.numTotalTasks) * 100)
    : 0;

  const selectedSprintName = sprints.find((s) => String(s.id) === String(selectedSprint))?.name
    ?? 'Sprint';

  const developerFilterLabel = formatDeveloperFilterLabel(selectedDeveloperNames);

  return (
    <main className="analytics-container">
      <OctoBuddyDecor variant="analytics" />
      <div className="analytics-dashboard">
        {user?.username && (
          <p className="octobuddy-page-greeting">How your pod is swimming this sprint.</p>
        )}
        <div className="analytics-title-row">
          <h1 className="analytics-title">Analytics</h1>
          <div className="analytics-filters">
            <div className="analytics-filter-container">
              <p className="analytics-filter-label">Sprint</p>
              <select
                className="analytics-filter"
                value={selectedSprint ?? ''}
                onChange={handleSprintChange}
                aria-label="Select sprint"
              >
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="analytics-filter-container analytics-filter-container--developers">
              <DeveloperMultiFilter
                options={developerOptions}
                selectedIds={selectedDeveloperIds}
                onChange={setSelectedDeveloperIds}
                disabled={!isPrivilegedUser(user) && developerOptions.length <= 1}
              />
            </div>
          </div>
        </div>

        <div className="analytics-mainKPI-row">
          <div className="analytics-kpi-card analytics-kpi-card--pending">
            <div className="analytics-kpi-icon-circle">
              <FaClipboardList size={22} aria-hidden="true" />
            </div>
            <div className="analytics-kpi-content">
              <span className="analytics-kpi-label">Active tasks</span>
              <span className="analytics-kpi-value">{displayKpis.numPendingTasks}</span>
              <p className="analytics-kpi-sub">Pending & in progress</p>
            </div>
          </div>

          <div className="analytics-kpi-card analytics-kpi-card--completed">
            <div className="analytics-kpi-progress-circle">
              {displayKpis.numTotalTasks > 0 && (
                <RadialBarChart
                  width={72}
                  height={72}
                  cx={36}
                  cy={36}
                  innerRadius={26}
                  outerRadius={34}
                  barSize={10}
                  data={[{ name: 'Completed', value: completionPct, fill: chartColors.completed }]}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    minAngle={0}
                    background={{ fill: chartRadialTrack }}
                    clockWise
                    dataKey="value"
                    cornerRadius={34}
                    fill={chartColors.completed}
                  />
                </RadialBarChart>
              )}
              <div className="analytics-kpi-progress-text">{completionPct}%</div>
            </div>
            <div className="analytics-kpi-content">
              <span className="analytics-kpi-label">Completed</span>
              <span className="analytics-kpi-value">{displayKpis.numCompletedTasks}</span>
              <p className="analytics-kpi-sub">of {displayKpis.numTotalTasks} total</p>
            </div>
          </div>

          <div className="analytics-kpi-card analytics-kpi-card--late">
            <div className="analytics-kpi-icon-circle">
              <FaExclamationTriangle size={20} aria-hidden="true" />
            </div>
            <div className="analytics-kpi-content">
              <span className="analytics-kpi-label">Overdue</span>
              <span className="analytics-kpi-value">{displayKpis.numLateTasks}</span>
              <p className="analytics-kpi-sub">Needs attention</p>
            </div>
          </div>
        </div>

        <div className={`analytics-charts-row${selectedSprint === 'allsprints' ? ' analytics-charts-row-allsprints' : ''}`}>
          <div className="analytics-chart-card">
            <div className="analytics-chart-card__head">
              <h2 className="analytics-chart-title">
                {selectedSprint !== 'allsprints' ? 'Tasks per member' : 'Completed by sprint'}
              </h2>
              <span className="analytics-chart-card__badge">
                {selectedSprintName} · {developerFilterLabel}
              </span>
            </div>
            <div className="analytics-chart-card__body">
            {selectedSprint !== 'allsprints' ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                  <BarChart
                    data={filteredMembersStatus.map((member) => ({
                      member: member.user_name,
                      completedTasks: member.completed_tasks,
                      pendingTasks: member.pending_tasks,
                      lateTasks: member.late_tasks,
                    }))}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    barCategoryGap={10}
                    barGap={0}
                  >
                    <CartesianGrid {...chartGridProps} />
                    <XAxis dataKey="member" stroke={chartColors.axis} tick={{ fontSize: 14 }} />
                    <YAxis stroke={chartColors.axis} allowDecimals={false} tick={{ fontSize: 14 }} />
                    <Tooltip
                      cursor={chartCursorStyle}
                      contentStyle={chartTooltipStyle}
                    />
                    <Legend wrapperStyle={chartLegendStyle} />
                    <Bar
                      dataKey="completedTasks"
                      fill={chartColors.completed}
                      name="Completed"
                      radius={[8, 8, 0, 0]}
                    >
                      <LabelList dataKey="completedTasks" position="top" fill={chartColors.axis} fontSize={14} />
                    </Bar>
                    <Bar
                      dataKey="pendingTasks"
                      fill={chartColors.pending}
                      name="Pending"
                      radius={[8, 8, 0, 0]}
                    >
                      <LabelList dataKey="pendingTasks" position="top" fill={chartColors.axis} fontSize={14} />
                    </Bar>
                    <Bar
                      dataKey="lateTasks"
                      fill={chartColors.late}
                      name="Late"
                      radius={[8, 8, 0, 0]}
                    >
                      <LabelList dataKey="lateTasks" position="top" fill={chartColors.axis} fontSize={14} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                  <BarChart
                    data={filteredCompletedPerSprintChart.data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    barCategoryGap={10}
                    barGap={0}
                  >
                    <CartesianGrid {...chartGridProps} />
                    <XAxis
                      dataKey="sprint"
                      stroke={chartColors.axis}
                      tick={{ fontSize: 14 }}
                      label={{ value: 'Sprint Number', position: 'insideBottom', offset: -2, fill: chartColors.axis }}
                    />
                    <YAxis
                      stroke={chartColors.axis}
                      allowDecimals={false}
                      tick={{ fontSize: 14 }}
                      label={{
                        value: 'Completed tasks',
                        angle: -90,
                        position: 'insideLeft',
                        fill: chartColors.axis,
                        style: { textAnchor: 'middle', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 },
                      }}
                    />
                    <Tooltip
                      cursor={chartCursorStyle}
                      contentStyle={chartTooltipStyle}
                    />
                    <Legend wrapperStyle={chartLegendStyle} />
                    {(() => {
                      const palette = chartPalette;
                      return filteredCompletedPerSprintChart.members.map((member, idx) => (
                        <Bar
                          key={member}
                          dataKey={member}
                          fill={palette[idx % palette.length]}
                          name={member}
                          radius={[8, 8, 0, 0]}
                        >
                          <LabelList dataKey={member} position="top" fill={chartColors.axis} fontSize={14} />
                        </Bar>
                      ));
                    })()}
                  </BarChart>
                </ResponsiveContainer>
            )}
            </div>
          </div>

          <div className="analytics-chart-card">
            <div className="analytics-chart-card__head">
              <h2 className="analytics-chart-title">
                {selectedSprint !== 'allsprints' ? 'Hours per member' : 'Hours by sprint'}
              </h2>
              <span className="analytics-chart-card__badge">
                <FaCheckCircle size={10} style={{ marginRight: 4, verticalAlign: -1 }} aria-hidden="true" />
                Workload
              </span>
            </div>
            <div className="analytics-chart-card__body">
             {selectedSprint !== 'allsprints' ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                  <BarChart 
                    data={filteredWorkHours.map((member) => ({
                      member: member.user_name,
                      totalTime: member.total_work_hours,
                    }))}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid {...chartGridProps} />
                    <XAxis dataKey="member" stroke={chartColors.axis} />
                    <YAxis stroke={chartColors.axis} />
                    <Tooltip 
                      cursor={chartCursorStyle} 
                      contentStyle={chartTooltipStyle} 
                    />
                    <Legend wrapperStyle={chartLegendStyle} />
                    <Bar dataKey="totalTime" fill={chartColors.hours} name="Total Hours" maxBarSize={40} radius={[8, 8, 0, 0]}>
                      <LabelList dataKey="totalTime" position="top" fill={chartColors.axis} fontSize={14} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                  <BarChart
                    data={filteredWorkHoursPerSprintChart.data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    barCategoryGap={10}
                    barGap={0}
                  >
                    <CartesianGrid {...chartGridProps} />
                    <XAxis
                      dataKey="sprint"
                      stroke={chartColors.axis}
                      label={{ value: 'Sprint Number', position: 'insideBottom', offset: -2, fill: chartColors.axis }}
                    />
                    <YAxis
                      stroke={chartColors.axis}
                      allowDecimals={false}
                      label={{
                        value: 'Hours worked',
                        angle: -90,
                        position: 'insideLeft',
                        fill: chartColors.axis,
                        style: { textAnchor: 'middle', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 },
                      }}
                    />
                    <Tooltip 
                      cursor={chartCursorStyle} 
                      contentStyle={chartTooltipStyle}
                    />
                    <Legend wrapperStyle={chartLegendStyle} />
                    {(() => {
                      const palette = chartPalette;
                      return filteredWorkHoursPerSprintChart.members.map((member, idx) => (
                        <Bar
                          key={member}
                          dataKey={member}
                          fill={palette[idx % palette.length]}
                          name={member}
                          radius={[8, 8, 0, 0]}
                        >
                          <LabelList dataKey={member} position="top" fill={chartColors.axis} fontSize={14} />
                        </Bar>
                      ));
                    })()}
                  </BarChart>
                </ResponsiveContainer>
            )}
            </div>
          </div>
        </div>

        <div className="analytics-activity-row">
          <div className="analytics-chart-card">
            <div className="analytics-chart-card__head">
              <h2 className="analytics-chart-title">Performance score</h2>
              <span className="analytics-chart-card__badge">KPI</span>
            </div>
            <div className="analytics-chart-card__body">
              <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                <BarChart data={filteredKpiGrades} margin={{ top: 8, right: 24, left: 0, bottom: 4 }}>
                  <CartesianGrid {...chartGridProps} />
                  <XAxis dataKey="member" stroke={chartColors.axis} tick={{ fontSize: 12 }} />
                  <YAxis stroke={chartColors.axis} domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={chartCursorStyle} contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={chartLegendStyle} />
                  <Bar
                    dataKey="grade"
                    fill={chartColors.grade}
                    maxBarSize={40}
                    name="Score"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="analytics-chart-card">
            <div className="analytics-chart-card__head">
              <h2 className="analytics-chart-title">Recent activity</h2>
            </div>
            <div className="analytics-chart-card__body">
              <div className="analytics-activity-empty">
                <OctoMascot mood="wave" size={48} />
                <p>Ship a task or check Alerts for live updates from your pod.</p>
                <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)' }}>
                  OctoBuddy tracks board moves — a full activity feed is on the roadmap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AnalyticsView;