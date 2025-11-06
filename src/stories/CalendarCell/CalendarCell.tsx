import { useDroppable } from '@dnd-kit/core';
import { TableCell, Typography } from '@mui/material';

import { Event } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import EventBar from '../EventBar/EventBar';

interface CalendarCellProps {
  day: number | null;
  events: Event[];
  notifiedEvents: Event['id'][];
  holiday?: string;
  currentDate: Date;
  onDateClick?: (date: string) => void;
  isEditing?: boolean;
}

export default function CalendarCell({
  day,
  holiday,
  events,
  notifiedEvents,
  currentDate,
  onDateClick,
  isEditing = false,
}: CalendarCellProps) {
  const cellDate = day ? formatDate(currentDate, day) : null;
  const { setNodeRef, isOver } = useDroppable({
    id: cellDate ? `cell-${cellDate}` : `cell-null-${Math.random()}`,
    disabled: day === null,
  });

  const handleCellClick = () => {
    // 빈 셀이거나 일정이 있거나 편집 모드인 경우 클릭 무시
    if (!day || !cellDate || events.length > 0 || isEditing) {
      return;
    }

    // 날짜 클릭 핸들러 호출
    onDateClick?.(cellDate);
  };

  return (
    <TableCell
      ref={setNodeRef}
      onClick={handleCellClick}
      sx={{
        height: '120px',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        verticalAlign: 'top',
        padding: 1,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: isOver ? '#fff3e0' : 'white',
        transition: 'background-color 0.2s ease',
        cursor: day && events.length === 0 && !isEditing ? 'pointer' : 'default',
        '&:hover':
          day && events.length === 0 && !isEditing
            ? {
                backgroundColor: '#f5f5f5',
              }
            : {},
      }}
    >
      {day && (
        <>
          <Typography variant="body2" fontWeight="bold">
            {day}
          </Typography>
          {holiday && (
            <Typography
              variant="body2"
              color="error"
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
              }}
            >
              {holiday}
            </Typography>
          )}
          {events.map((event: Event) => (
            <EventBar
              key={`${cellDate}-${event.id}`}
              isNotified={notifiedEvents.includes(event.id)}
              event={event}
            />
          ))}
        </>
      )}
    </TableCell>
  );
}
