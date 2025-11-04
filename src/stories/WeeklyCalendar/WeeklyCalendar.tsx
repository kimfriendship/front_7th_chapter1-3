import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CalendarCell from '../CalendarCell/CalendarCell';
import { formatWeek, getWeekDates } from '../../utils/dateUtils';
import { weekDays } from '../../constants';
import { Event } from '../../types';

interface WeeklyCalendarProps {
  currentDate: Date;
  events: Event[];
  notifiedEvents: Event['id'][];
}
export default function WeeklyCalendar({
  currentDate,
  events,
  notifiedEvents,
}: WeeklyCalendarProps) {
  const weekDates = getWeekDates(currentDate);

  return (
    <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatWeek(currentDate)}</Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {weekDays.map((day) => (
                <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {weekDates.map((date) => {
                const dayEvents = events.filter(
                  (event) => new Date(event.date).toDateString() === date.toDateString()
                );

                return (
                  <CalendarCell
                    key={date.toISOString()}
                    day={date.getDate()}
                    events={dayEvents}
                    notifiedEvents={notifiedEvents}
                  />
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
