import { Typography } from '@mui/material';
import Dialog from '../stories/Dialog/Dialog.tsx';
import { Event } from '../types';

/**
 * Available operation modes for the recurring event dialog
 */
type DialogMode = 'edit' | 'delete';

/**
 * Dialog content configuration for different modes
 */
const DIALOG_CONFIG = {
  edit: {
    title: '반복 일정 수정',
    message: '해당 일정만 수정하시겠어요?',
  },
  delete: {
    title: '반복 일정 삭제',
    message: '해당 일정만 삭제하시겠어요?',
  },
} as const;

/**
 * Button text constants
 */
const BUTTON_TEXT = {
  cancel: '취소',
  no: '아니오',
  yes: '예',
} as const;

/**
 * Props for the RecurringEventDialog component
 */
interface RecurringEventDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback fired when the dialog should be closed */
  onClose: () => void;
  /** Callback fired when user confirms an action */
  onConfirm: (editSingleOnly: boolean) => void;
  /** The event being operated on */
  event: Event | null;
  /** The operation mode */
  mode?: DialogMode;
}

/**
 * Dialog component for handling recurring event operations
 * Allows users to choose between single instance or series-wide operations
 */
const RecurringEventDialog = ({
  open,
  onClose,
  onConfirm,
  mode = 'edit',
}: RecurringEventDialogProps) => {
  /**
   * Handles the "Yes" button click - operates on single instance only
   */
  const handleSingleOperation = () => {
    onConfirm(true); // true = single instance operation
  };

  /**
   * Handles the "No" button click - operates on entire series
   */
  const handleSeriesOperation = () => {
    onConfirm(false); // false = series-wide operation
  };

  // Early return for closed dialog
  if (!open) return null;

  const config = DIALOG_CONFIG[mode];

  const actions = [
    {
      label: BUTTON_TEXT.cancel,
      onClick: onClose,
      color: 'inherit' as const,
      variant: 'text' as const,
    },
    {
      label: BUTTON_TEXT.no,
      onClick: handleSeriesOperation,
      color: 'primary' as const,
      variant: 'outlined' as const,
    },
    {
      label: BUTTON_TEXT.yes,
      onClick: handleSingleOperation,
      color: 'primary' as const,
      variant: 'contained' as const,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={config.title}
      actions={actions}
      maxWidth="sm"
      fullWidth
      ariaLabelledby="recurring-event-dialog-title"
      ariaDescribedby="recurring-event-dialog-description"
    >
      <Typography id="recurring-event-dialog-description">{config.message}</Typography>
    </Dialog>
  );
};

export default RecurringEventDialog;
