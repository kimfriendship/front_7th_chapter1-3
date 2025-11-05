import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Box } from '@mui/material';

import SelectInput from './SelectInput';

const meta = {
  title: 'Example/SelectInput',
  component: SelectInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Select 크기',
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
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const SelectInputWrapper = (args: any) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <Box sx={{ width: 300 }}>
      <SelectInput
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    </Box>
  );
};

export const Default: Story = {
  render: SelectInputWrapper,
  args: {
    id: 'default-select',
    label: '옵션 선택',
    value: 'option1',
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
    onChange: (value) => console.log(value),
  },
};

export const Category: Story = {
  render: SelectInputWrapper,
  args: {
    id: 'category-select',
    label: '카테고리',
    value: '업무',
    options: [
      { value: '업무', label: '업무' },
      { value: '개인', label: '개인' },
      { value: '가족', label: '가족' },
      { value: '기타', label: '기타' },
    ],
    onChange: (value) => console.log(value),
  },
};

export const RepeatType: Story = {
  render: SelectInputWrapper,
  args: {
    id: 'repeat-type-select',
    label: '반복 유형',
    value: 'daily',
    options: [
      { value: 'daily', label: '매일' },
      { value: 'weekly', label: '매주' },
      { value: 'monthly', label: '매월' },
      { value: 'yearly', label: '매년' },
    ],
    ariaLabel: '반복 유형',
    onChange: (value) => console.log(value),
  },
};

export const Notification: Story = {
  render: SelectInputWrapper,
  args: {
    id: 'notification-select',
    label: '알림 설정',
    value: 10,
    options: [
      { value: 1, label: '1분 전' },
      { value: 10, label: '10분 전' },
      { value: 60, label: '1시간 전' },
      { value: 120, label: '2시간 전' },
      { value: 1440, label: '1일 전' },
    ],
    onChange: (value) => console.log(value),
  },
};

export const Disabled: Story = {
  render: SelectInputWrapper,
  args: {
    id: 'disabled-select',
    label: '비활성화된 선택',
    value: 'option1',
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
    ],
    disabled: true,
    onChange: (value) => console.log(value),
  },
};

export const Required: Story = {
  render: SelectInputWrapper,
  args: {
    id: 'required-select',
    label: '필수 선택',
    value: '',
    options: [
      { value: '', label: '선택하세요' },
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
    ],
    required: true,
    onChange: (value) => console.log(value),
  },
};

export const MediumSize: Story = {
  render: SelectInputWrapper,
  args: {
    id: 'medium-select',
    label: '중간 크기',
    value: 'option1',
    size: 'medium',
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
    onChange: (value) => console.log(value),
  },
};

export const ManyOptions: Story = {
  render: SelectInputWrapper,
  args: {
    id: 'many-options-select',
    label: '많은 옵션',
    value: 'option5',
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `옵션 ${i + 1}`,
    })),
    onChange: (value) => console.log(value),
  },
};
