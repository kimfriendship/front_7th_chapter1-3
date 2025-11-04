import type { StoryObj } from '@storybook/react-vite';

import MonthlyCalendar from './MonthlyCalendar';
import { Event } from '../../types';

const meta = {
  title: 'Example/MonthlyCalendar',
  component: MonthlyCalendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const events: Event[] = [
  {
    id: '0',
    title: '오늘 회의',
    date: '2025-10-13',
    startTime: '09:00',
    endTime: '10:00',
    description: '오늘 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '1',
    title: '주간 회의',
    date: '2025-10-14',
    startTime: '09:00',
    endTime: '10:00',
    description: '주간 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'weekly', interval: 1 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '기존 회의',
    date: '2025-10-16',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '3',
    title: '새로운 회의',
    date: '2025-10-16',
    startTime: '09:00',
    endTime: '10:00',
    description: '새로운 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'weekly', interval: 1 },
    notificationTime: 10,
  },
];

export const Default: Story = {
  args: {
    currentDate: new Date('2025-10-15'),
    events,
    notifiedEvents: ['0', '1'],
    holidays: {
      '2025-10-03': '개천절',
      '2025-10-09': '한글날',
      '2025-10-05': '추석',
      '2025-10-06': '추석',
      '2025-10-07': '추석',
    },
  },
};
