import { useDraggable } from '@dnd-kit/core';
import { Notifications, Repeat } from '@mui/icons-material';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { Event } from '../../types';
import { getRepeatTypeLabel } from '../../utils/repeatUtils';

interface EventBarProps {
  isNotified: boolean;
  event: Event;
}

export default function EventBar({ isNotified, event }: EventBarProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `event-${event.id}`,
    data: {
      eventId: event.id,
      sourceDate: event.date,
    },
  });

  const isRepeating = event.repeat.type !== 'none';

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        p: 0.5,
        my: 0.5,
        backgroundColor: isNotified ? '#ffebee' : '#f5f5f5',
        borderRadius: 1,
        fontWeight: isNotified ? 'bold' : 'normal',
        color: isNotified ? '#d32f2f' : 'inherit',
        minHeight: '18px',
        width: '100%',
        overflow: 'hidden',
        opacity: isDragging ? 0.6 : 1,
        cursor: 'grab',
        transition: 'opacity 0.2s ease',
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
        {isNotified && <Notifications fontSize="small" />}
        {/* ! TEST CASE */}
        {isRepeating && (
          <Tooltip
            title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
              event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
            }`}
          >
            <Repeat fontSize="small" />
          </Tooltip>
        )}
        <Typography
          variant="caption"
          noWrap
          sx={{
            fontSize: '0.75rem',
            lineHeight: 1.2,
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {event.title}
        </Typography>
      </Stack>
    </Box>
  );
}
