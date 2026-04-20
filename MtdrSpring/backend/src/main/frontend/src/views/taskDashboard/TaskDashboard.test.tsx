import React, { createContext, useContext, useMemo } from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import TaskDashboard from './taskDashboard';
import { setUpUserEvent } from '../../testUtils/setUpUserEvent';
import { getAllTasks, fetchTeamTasksCon } from '../../controller/tasksViewController';

vi.mock('../../controller/tasksViewController', () => ({
  getAllTasks: vi.fn(),
  fetchTeamTasksCon: vi.fn(),
}));

vi.mock('../../components/task/taskCard', () => ({
  default: function MockTaskCard({
    task,
    onCardClick,
  }: {
    task: {
      id: number;
      name: string;
      userName: string;
      cost: number;
      spentHours?: number;
    };
    onCardClick: (task: unknown) => void;
  }) {
    return (
      <button onClick={() => onCardClick(task)} aria-label={`open-${task.id}`}>
        {`Task:${task.name} Developer:${task.userName} Est:${task.cost} Act:${task.spentHours ?? 0}`}
      </button>
    );
  },
}));

vi.mock('../../components/taskUpdate/taskUpdate', () => ({
  default: function MockTaskUpdate({
    task,
    onSave,
    onClose,
  }: {
    task: any;
    onSave: (task: any) => void;
    onClose: () => void;
  }) {
    return (
      <div>
        <p>{`Editing:${task?.name}`}</p>
        <button
          onClick={() =>
            onSave({
              ...task,
              name: 'Done Ticket',
              userName: 'Alex QA',
              cost: 13,
              spentHours: 11,
              stateId: 1,
              getPriorityLabel: () => 'M',
              getStateLabel: () => 'Done',
            })
          }
        >
          Save As Done
        </button>
        <button onClick={onClose}>Close Edit</button>
      </div>
    );
  },
}));

vi.mock('../../components/taskForm/taskForm', () => ({
  default: function MockTaskForm({
    isOpen,
    updateTaskList,
    onClose,
  }: {
    isOpen: boolean;
    updateTaskList: (task: any) => void;
    onClose: () => void;
  }) {
    return isOpen ? (
      <div>
        <button
          onClick={() =>
            updateTaskList({
              id: 700,
              assigneeId: 1,
              name: 'Realtime Added Task',
              userName: 'Realtime Dev',
              cost: 5,
              spentHours: 0,
              sprintEndDate: '2030-01-01',
              stateId: 2,
              getPriorityLabel: () => 'M',
              getStateLabel: () => 'Pending',
            })
          }
        >
          Add Mock Task
        </button>
        <button onClick={onClose}>Close Create</button>
      </div>
    ) : null;
  },
}));

function buildTask(overrides: Partial<any> = {}) {
  const task = {
    id: 1,
    name: 'Initial Task',
    userName: 'Diego',
    cost: 3,
    spentHours: 0,
    stateId: 2,
    sprintEndDate: '2030-01-01',
    getPriorityLabel: () => 'M',
    ...overrides,
  };

  task.getStateLabel = () => {
    const states: Record<number, string> = {
      1: 'Done',
      2: 'Pending',
      3: 'On Going',
      4: 'Late',
    };
    return states[task.stateId] || 'Pending';
  };

  return task;
}

describe('TaskDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each([
    ['admin', fetchTeamTasksCon, getAllTasks],
    ['developer', getAllTasks, fetchTeamTasksCon],
  ])('loads role-aware dashboard data for %s users', async (role, expectedLoader, unexpectedLoader) => {
    const task = buildTask({
      id: role === 'admin' ? 100 : 200,
      name: `${role}-task`,
    });

    vi.mocked(fetchTeamTasksCon).mockResolvedValue([task]);
    vi.mocked(getAllTasks).mockResolvedValue([task]);

    setUpUserEvent(
      <TaskDashboard user={{ id: 9, role, teamId: 17, username: `${role}-user` }} />,
    );

    await waitFor(() => {
      expect(expectedLoader).toHaveBeenCalled();
    });

    expect(unexpectedLoader).not.toHaveBeenCalled();
    expect(await screen.findByText(/Task:.*Developer:/i)).toBeInTheDocument();
  });

  test('supports real-time task display and creation flow for assigned users', async () => {
    vi.mocked(getAllTasks).mockResolvedValue([buildTask({ id: 2, name: 'Assigned Existing' })]);

    const { user } = setUpUserEvent(
      <TaskDashboard user={{ id: 1, role: 'developer', teamId: 77, username: 'worker-1' }} />,
    );

    expect(await screen.findByText(/Assigned Existing/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /create task/i }));
    await user.click(screen.getByRole('button', { name: /add mock task/i }));

    expect(await screen.findByText(/Realtime Added Task/)).toBeInTheDocument();
  });

  test('marks a task as completed and reflects task state and field changes', async () => {
    vi.mocked(getAllTasks).mockResolvedValue([
      buildTask({ id: 11, name: 'Implement API', stateId: 2, spentHours: 0 }),
    ]);

    const { user } = setUpUserEvent(
      <TaskDashboard user={{ id: 3, role: 'developer', teamId: 88, username: 'dev-3' }} />,
    );

    await user.click(await screen.findByRole('button', { name: /open-11/i }));
    expect(screen.getByText(/Editing:Implement API/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /save as done/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Editing:Implement API/)).not.toBeInTheDocument();
    });

    await user.click(screen.getByText('Completed'));

    expect(await screen.findByText(/Done Ticket/)).toBeInTheDocument();
    expect(screen.getByText(/Developer:Alex QA/)).toBeInTheDocument();
    expect(screen.getByText(/Est:13/)).toBeInTheDocument();
    expect(screen.getByText(/Act:11/)).toBeInTheDocument();
  });

  test('works with context and a custom hook while user interacts with dashboard filters', async () => {
    const UserContext = createContext<any>(null);

    function useCompletedCount(tasks: Array<{ getStateLabel: () => string }>) {
      return useMemo(() => tasks.filter((task) => task.getStateLabel() === 'Done').length, [tasks]);
    }

    function ContextDrivenDashboard() {
      const user = useContext(UserContext);
      const completedCount = useCompletedCount([
        buildTask({ id: 98, stateId: 1 }),
        buildTask({ id: 99, stateId: 2 }),
      ]);

      return (
        <>
          <span>{`CompletedCount:${completedCount}`}</span>
          <TaskDashboard user={user} />
        </>
      );
    }

    vi.mocked(getAllTasks).mockResolvedValue([
      buildTask({ id: 54, name: 'Pending Ticket', stateId: 2 }),
      buildTask({ id: 55, name: 'Done Ticket Sprint', stateId: 1, spentHours: 4 }),
    ]);

    const { user } = setUpUserEvent(
      <UserContext.Provider
        value={{ id: 44, role: 'developer', teamId: 12, username: 'ctx-user' }}
      >
        <ContextDrivenDashboard />
      </UserContext.Provider>,
    );

    expect(await screen.findByText('CompletedCount:1')).toBeInTheDocument();
    expect(await screen.findByText(/Pending Ticket/)).toBeInTheDocument();

    await user.click(screen.getByText('Pending'));
    expect(screen.getByText(/Pending Ticket/)).toBeInTheDocument();

    await user.click(screen.getByText('Completed'));
    expect(screen.getByText(/Done Ticket Sprint/)).toBeInTheDocument();
  });
});
