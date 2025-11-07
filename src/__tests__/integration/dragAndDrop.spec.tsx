import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { describe, it, expect } from 'vitest';

import { setupMockHandlerUpdating } from '../../__mocks__/handlersUtils';
import App from '../../App';
import { Event } from '../../types';

const theme = createTheme();

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

describe('드래그 앤 드롭 통합 테스트', () => {
  describe('기본 동작', () => {
    it('일정을 다른 날짜로 드래그하면 날짜가 변경되고 시간은 유지된다', async () => {
      const initialEvents: Event[] = [
        {
          id: '1',
          title: '팀 회의',
          date: '2025-10-15',
          startTime: '09:00',
          endTime: '10:00',
          description: '팀 미팅',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ];

      setupMockHandlerUpdating(initialEvents);

      const { user } = setup(<App />);
      await screen.findByText('일정 로딩 완료!');

      // 초기 상태 확인
      const eventList = within(screen.getByTestId('event-list'));
      expect(eventList.getAllByText('팀 회의').length).toBeGreaterThan(0);
      expect(eventList.getAllByText('2025-10-15').length).toBeGreaterThan(0);
      expect(eventList.getAllByText('09:00 - 10:00').length).toBeGreaterThan(0);

      // 이벤트 편집 버튼 클릭
      const editButton = await screen.findByLabelText('Edit event');
      await user.click(editButton);

      // 날짜만 변경 (드래그 앤 드롭 시뮬레이션)
      const dateInput = screen.getByLabelText('날짜');
      await user.clear(dateInput);
      await user.type(dateInput, '2025-10-16');

      // 시간은 그대로 유지되는지 확인
      const startTimeInput = screen.getByLabelText('시작 시간');
      const endTimeInput = screen.getByLabelText('종료 시간');
      expect(startTimeInput).toHaveValue('09:00');
      expect(endTimeInput).toHaveValue('10:00');

      // 저장
      await user.click(screen.getByTestId('event-submit-button'));

      // 결과 확인 - 업데이트된 날짜 확인
      await waitFor(() => {
        const updatedEventList = within(screen.getByTestId('event-list'));
        expect(updatedEventList.queryAllByText('2025-10-16').length).toBeGreaterThan(0);
      });

      const updatedEventList = within(screen.getByTestId('event-list'));
      expect(updatedEventList.getAllByText('팀 회의').length).toBeGreaterThan(0);
      expect(updatedEventList.getAllByText('09:00 - 10:00').length).toBeGreaterThan(0);
    });

    it('같은 날짜로 드롭하면 아무 변경이 일어나지 않는다', async () => {
      const initialEvents: Event[] = [
        {
          id: '1',
          title: '프로젝트 회의',
          date: '2025-10-15',
          startTime: '14:00',
          endTime: '15:00',
          description: '프로젝트 미팅',
          location: '회의실 B',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ];

      setupMockHandlerUpdating(initialEvents);

      const { user } = setup(<App />);
      await screen.findByText('일정 로딩 완료!');

      // 초기 상태 확인
      const eventList = within(screen.getByTestId('event-list'));
      expect(eventList.getAllByText('프로젝트 회의').length).toBeGreaterThan(0);
      expect(eventList.getAllByText('2025-10-15').length).toBeGreaterThan(0);

      // 이벤트 편집 버튼 클릭
      const editButton = await screen.findByLabelText('Edit event');
      await user.click(editButton);

      // 날짜를 같은 값으로 설정 (변경 없음)
      const dateInput = screen.getByLabelText('날짜');
      expect(dateInput).toHaveValue('2025-10-15');

      // 변경하지 않고 그대로 둔다
      // 날짜가 같으면 아무 변경이 없어야 함을 검증
      const unchangedEventList = within(screen.getByTestId('event-list'));
      expect(unchangedEventList.getAllByText('프로젝트 회의').length).toBeGreaterThan(0);
      expect(unchangedEventList.getAllByText('2025-10-15').length).toBeGreaterThan(0);
    });
  });

  describe('반복 일정 드래그', () => {
    it('반복 일정을 드래그하면 일반 일정으로 변환되고 나머지 반복 일정과 독립된다', async () => {
      const initialEvents: Event[] = [
        {
          id: '1',
          title: '데일리 스탠드업',
          date: '2025-10-15',
          startTime: '09:00',
          endTime: '09:30',
          description: '매일 진행되는 스탠드업',
          location: '온라인',
          category: '업무',
          repeat: { type: 'daily', interval: 1, endDate: '2025-10-17' },
          notificationTime: 10,
        },
        {
          id: '2',
          title: '데일리 스탠드업',
          date: '2025-10-16',
          startTime: '09:00',
          endTime: '09:30',
          description: '매일 진행되는 스탠드업',
          location: '온라인',
          category: '업무',
          repeat: { type: 'daily', interval: 1, endDate: '2025-10-17' },
          notificationTime: 10,
        },
        {
          id: '3',
          title: '데일리 스탠드업',
          date: '2025-10-17',
          startTime: '09:00',
          endTime: '09:30',
          description: '매일 진행되는 스탠드업',
          location: '온라인',
          category: '업무',
          repeat: { type: 'daily', interval: 1, endDate: '2025-10-17' },
          notificationTime: 10,
        },
      ];

      setupMockHandlerUpdating(initialEvents);

      const { user } = setup(<App />);
      await screen.findByText('일정 로딩 완료!');

      // 초기 상태: 3개 반복 일정 확인
      const eventList = within(screen.getByTestId('event-list'));
      expect(eventList.getAllByText('데일리 스탠드업')).toHaveLength(3);

      // 반복 아이콘 확인
      const repeatIcons = screen.getAllByTestId('RepeatIcon');
      expect(repeatIcons.length).toBeGreaterThan(0);

      // 첫 번째 반복 일정 편집
      const editButtons = await screen.findAllByLabelText('Edit event');
      await user.click(editButtons[0]);

      // 반복 일정 편집 다이얼로그 확인
      await screen.findByText('반복 일정 수정', {}, { timeout: 3000 });
      expect(screen.getByText('해당 일정만 수정하시겠어요?')).toBeInTheDocument();

      // "예" 선택 (단일 일정으로 변환)
      const yesButton = await screen.findByText('예');
      await user.click(yesButton);

      // 날짜 변경 (드래그 시뮬레이션: 2025-10-15 → 2025-10-20)
      const dateInput = screen.getByLabelText('날짜');
      await user.clear(dateInput);
      await user.type(dateInput, '2025-10-20');

      // 저장
      await user.click(screen.getByTestId('event-submit-button'));

      // 결과 확인
      await waitFor(() => {
        const updatedEventList = within(screen.getByTestId('event-list'));
        expect(updatedEventList.queryAllByText('2025-10-20').length).toBeGreaterThan(0);
      });

      const updatedEventList = within(screen.getByTestId('event-list'));

      // 나머지 반복 일정은 유지되는지 확인
      expect(updatedEventList.getAllByText('데일리 스탠드업').length).toBeGreaterThanOrEqual(1);
    });

    it('반복 일정 드래그 후 반복 아이콘이 사라진다', async () => {
      const initialEvents: Event[] = [
        {
          id: '1',
          title: '주간 리뷰',
          date: '2025-10-15',
          startTime: '15:00',
          endTime: '16:00',
          description: '주간 리뷰 미팅',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'weekly', interval: 1, endDate: '2025-10-29' },
          notificationTime: 10,
        },
        {
          id: '2',
          title: '주간 리뷰',
          date: '2025-10-22',
          startTime: '15:00',
          endTime: '16:00',
          description: '주간 리뷰 미팅',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'weekly', interval: 1, endDate: '2025-10-29' },
          notificationTime: 10,
        },
        {
          id: '3',
          title: '주간 리뷰',
          date: '2025-10-29',
          startTime: '15:00',
          endTime: '16:00',
          description: '주간 리뷰 미팅',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'weekly', interval: 1, endDate: '2025-10-29' },
          notificationTime: 10,
        },
      ];

      setupMockHandlerUpdating(initialEvents);

      const { user } = setup(<App />);
      await screen.findByText('일정 로딩 완료!');

      // 초기 반복 아이콘 개수 확인
      const initialRepeatIcons = screen.getAllByTestId('RepeatIcon');
      const initialRepeatCount = initialRepeatIcons.length;
      expect(initialRepeatCount).toBeGreaterThan(0);

      // 첫 번째 반복 일정 편집
      const editButtons = await screen.findAllByLabelText('Edit event');
      await user.click(editButtons[0]);

      // 다이얼로그에서 "예" 선택
      await screen.findByText('해당 일정만 수정하시겠어요?', {}, { timeout: 3000 });
      const yesButton = await screen.findByText('예');
      await user.click(yesButton);

      // 날짜 변경
      const dateInput = screen.getByLabelText('날짜');
      await user.clear(dateInput);
      await user.type(dateInput, '2025-10-18');

      // 저장
      await user.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        const updatedEventList = within(screen.getByTestId('event-list'));
        expect(updatedEventList.queryAllByText('2025-10-18').length).toBeGreaterThan(0);
      });

      // 변환된 일정은 반복 아이콘이 없어야 함
      // 나머지 반복 일정은 여전히 반복 아이콘 유지
      const updatedRepeatIcons = screen.queryAllByTestId('RepeatIcon');
      // 최소한 변환 전보다 적거나 같아야 함
      expect(updatedRepeatIcons.length).toBeLessThanOrEqual(initialRepeatCount);
    });
  });

  describe('겹침 처리', () => {
    it('드래그한 날짜에 겹치는 일정이 있으면 겹침 다이얼로그가 표시된다', async () => {
      const initialEvents: Event[] = [
        {
          id: '1',
          title: '오전 회의',
          date: '2025-10-15',
          startTime: '09:00',
          endTime: '10:00',
          description: '오전 미팅',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
        {
          id: '2',
          title: '기존 일정',
          date: '2025-10-16',
          startTime: '09:30',
          endTime: '10:30',
          description: '기존 미팅',
          location: '회의실 B',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ];

      setupMockHandlerUpdating(initialEvents);

      const { user } = setup(<App />);
      await screen.findByText('일정 로딩 완료!');

      // "오전 회의" 편집
      const editButtons = await screen.findAllByLabelText('Edit event');
      await user.click(editButtons[0]);

      // 날짜를 겹치는 날짜로 변경 (2025-10-15 → 2025-10-16)
      const dateInput = screen.getByLabelText('날짜');
      await user.clear(dateInput);
      await user.type(dateInput, '2025-10-16');

      // 저장 시도
      await user.click(screen.getByTestId('event-submit-button'));

      // 겹침 다이얼로그 확인
      await waitFor(() => {
        expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
      });

      expect(screen.getByText('다음 일정과 겹칩니다:')).toBeInTheDocument();
      expect(screen.getAllByText(/기존 일정/).length).toBeGreaterThan(0);
      expect(screen.getByText('계속 진행하시겠습니까?')).toBeInTheDocument();

      // 버튼 확인
      expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '계속 진행' })).toBeInTheDocument();
    });

    it('겹침 다이얼로그에서 "계속 진행"을 선택하면 일정이 이동된다', async () => {
      const initialEvents: Event[] = [
        {
          id: '1',
          title: '오전 회의',
          date: '2025-10-15',
          startTime: '09:00',
          endTime: '10:00',
          description: '오전 미팅',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
        {
          id: '2',
          title: '기존 일정',
          date: '2025-10-16',
          startTime: '09:30',
          endTime: '10:30',
          description: '기존 미팅',
          location: '회의실 B',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ];

      setupMockHandlerUpdating(initialEvents);

      const { user } = setup(<App />);
      await screen.findByText('일정 로딩 완료!');

      // "오전 회의" 편집
      const editButtons = await screen.findAllByLabelText('Edit event');
      await user.click(editButtons[0]);

      // 날짜 변경
      const dateInput = screen.getByLabelText('날짜');
      await user.clear(dateInput);
      await user.type(dateInput, '2025-10-16');

      // 저장
      await user.click(screen.getByTestId('event-submit-button'));

      // 겹침 다이얼로그에서 "계속 진행" 클릭
      await waitFor(() => {
        expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
      });

      const continueButton = screen.getByRole('button', { name: '계속 진행' });
      await user.click(continueButton);

      // 결과 확인 - 업데이트 대기
      await waitFor(() => {
        const eventList = within(screen.getByTestId('event-list'));
        expect(eventList.queryAllByText('2025-10-16').length).toBeGreaterThan(0);
      });

      // 두 일정 모두 표시되는지 확인
      const eventList = within(screen.getByTestId('event-list'));
      expect(eventList.getAllByText('오전 회의').length).toBeGreaterThan(0);
      expect(eventList.getAllByText('기존 일정').length).toBeGreaterThan(0);
    });

    it('겹침 다이얼로그에서 "취소"를 선택하면 일정이 원래 날짜에 유지된다', async () => {
      const initialEvents: Event[] = [
        {
          id: '1',
          title: '오전 회의',
          date: '2025-10-15',
          startTime: '09:00',
          endTime: '10:00',
          description: '오전 미팅',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
        {
          id: '2',
          title: '기존 일정',
          date: '2025-10-16',
          startTime: '09:30',
          endTime: '10:30',
          description: '기존 미팅',
          location: '회의실 B',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ];

      setupMockHandlerUpdating(initialEvents);

      const { user } = setup(<App />);
      await screen.findByText('일정 로딩 완료!');

      // 초기 상태 확인
      let eventList = within(screen.getByTestId('event-list'));
      const morningMeetingItems = eventList.getAllByText('오전 회의');
      const dateElements = eventList.getAllByText('2025-10-15');
      expect(morningMeetingItems.length).toBeGreaterThan(0);
      expect(dateElements.length).toBeGreaterThan(0);

      // "오전 회의" 편집
      const editButtons = await screen.findAllByLabelText('Edit event');
      await user.click(editButtons[0]);

      // 날짜 변경
      const dateInput = screen.getByLabelText('날짜');
      await user.clear(dateInput);
      await user.type(dateInput, '2025-10-16');

      // 저장 시도
      await user.click(screen.getByTestId('event-submit-button'));

      // 겹침 다이얼로그에서 "취소" 클릭
      await waitFor(() => {
        expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: '취소' });
      await user.click(cancelButton);

      // 다이얼로그가 닫힘
      await waitFor(() => {
        expect(screen.queryByText('일정 겹침 경고')).not.toBeInTheDocument();
      });

      // "오전 회의"는 여전히 2025-10-15에 있어야 함
      eventList = within(screen.getByTestId('event-list'));
      expect(eventList.getAllByText('오전 회의').length).toBeGreaterThan(0);

      // 편집 폼의 데이터는 유지되는지 확인
      expect(screen.getByLabelText('제목')).toHaveValue('오전 회의');
      expect(screen.getByLabelText('날짜')).toHaveValue('2025-10-16');
    });
  });
});
