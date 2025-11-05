import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';
import MonthlyCalendar from '../stories/MonthlyCalendar/MonthlyCalendar.tsx';
import WeeklyCalendar from '../stories/WeeklyCalendar/WeeklyCalendar.tsx';
import { Event } from '../types.ts';

interface CalendarViewControlsProps {
  view: 'week' | 'month';
  setView: (value: 'week' | 'month') => void;
  currentDate: Date;
  navigate: (direction: 'prev' | 'next') => void;
  filteredEvents: Event[];
  notifiedEvents: string[];
  holidays: Record<string, string>;
}

export default function CalendarViewControls({
  view,
  setView,
  currentDate,
  navigate,
  filteredEvents,
  notifiedEvents,
  holidays,
}: CalendarViewControlsProps) {
  return (
    <Stack flex={1} spacing={5}>
      <Typography variant="h4">일정 보기</Typography>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
          <ChevronLeft />
        </IconButton>
        <Select
          size="small"
          aria-label="뷰 타입 선택"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <MenuItem value="week" aria-label="week-option">
            Week
          </MenuItem>
          <MenuItem value="month" aria-label="month-option">
            Month
          </MenuItem>
        </Select>
        <IconButton aria-label="Next" onClick={() => navigate('next')}>
          <ChevronRight />
        </IconButton>
      </Stack>

      {view === 'week' && (
        <WeeklyCalendar
          currentDate={currentDate}
          events={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === 'month' && (
        <MonthlyCalendar
          currentDate={currentDate}
          events={filteredEvents}
          holidays={holidays}
          notifiedEvents={notifiedEvents}
        />
      )}
    </Stack>
  );
}
