import type { StoryObj } from '@storybook/react-vite';

import EventBar from './EventBar';
import { Event } from '../../types';

const meta = {
  title: 'Example/EventBar',
  component: EventBar,
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
    isNotified: false,
    event,
  },
};

export const Repeating: Story = {
  args: {
    isNotified: false,
    event: { ...event, repeat: { type: 'weekly', interval: 1 } },
  },
};

export const Notified: Story = {
  args: {
    isNotified: true,
    event,
  },
};

export const NotifiedRepeating: Story = {
  args: {
    isNotified: true,
    event: { ...event, repeat: { type: 'weekly', interval: 1 } },
  },
};
