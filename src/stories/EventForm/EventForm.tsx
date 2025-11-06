import { Button, Stack, Typography } from '@mui/material';

import { categories, notificationOptions } from '../../constants.ts';
import { RepeatType } from '../../types.ts';
import CheckboxInput from '../CheckboxInput/CheckboxInput.tsx';
import SelectInput from '../SelectInput/SelectInput.tsx';
import TextInput from '../TextInput/TextInput.tsx';

export interface EventFormProps {
  maxWidth?: number;
  title: string;
  setTitle: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  startTime: string;
  endTime: string;
  description: string;
  setDescription: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  isRepeating: boolean;
  setIsRepeating: (value: boolean) => void;
  repeatType: RepeatType;
  setRepeatType: (value: RepeatType) => void;
  repeatInterval: number;
  setRepeatInterval: (value: number) => void;
  repeatEndDate: string;
  setRepeatEndDate: (value: string) => void;
  notificationTime: number;
  setNotificationTime: (value: number) => void;
  startTimeError?: string;
  endTimeError?: string;
  editingEvent?: any;
  handleStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function EventForm({
  maxWidth = 200,
  title,
  setTitle,
  date,
  setDate,
  startTime,
  endTime,
  description,
  setDescription,
  location,
  setLocation,
  category,
  setCategory,
  isRepeating,
  setIsRepeating,
  repeatType,
  setRepeatType,
  repeatInterval,
  setRepeatInterval,
  repeatEndDate,
  setRepeatEndDate,
  notificationTime,
  setNotificationTime,
  startTimeError,
  endTimeError,
  editingEvent,
  handleStartTimeChange,
  handleEndTimeChange,
  onSubmit,
}: EventFormProps) {
  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));
  const repeatTypeOptions = [
    { value: 'daily', label: '매일' },
    { value: 'weekly', label: '매주' },
    { value: 'monthly', label: '매월' },
    { value: 'yearly', label: '매년' },
  ];

  return (
    <Stack spacing={2} sx={{ width: '100%', minWidth: 100, maxWidth }}>
      <Typography variant="h4">{editingEvent ? '일정 수정' : '일정 추가'}</Typography>

      <TextInput
        id="title"
        label="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="일정 제목을 입력하세요"
      />

      <TextInput
        id="date"
        label="날짜"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
        <TextInput
          id="start-time"
          label="시작 시간"
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          error={!!startTimeError}
          errorMessage={startTimeError}
        />
        <TextInput
          id="end-time"
          label="종료 시간"
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          error={!!endTimeError}
          errorMessage={endTimeError}
        />
      </Stack>

      <TextInput
        id="description"
        label="설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="일정 설명을 입력하세요"
        fullWidth={true}
      />

      <TextInput
        id="location"
        label="위치"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="장소를 입력하세요"
        fullWidth={true}
      />

      <SelectInput
        id="category"
        label="카테고리"
        value={category}
        onChange={(value) => setCategory(value as string)}
        options={categoryOptions}
        ariaLabel="카테고리"
        fullWidth={true}
      />

      {!editingEvent && (
        <CheckboxInput
          label="반복 일정"
          checked={isRepeating}
          onChange={(checked) => {
            setIsRepeating(checked);
            if (checked) {
              setRepeatType('daily');
            } else {
              setRepeatType('none');
            }
          }}
        />
      )}

      {isRepeating && !editingEvent && (
        <Stack spacing={2} sx={{ width: '100%' }}>
          <SelectInput
            id="repeat-type"
            label="반복 유형"
            value={repeatType}
            onChange={(value) => setRepeatType(value as RepeatType)}
            options={repeatTypeOptions}
            ariaLabel="반복 유형"
          />
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <TextInput
              id="repeat-interval"
              label="반복 간격"
              type="number"
              value={repeatInterval}
              onChange={(e) => setRepeatInterval(Number(e.target.value))}
              inputProps={{ min: 1 }}
            />
            <TextInput
              id="repeat-end-date"
              label="반복 종료일"
              type="date"
              value={repeatEndDate}
              onChange={(e) => setRepeatEndDate(e.target.value)}
            />
          </Stack>
        </Stack>
      )}

      <SelectInput
        id="notification"
        label="알림 설정"
        value={notificationTime}
        onChange={(value) => setNotificationTime(value as number)}
        options={notificationOptions}
        fullWidth={true}
      />

      <Button
        data-testid="event-submit-button"
        onClick={onSubmit}
        variant="contained"
        color="primary"
        fullWidth
      >
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </Stack>
  );
}
