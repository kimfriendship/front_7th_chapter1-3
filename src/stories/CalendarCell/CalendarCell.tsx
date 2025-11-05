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
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        verticalAlign: 'top',
        padding: 1,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
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
