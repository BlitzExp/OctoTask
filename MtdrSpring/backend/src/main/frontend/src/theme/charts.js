/**
 * Recharts theme — app-light workspace
 */

export const chartColors = {
  completed: '#2e7d32',
  pending: '#5a6acf',
  late: '#c74634',
  grade: '#7b5cff',
  hours: '#6b7fd7',
  grid: '#ebe9f0',
  axis: '#6b6f76',
  label: '#161513',
  tooltipBg: '#ffffff',
  tooltipText: '#161513',
};

export const chartPalette = [
  '#6b5ce7',
  '#0572ce',
  '#2e7d32',
  '#c74634',
  '#5a6acf',
  '#b39500',
];

export const chartTooltipStyle = {
  background: chartColors.tooltipBg,
  border: '1px solid #e1e3e8',
  color: chartColors.tooltipText,
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(22, 21, 19, 0.1)',
  fontSize: '13px',
};

export const chartLegendStyle = {
  color: chartColors.axis,
};

export const chartGridProps = {
  strokeDasharray: '3 3',
  stroke: chartColors.grid,
};

export const chartAxisTick = {
  fontSize: 12,
  fill: chartColors.axis,
};

export const chartCursorStyle = {
  fill: chartColors.grid,
  opacity: 0.35,
};

export const chartRadialTrack = '#e1e3e8';
