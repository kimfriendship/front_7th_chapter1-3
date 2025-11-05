import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Box } from '@mui/material';

import EventForm from './EventForm';
import { RepeatType } from '../../types';

const meta = {
  title: 'Example/EventForm',
  component: EventForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const EventFormWrapper = (args: any) => {
  const [title, setTitle] = useState(args.title || '');
  const [date, setDate] = useState(args.date || '');
  const [startTime, setStartTime] = useState(args.startTime || '');
  const [endTime, setEndTime] = useState(args.endTime || '');
  const [description, setDescription] = useState(args.description || '');
  const [location, setLocation] = useState(args.location || '');
  const [category, setCategory] = useState(args.category || '업무');
  const [isRepeating, setIsRepeating] = useState(args.isRepeating || false);
  const [repeatType, setRepeatType] = useState<RepeatType>(args.repeatType || 'none');
  const [repeatInterval, setRepeatInterval] = useState(args.repeatInterval || 1);
  const [repeatEndDate, setRepeatEndDate] = useState(args.repeatEndDate || '');
  const [notificationTime, setNotificationTime] = useState(args.notificationTime || 10);
  const [startTimeError] = useState<string | null>(args.startTimeError || null);
  const [endTimeError] = useState<string | null>(args.endTimeError || null);
  const [editingEvent] = useState<Event | null>(args.editingEvent || null);

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <EventForm
        title={title}
        setTitle={setTitle}
        date={date}
        setDate={setDate}
        startTime={startTime}
        endTime={endTime}
        description={description}
        setDescription={setDescription}
        location={location}
        setLocation={setLocation}
        category={category}
        setCategory={setCategory}
        isRepeating={isRepeating}
        setIsRepeating={setIsRepeating}
        repeatType={repeatType}
        setRepeatType={setRepeatType}
        repeatInterval={repeatInterval}
        setRepeatInterval={setRepeatInterval}
        repeatEndDate={repeatEndDate}
        setRepeatEndDate={setRepeatEndDate}
        notificationTime={notificationTime}
        setNotificationTime={setNotificationTime}
        startTimeError={startTimeError ?? undefined}
        endTimeError={endTimeError ?? undefined}
        editingEvent={editingEvent}
        handleStartTimeChange={handleStartTimeChange}
        handleEndTimeChange={handleEndTimeChange}
        onSubmit={() => {
          console.log('Form submitted:', {
            title,
            date,
            startTime,
            endTime,
            description,
            location,
            category,
            isRepeating,
            repeatType,
            repeatInterval,
            repeatEndDate,
            notificationTime,
          });
        }}
      />
    </Box>
  );
};

const getDummyActions = () => {
  return {
    setTitle: () => {},
    setDate: () => {},
    setStartTime: () => {},
    setEndTime: () => {},
    setDescription: () => {},
    setLocation: () => {},
    setCategory: () => {},
    setIsRepeating: () => {},
    setRepeatType: () => {},
    setRepeatInterval: () => {},
    setRepeatEndDate: () => {},
    setNotificationTime: () => {},
    onSubmit: () => {},
    handleStartTimeChange: () => {},
    handleEndTimeChange: () => {},
  };
};

export const Default: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: '업무',
    isRepeating: false,
    repeatType: 'none',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 10,
  },
};

export const WithBasicInfo: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '팀 회의',
    date: '2024-12-25',
    startTime: '14:00',
    endTime: '15:00',
    description: '',
    location: '',
    category: '업무',
    isRepeating: false,
    repeatType: 'none',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 10,
  },
};

export const FullyFilled: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '주간 팀 미팅',
    date: '2024-12-25',
    startTime: '14:00',
    endTime: '15:30',
    description: '주간 업무 공유 및 다음 주 계획 논의',
    location: '회의실 A',
    category: '업무',
    isRepeating: false,
    repeatType: 'none',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 60,
  },
};

export const WithTimeError: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '저녁 약속',
    date: '2024-12-25',
    startTime: '18:00',
    endTime: '17:00',
    description: '',
    location: '',
    category: '개인',
    isRepeating: false,
    repeatType: 'none',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 10,
    startTimeError: '',
    endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
  },
};

export const WithRepeating: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '매일 운동',
    date: '2024-12-25',
    startTime: '07:00',
    endTime: '08:00',
    description: '아침 운동',
    location: '헬스장',
    category: '개인',
    isRepeating: true,
    repeatType: 'daily',
    repeatInterval: 1,
    repeatEndDate: '2024-12-31',
    notificationTime: 10,
  },
};

export const WeeklyRepeating: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '주간 보고',
    date: '2024-12-25',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 업무 보고',
    location: '본사',
    category: '업무',
    isRepeating: true,
    repeatType: 'weekly',
    repeatInterval: 1,
    repeatEndDate: '2025-03-31',
    notificationTime: 120,
  },
};

export const MonthlyRepeating: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '월례 회의',
    date: '2024-12-25',
    startTime: '15:00',
    endTime: '17:00',
    description: '월간 실적 점검 및 다음 달 계획',
    location: '대회의실',
    category: '업무',
    isRepeating: true,
    repeatType: 'monthly',
    repeatInterval: 1,
    repeatEndDate: '2025-12-25',
    notificationTime: 1440,
  },
};

export const EditMode: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '기존 일정',
    date: '2024-12-20',
    startTime: '13:00',
    endTime: '14:00',
    description: '수정할 일정입니다',
    location: '회의실 B',
    category: '가족',
    isRepeating: false,
    repeatType: 'none',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 60,
    editingEvent: { id: '1', title: '기존 일정' },
  },
};

export const PersonalEvent: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '치과 예약',
    date: '2024-12-28',
    startTime: '16:00',
    endTime: '16:30',
    description: '정기 검진',
    location: '서울 치과',
    category: '개인',
    isRepeating: false,
    repeatType: 'none',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 60,
  },
};

export const FamilyEvent: Story = {
  render: EventFormWrapper,
  args: {
    ...getDummyActions(),
    title: '가족 여행',
    date: '2024-12-30',
    startTime: '09:00',
    endTime: '18:00',
    description: '부산 여행',
    location: '부산',
    category: '가족',
    isRepeating: false,
    repeatType: 'none',
    repeatInterval: 1,
    repeatEndDate: '',
    notificationTime: 1440,
  },
};
