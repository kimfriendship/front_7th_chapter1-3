import { TableCell, Typography } from '@mui/material';
import { Event } from '../../types';
import EventBar from '../EventBar/EventBar';

interface CalendarCellProps {
  day: number | null;
  events: Event[];
  notifiedEvents: Event['id'][];
  holiday?: string;
}

export default function CalendarCell({ day, holiday, events, notifiedEvents }: CalendarCellProps) {
  return (
    <TableCell
      sx={{
        height: '120px',
        verticalAlign: 'top',
        width: '14.28%',
        padding: 1,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {day && (
        <>
          <Typography variant="body2" fontWeight="bold">
            {day}
          </Typography>
          {holiday && (
            <Typography variant="body2" color="error">
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
