import type { Meta, StoryObj } from '@storybook/react-vite';

import Dialog from './Dialog';

const meta = {
  title: 'Example/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '다이얼로그 제목',
    },
    maxWidth: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', false],
      description: '다이얼로그 최대 너비',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '기본 다이얼로그',
    children: '이것은 기본 다이얼로그 컨텐츠입니다.',
    actions: [
      {
        label: '취소',
        onClick: () => console.log('취소 클릭'),
        color: 'inherit',
        variant: 'text',
      },
      {
        label: '확인',
        onClick: () => console.log('확인 클릭'),
        color: 'primary',
        variant: 'contained',
      },
    ],
  },
};

export const TwoButtonsDialog: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '확인 다이얼로그',
    children: '이 작업을 진행하시겠습니까?',
    actions: [
      {
        label: '취소',
        onClick: () => console.log('취소'),
        color: 'inherit',
        variant: 'text',
      },
      {
        label: '확인',
        onClick: () => console.log('확인'),
        color: 'primary',
        variant: 'contained',
      },
    ],
  },
};

export const ThreeButtonsDialog: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '반복 일정 수정',
    children: '해당 일정만 수정하시겠어요?',
    actions: [
      {
        label: '취소',
        onClick: () => console.log('취소'),
        color: 'inherit',
        variant: 'text',
      },
      {
        label: '아니오',
        onClick: () => console.log('전체 수정'),
        color: 'primary',
        variant: 'outlined',
      },
      {
        label: '예',
        onClick: () => console.log('단일 수정'),
        color: 'primary',
        variant: 'contained',
      },
    ],
  },
};

export const ErrorDialog: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '삭제 확인',
    children: '정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    actions: [
      {
        label: '취소',
        onClick: () => console.log('취소'),
        color: 'inherit',
        variant: 'text',
      },
      {
        label: '삭제',
        onClick: () => console.log('삭제'),
        color: 'error',
        variant: 'contained',
      },
    ],
  },
};

export const WarningDialog: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '경고',
    children: '이 작업은 시스템에 영향을 미칠 수 있습니다. 계속 진행하시겠습니까?',
    actions: [
      {
        label: '취소',
        onClick: () => console.log('취소'),
        color: 'inherit',
        variant: 'text',
      },
      {
        label: '계속 진행',
        onClick: () => console.log('진행'),
        color: 'warning',
        variant: 'contained',
      },
    ],
  },
};

export const SuccessDialog: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '성공',
    children: '작업이 성공적으로 완료되었습니다!',
    actions: [
      {
        label: '확인',
        onClick: () => console.log('확인'),
        color: 'success',
        variant: 'contained',
      },
    ],
  },
};

export const FullWidthDialog: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '전체 너비 다이얼로그',
    children: '이 다이얼로그는 전체 너비를 사용합니다.',
    fullWidth: true,
    actions: [
      {
        label: '닫기',
        onClick: () => console.log('닫기'),
        color: 'primary',
        variant: 'contained',
      },
    ],
  },
};

export const LargeDialog: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '큰 다이얼로그',
    children:
      '이것은 큰 다이얼로그입니다. 많은 컨텐츠를 표시할 수 있습니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    maxWidth: 'lg',
    fullWidth: true,
    actions: [
      {
        label: '취소',
        onClick: () => console.log('취소'),
        color: 'inherit',
        variant: 'text',
      },
      {
        label: '저장',
        onClick: () => console.log('저장'),
        color: 'primary',
        variant: 'contained',
      },
    ],
  },
};

export const SmallDialog: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '작은 다이얼로그',
    children: '간단한 메시지',
    maxWidth: 'xs',
    actions: [
      {
        label: '확인',
        onClick: () => console.log('확인'),
        color: 'primary',
        variant: 'contained',
      },
    ],
  },
};

export const WithAccessibility: Story = {
  args: {
    open: true,
    onClose: () => console.log('닫기'),
    title: '접근성이 적용된 다이얼로그',
    children: '이 다이얼로그는 접근성 속성이 적용되어 있습니다.',
    ariaLabelledby: 'accessible-dialog-title',
    ariaDescribedby: 'accessible-dialog-description',
    actions: [
      {
        label: '닫기',
        onClick: () => console.log('닫기'),
        color: 'primary',
        variant: 'contained',
      },
    ],
  },
};
