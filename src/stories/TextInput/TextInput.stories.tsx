import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Box } from '@mui/material';

import TextInput from './TextInput';

const meta = {
  title: 'Example/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'date', 'time', 'number'],
      description: 'Input 타입',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Input 크기',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    required: {
      control: 'boolean',
      description: '필수 입력 여부',
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const TextInputWrapper = (args: any) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <Box sx={{ width: 300 }}>
      <TextInput
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          args.onChange?.(e);
        }}
      />
    </Box>
  );
};

export const Default: Story = {
  render: TextInputWrapper,
  args: {
    id: 'default-input',
    label: '기본 입력',
    value: '',
    placeholder: '입력하세요',
    onChange: (e) => console.log(e.target.value),
  },
};

export const TextType: Story = {
  render: TextInputWrapper,
  args: {
    id: 'text-input',
    label: '제목',
    value: '',
    type: 'text',
    placeholder: '제목을 입력하세요',
    onChange: (e) => console.log(e.target.value),
  },
};

export const DateType: Story = {
  render: TextInputWrapper,
  args: {
    id: 'date-input',
    label: '날짜',
    value: '2024-01-01',
    type: 'date',
    onChange: (e) => console.log(e.target.value),
  },
};

export const TimeType: Story = {
  render: TextInputWrapper,
  args: {
    id: 'time-input',
    label: '시간',
    value: '09:00',
    type: 'time',
    onChange: (e) => console.log(e.target.value),
  },
};

export const NumberType: Story = {
  render: TextInputWrapper,
  args: {
    id: 'number-input',
    label: '반복 간격',
    value: 1,
    type: 'number',
    onChange: (e) => console.log(e.target.value),
    inputProps: { min: 1 },
  },
};

export const WithError: Story = {
  render: TextInputWrapper,
  args: {
    id: 'error-input',
    label: '시작 시간',
    value: '18:00',
    type: 'time',
    error: true,
    errorMessage: '종료 시간은 시작 시간보다 늦어야 합니다.',
    onChange: (e) => console.log(e.target.value),
  },
};

export const Disabled: Story = {
  render: TextInputWrapper,
  args: {
    id: 'disabled-input',
    label: '비활성화된 입력',
    value: '수정할 수 없습니다',
    disabled: true,
    onChange: (e) => console.log(e.target.value),
  },
};

export const Required: Story = {
  render: TextInputWrapper,
  args: {
    id: 'required-input',
    label: '필수 입력',
    value: '',
    required: true,
    placeholder: '필수 입력 항목입니다',
    onChange: (e) => console.log(e.target.value),
  },
};

export const MediumSize: Story = {
  render: TextInputWrapper,
  args: {
    id: 'medium-input',
    label: '중간 크기',
    value: '',
    size: 'medium',
    placeholder: '중간 크기 입력',
    onChange: (e) => console.log(e.target.value),
  },
};

export const WithPlaceholder: Story = {
  render: TextInputWrapper,
  args: {
    id: 'placeholder-input',
    label: '설명',
    value: '',
    placeholder: '일정에 대한 설명을 입력하세요',
    onChange: (e) => console.log(e.target.value),
  },
};
