import type { StoryObj } from '@storybook/react-vite';
import React from 'react';

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
    currentDate: new Date('2025-10-15'),
    day: 3,
    holiday: '개천절',
    events: [],
    notifiedEvents: [],
  },
};

export const CalendarCellWithEvents: Story = {
  args: {
    currentDate: new Date('2025-10-15'),
    day: 3,
    holiday: '개천절',
    events: [{ ...event }],
    notifiedEvents: [],
  },
};

export const CalendarCellWithRepeatingEvents: Story = {
  args: {
    currentDate: new Date('2025-10-15'),
    day: 3,
    holiday: '개천절',
    events: [{ ...event, repeat: { type: 'weekly', interval: 1 } }],
    notifiedEvents: [],
  },
};

export const CalendarCellWithNotifiedEvents: Story = {
  args: {
    currentDate: new Date('2025-10-15'),
    day: 3,
    holiday: '개천절',
    events: [{ ...event }],
    notifiedEvents: ['1'],
  },
};

export const CalendarCellWithNotifiedRepeatingEvents: Story = {
  args: {
    currentDate: new Date('2025-10-15'),
    day: 3,
    holiday: '개천절',
    events: [{ ...event, repeat: { type: 'weekly', interval: 1 } }],
    notifiedEvents: ['1'],
  },
};

const longTextEvent: Event = {
  ...event,
  title: '매우 긴 텍스트가 포함된 이벤트 제목입니다. 이 텍스트는 ellipsis 처리가 되어야 합니다.',
};

export const CalendarCellWithLongText: Story = {
  args: {
    currentDate: new Date('2025-10-15'),
    day: 3,
    holiday: '개천절',
    events: [],
    notifiedEvents: [],
  },
  render: () => {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
        },
      },
      React.createElement(
        'div',
        {
          style: {
            width: '50px',
            maxWidth: '50px',
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'table',
            tableLayout: 'fixed',
          },
        },
        React.createElement(CalendarCell, {
          currentDate: new Date('2025-10-15'),
          day: 3,
          holiday: '개천절',
          events: [longTextEvent],
          notifiedEvents: [],
        })
      ),
      React.createElement(
        'div',
        {
          style: {
            width: '100px',
            maxWidth: '100px',
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'table',
            tableLayout: 'fixed',
          },
        },
        React.createElement(CalendarCell, {
          currentDate: new Date('2025-10-15'),
          day: 3,
          holiday: '개천절',
          events: [longTextEvent],
          notifiedEvents: [],
        })
      ),
      React.createElement(
        'div',
        {
          style: {
            width: '200px',
            maxWidth: '200px',
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'table',
            tableLayout: 'fixed',
          },
        },
        React.createElement(CalendarCell, {
          currentDate: new Date('2025-10-15'),
          day: 3,
          holiday: '개천절',
          events: [longTextEvent],
          notifiedEvents: [],
        })
      )
    );
  },
};
