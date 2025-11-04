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
import { formatDate, formatMonth, getEventsForDay, getWeeksAtMonth } from '../../utils/dateUtils';
import { weekDays } from '../../constants';
import CalendarCell from '../CalendarCell/CalendarCell';
import { Event } from '../../types';

interface MonthlyCalendarProps {
  currentDate: Date;
  events: Event[];
  holidays: Record<string, string>;
  notifiedEvents: string[];
}

export default function MonthlyCalendar({
  currentDate,
  events,
  holidays,
  notifiedEvents,
}: MonthlyCalendarProps) {
  const weeks = getWeeksAtMonth(currentDate);

  return (
    <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatMonth(currentDate)}</Typography>
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
            {weeks.map((week, weekIndex) => (
              <TableRow key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const dateString = day ? formatDate(currentDate, day) : '';
                  const holiday = holidays[dateString];
                  const dayEvents = day ? getEventsForDay(events, day) : [];

                  return (
                    <CalendarCell
                      key={dayIndex}
                      day={day}
                      holiday={holiday}
                      events={dayEvents}
                      notifiedEvents={notifiedEvents}
                    />
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
