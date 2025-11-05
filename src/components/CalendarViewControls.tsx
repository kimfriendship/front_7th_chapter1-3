import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
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
  onMoveEvent?: (eventId: string, targetDate: string) => void;
}

export default function CalendarViewControls({
  view,
  setView,
  currentDate,
  navigate,
  filteredEvents,
  notifiedEvents,
  holidays,
  onMoveEvent,
}: CalendarViewControlsProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8, // 8px 이동해야 드래그 시작
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200, // 200ms 후 드래그 시작
      tolerance: 5, // 5px 이동 허용
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // 캘린더 밖으로 드롭한 경우 (over가 없음)
    if (!over) {
      return;
    }

    // active에서 드래그 중인 이벤트 정보 추출
    const dragData = active.data.current;
    if (!dragData || !dragData.eventId || !dragData.sourceDate) {
      return;
    }

    const { eventId, sourceDate } = dragData;

    // over에서 드롭 대상 날짜 추출
    // CalendarCell의 id 형식: "cell-YYYY-MM-DD" 또는 날짜 문자열
    const targetDate = typeof over.id === 'string' ? over.id.replace('cell-', '') : String(over.id);

    // 같은 날짜로 드롭한 경우 무시
    if (sourceDate === targetDate) {
      return;
    }

    // onMoveEvent 호출
    onMoveEvent?.(eventId, targetDate);
  };

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

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
      </DndContext>
    </Stack>
  );
}
