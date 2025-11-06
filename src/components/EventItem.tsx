import { Delete, Edit, Notifications, Repeat } from '@mui/icons-material';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { notificationOptions } from '../constants.ts';
import { Event } from '../types.ts';
import { getRepeatTypeLabel } from '../utils/repeatUtils.ts';

interface EventItemProps {
  event: Event;
  notifiedEvents: string[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export default function EventItem({ event, notifiedEvents, onEdit, onDelete }: EventItemProps) {
  return (
    <Box sx={{ border: 1, borderRadius: 2, p: 3, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            {notifiedEvents.includes(event.id) && <Notifications color="error" />}
            {event.repeat.type !== 'none' && (
              <Tooltip
                title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
                  event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
                }`}
              >
                <Repeat fontSize="small" />
              </Tooltip>
            )}
            <Typography
              fontWeight={notifiedEvents.includes(event.id) ? 'bold' : 'normal'}
              color={notifiedEvents.includes(event.id) ? 'error' : 'inherit'}
            >
              {event.title}
            </Typography>
          </Stack>
          <Typography>{event.date}</Typography>
          <Typography>
            {event.startTime} - {event.endTime}
          </Typography>
          <Typography>{event.description}</Typography>
          <Typography>{event.location}</Typography>
          <Typography>카테고리: {event.category}</Typography>
          {event.repeat.type !== 'none' && (
            <Typography>
              반복: {event.repeat.interval}
              {event.repeat.type === 'daily' && '일'}
              {event.repeat.type === 'weekly' && '주'}
              {event.repeat.type === 'monthly' && '월'}
              {event.repeat.type === 'yearly' && '년'}
              마다
              {event.repeat.endDate && ` (종료: ${event.repeat.endDate})`}
            </Typography>
          )}
          <Typography>
            알림:{' '}
            {notificationOptions.find((option) => option.value === event.notificationTime)?.label}
          </Typography>
        </Stack>
        <Stack>
          <IconButton aria-label="Edit event" onClick={() => onEdit(event)}>
            <Edit />
          </IconButton>
          <IconButton aria-label="Delete event" onClick={() => onDelete(event)}>
            <Delete />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
