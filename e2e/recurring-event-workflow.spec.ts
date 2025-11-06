import { test, expect } from '@playwright/test';

import { resetE2EDatabase } from './helpers/reset-db';

test.describe('반복 일정 관리 워크플로우', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json 파일을 초기 상태로 리셋
    resetE2EDatabase();

    // 시간을 고정 (2025-11-17 09:00:00 - 월요일)
    const fixedTime = new Date('2025-11-17T09:00:00');
    await page.clock.install({ time: fixedTime });
    await page.clock.resume();

    // 페이지로 이동
    await page.goto('/');

    // 초기 토스트 사라질 때까지 대기
    await page.waitForTimeout(1000);
  });

  test('2.1 반복 일정 추가하기', async ({ page }) => {
    // 제목 "주간 회의" 입력
    await page.getByLabel('제목').fill('주간 회의');

    // 날짜 선택 (월요일)
    await page.getByLabel('날짜').fill('2025-11-17'); // 월요일

    // 시작 시간 "14:00" 입력
    await page.getByLabel('시작 시간').fill('14:00');

    // 종료 시간 "15:00" 입력
    await page.getByLabel('종료 시간').fill('15:00');

    // 설명 입력
    await page.getByLabel('설명').fill('주간 정기 회의');

    // 위치 입력
    await page.getByLabel('위치').fill('회의실 C');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();

    // 반복 일정 체크박스 선택
    await page.getByLabel('반복 일정').check();

    // 반복 유형 "매주" 선택
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'weekly-option' }).click();

    // 반복 간격 "1" 입력 (기본값이 1이면 생략 가능)
    await page.getByLabel('반복 간격').fill('1');

    // 종료일 설정 (4주 후)
    await page.getByLabel('반복 종료일').fill('2025-12-08');

    // "일정 추가" 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // 월간 캘린더에 반복 일정들(4개)이 표시되는지 확인
    const weeklyEvents = page.getByText('주간 회의');
    await expect(weeklyEvents.first()).toBeVisible();

    // 이벤트 리스트에 모든 반복 일정이 표시되는지 확인
    const eventList = page.getByTestId('event-list');
    const eventsInList = eventList.getByText('주간 회의');
    await expect(eventsInList.first()).toBeVisible();

    // 각 일정에 반복 아이콘이 표시되는지 확인
    const repeatIcons = eventList.getByTestId('RepeatIcon');
    await expect(repeatIcons.first()).toBeVisible();

    // "일정이 추가되었습니다" 토스트 메시지 확인
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();
  });

  test('2.2 반복 일정 수정 → 단일로 수정', async ({ page }) => {
    // 먼저 반복 일정 추가
    await page.getByLabel('제목').fill('주간 스탠드업');
    await page.getByLabel('날짜').fill('2025-11-17');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('10:30');
    await page.getByLabel('반복 일정').check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'weekly-option' }).click();
    await page.getByLabel('반복 종료일').fill('2025-12-08');
    await page.getByTestId('event-submit-button').click();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1500);

    // 반복 일정 중 하나의 편집 버튼 클릭
    await page.getByLabel('Edit event').nth(1).click();

    // "반복 일정 수정" 다이얼로그가 표시되는지 확인
    await expect(page.getByText('반복 일정 수정')).toBeVisible();

    // "예(해당 일정만 수정)" 버튼 클릭
    await page.getByRole('button', { name: '예' }).click();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(500);

    // 제목을 "긴급 회의"로 변경
    await page.getByLabel('제목').clear();
    await page.getByLabel('제목').fill('긴급 회의');

    // "일정 수정" 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // 해당 일정만 제목이 변경되고 다른 반복 일정은 유지되는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('긴급 회의')).toBeVisible();
    await expect(eventList.getByText('주간 스탠드업')).toBeVisible();

    // 수정된 일정의 반복 아이콘이 사라졌는지 확인 (단일 일정으로 변환)
    // "긴급 회의"는 단일 일정이므로 반복 아이콘이 없어야 함
    // "주간 스탠드업"은 여전히 반복 일정이므로 반복 아이콘이 있어야 함
    const repeatIcons = eventList.getByTestId('RepeatIcon');
    await expect(repeatIcons).toHaveCount(1);
  });

  test('2.3 반복 일정 수정 → 모두 수정', async ({ page }) => {
    // 먼저 반복 일정 추가
    await page.getByLabel('제목').fill('팀 리뷰');
    await page.getByLabel('날짜').fill('2025-11-18');
    await page.getByLabel('시작 시간').fill('16:00');
    await page.getByLabel('종료 시간').fill('17:00');
    await page.getByLabel('반복 일정').check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'weekly-option' }).click();
    await page.getByLabel('반복 종료일').fill('2025-12-09');
    await page.getByTestId('event-submit-button').click();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1500);

    // 반복 일정 중 하나의 편집 버튼 클릭
    await page.getByLabel('Edit event').nth(1).click();

    // "반복 일정 수정" 다이얼로그에서 "아니오(모든 일정 수정)" 버튼 클릭
    await page.getByRole('button', { name: '아니오' }).click();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(500);

    // 제목을 "전체 팀 리뷰"로 변경
    await page.getByLabel('제목').clear();
    await page.getByLabel('제목').fill('전체 팀 리뷰');

    // 카테고리를 "개인"으로 변경
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인-option' }).click();

    // "일정 수정" 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // 같은 시리즈의 모든 반복 일정의 제목이 변경되는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('전체 팀 리뷰').first()).toBeVisible();

    // 모든 일정에 여전히 반복 아이콘이 표시되는지 확인
    const repeatIcons = eventList.getByTestId('RepeatIcon');
    await expect(repeatIcons).toHaveCount(2);
  });

  test('2.4 반복 일정 삭제 → 단일로 삭제', async ({ page }) => {
    // 먼저 반복 일정 추가
    await page.getByLabel('제목').fill('주간 보고');
    await page.getByLabel('날짜').fill('2025-11-19');
    await page.getByLabel('시작 시간').fill('11:00');
    await page.getByLabel('종료 시간').fill('12:00');
    await page.getByLabel('반복 일정').check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'weekly-option' }).click();
    await page.getByLabel('반복 종료일').fill('2025-12-10');
    await page.getByTestId('event-submit-button').click();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1500);

    // 삭제 전 반복 일정이 여러 개 존재하는지 확인
    const eventList = page.getByTestId('event-list');
    const eventsBeforeDelete = eventList.getByText('주간 보고');
    await expect(eventsBeforeDelete.first()).toBeVisible();

    // 반복 일정 중 하나의 삭제 버튼 클릭
    await page.getByLabel('Delete event').nth(1).click();

    // "반복 일정 삭제" 다이얼로그가 표시되는지 확인
    await expect(page.getByText('반복 일정 삭제')).toBeVisible();

    // "예(해당 일정만 삭제)" 버튼 클릭
    await page.getByRole('button', { name: '예' }).click();

    // 다른 반복 일정은 유지되는지 확인
    await expect(eventList.getByText('2025-11-19')).not.toBeVisible();
    await expect(eventList.getByText('주간 보고')).toBeVisible();
  });

  test('2.5 반복 일정 삭제 → 모두 삭제', async ({ page }) => {
    // 먼저 반복 일정 추가
    await page.getByLabel('제목').fill('주간 점검');
    await page.getByLabel('날짜').fill('2025-11-20');
    await page.getByLabel('시작 시간').fill('13:00');
    await page.getByLabel('종료 시간').fill('14:00');
    await page.getByLabel('반복 일정').check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: 'weekly-option' }).click();
    await page.getByLabel('반복 종료일').fill('2025-12-11');
    await page.getByTestId('event-submit-button').click();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1500);

    // 삭제 전 반복 일정이 존재하는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('주간 점검').first()).toBeVisible();

    // 반복 일정 중 하나의 삭제 버튼 클릭
    await page.getByLabel('Delete event').nth(1).click();

    // "반복 일정 삭제" 다이얼로그에서 "아니오(모든 일정 삭제)" 버튼 클릭
    await page.getByRole('button', { name: '아니오' }).click();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(500);

    // 같은 시리즈의 모든 반복 일정이 제거되는지 확인
    await expect(eventList.getByText('주간 점검')).not.toBeVisible();

    // "일정이 삭제되었습니다" 토스트 메시지가 표시되는지 확인
    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();
  });
});
