import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Box } from '@mui/material';

import CheckboxInput from './CheckboxInput';

const meta = {
  title: 'Example/CheckboxInput',
  component: CheckboxInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'default'],
      description: 'Checkbox 색상',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Checkbox 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    required: {
      control: 'boolean',
      description: '필수 선택 여부',
    },
  },
} satisfies Meta<typeof CheckboxInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const CheckboxInputWrapper = (args: any) => {
  const [checked, setChecked] = useState(args.checked || false);

  return (
    <Box>
      <CheckboxInput
        {...args}
        checked={checked}
        onChange={(newChecked) => {
          setChecked(newChecked);
          args.onChange?.(newChecked);
        }}
      />
    </Box>
  );
};

export const Default: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: '기본 체크박스',
    checked: false,
    onChange: (checked) => console.log(checked),
  },
};

export const Checked: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: '선택된 체크박스',
    checked: true,
    onChange: (checked) => console.log(checked),
  },
};

export const RepeatSchedule: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: '반복 일정',
    checked: false,
    onChange: (checked) => console.log(checked),
  },
};

export const Disabled: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: '비활성화된 체크박스',
    checked: false,
    disabled: true,
    onChange: (checked) => console.log(checked),
  },
};

export const DisabledChecked: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: '비활성화된 선택 상태',
    checked: true,
    disabled: true,
    onChange: (checked) => console.log(checked),
  },
};

export const Required: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: '필수 체크박스',
    checked: false,
    required: true,
    onChange: (checked) => console.log(checked),
  },
};

export const SmallSize: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: '작은 체크박스',
    checked: false,
    size: 'small',
    onChange: (checked) => console.log(checked),
  },
};

export const MediumSize: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: '중간 체크박스',
    checked: false,
    size: 'medium',
    onChange: (checked) => console.log(checked),
  },
};

export const SecondaryColor: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: 'Secondary 색상',
    checked: true,
    color: 'secondary',
    onChange: (checked) => console.log(checked),
  },
};

export const ErrorColor: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: 'Error 색상',
    checked: true,
    color: 'error',
    onChange: (checked) => console.log(checked),
  },
};

export const SuccessColor: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: 'Success 색상',
    checked: true,
    color: 'success',
    onChange: (checked) => console.log(checked),
  },
};

export const WarningColor: Story = {
  render: CheckboxInputWrapper,
  args: {
    label: 'Warning 색상',
    checked: true,
    color: 'warning',
    onChange: (checked) => console.log(checked),
  },
};
