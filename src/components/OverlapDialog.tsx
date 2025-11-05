import { DialogContentText, Typography } from '@mui/material';
import Dialog from '../stories/Dialog/Dialog.tsx';
import { Event } from '../types.ts';

interface OverlapDialogProps {
  open: boolean;
  overlappingEvents: Event[];
  onClose: () => void;
  onConfirm: () => void;
}

export default function OverlapDialog({
  open,
  overlappingEvents,
  onClose,
  onConfirm,
}: OverlapDialogProps) {
  const actions = [
    {
      label: '취소',
      onClick: onClose,
      color: 'inherit' as const,
      variant: 'text' as const,
    },
    {
      label: '계속 진행',
      onClick: onConfirm,
      color: 'error' as const,
      variant: 'text' as const,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} title="일정 겹침 경고" actions={actions}>
      <DialogContentText>다음 일정과 겹칩니다:</DialogContentText>
      {overlappingEvents.map((event) => (
        <Typography key={event.id} sx={{ ml: 1, mb: 1 }}>
          {event.title} ({event.date} {event.startTime}-{event.endTime})
        </Typography>
      ))}
      <DialogContentText>계속 진행하시겠습니까?</DialogContentText>
    </Dialog>
  );
}
