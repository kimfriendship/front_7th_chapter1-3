import type { StoryObj } from '@storybook/react-vite';

import CalendarCell from './CalendarCell';
import { Event } from '../../types';

const meta = {
  title: 'Example/CalendarCell',
  component: CalendarCell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const event: Event = {
  id: '1',
  title: '기존 회의',
  date: '2025-10-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '기존 팀 미팅',
  location: '회의실 B',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

export const Default: Story = {
  args: {
    day: 3,
    holiday: '개천절',
    events: [],
    notifiedEvents: [],
  },
};

export const CalendarCellWithEvents: Story = {
  args: {
    day: 3,
    holiday: '개천절',
    events: [{ ...event }],
    notifiedEvents: [],
  },
};

export const CalendarCellWithRepeatingEvents: Story = {
  args: {
    day: 3,
    holiday: '개천절',
    events: [{ ...event, repeat: { type: 'weekly', interval: 1 } }],
    notifiedEvents: [],
  },
};

export const CalendarCellWithNotifiedEvents: Story = {
  args: {
    day: 3,
    holiday: '개천절',
    events: [{ ...event }],
    notifiedEvents: ['1'],
  },
};

export const CalendarCellWithNotifiedRepeatingEvents: Story = {
  args: {
    day: 3,
    holiday: '개천절',
    events: [{ ...event, repeat: { type: 'weekly', interval: 1 } }],
    notifiedEvents: ['1'],
  },
};
