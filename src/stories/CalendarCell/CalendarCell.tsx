import { TableCell, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { Event } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import EventBar from '../EventBar/EventBar';

interface CalendarCellProps {
  day: number | null;
  events: Event[];
  notifiedEvents: Event['id'][];
  holiday?: string;
  currentDate: Date;
  onDropEvent?: (eventId: string, targetDate: string) => void;
}

export default function CalendarCell({
  day,
  holiday,
  events,
  notifiedEvents,
  currentDate,
  onDropEvent,
}: CalendarCellProps) {
  const cellDate = day ? formatDate(currentDate, day) : null;
  const { setNodeRef, isOver } = useDroppable({
    id: cellDate ? `cell-${cellDate}` : `cell-null-${Math.random()}`,
    disabled: day === null,
  });

  return (
    <TableCell
      ref={setNodeRef}
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
            <EventBar key={event.id} isNotified={notifiedEvents.includes(event.id)} event={event} />
          ))}
        </>
      )}
    </TableCell>
  );
}
