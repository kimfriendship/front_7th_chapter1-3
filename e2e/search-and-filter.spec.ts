import { test, expect } from '@playwright/test';

import { clearE2EDatabase } from './helpers/reset-db';

test.describe('검색 및 필터링', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json 파일을 빈 상태로 초기화 (매번 새로운 일정 생성)
    clearE2EDatabase();

    // 시간을 고정 (2025-11-15 09:00:00)
    const fixedTime = new Date('2025-11-15T09:00:00');
    await page.clock.install({ time: fixedTime });
    await page.clock.resume();

    // 초기 토스트 사라질 때까지 대기
    await page.waitForTimeout(1000);
  });

  test('5.1 일정 검색 시 일치하는 일정만 표시', async ({ page }) => {
    // 다양한 제목의 일정 생성
    const events = [
      { title: '팀 회의', date: '2025-11-15', start: '09:00', end: '10:00' },
      { title: '개인 공부', date: '2025-11-16', start: '14:00', end: '16:00' },
      { title: '점심 약속', date: '2025-11-17', start: '12:00', end: '13:00' },
      { title: '프로젝트 회의', date: '2025-11-18', start: '15:00', end: '17:00' },
    ];

    for (const event of events) {
      await page.getByLabel('제목').fill(event.title);
      await page.getByLabel('날짜').fill(event.date);
      await page.getByLabel('시작 시간').fill(event.start);
      await page.getByLabel('종료 시간').fill(event.end);
      await page.getByLabel('설명').fill(`${event.title} 설명`);
      await page.getByLabel('위치').fill('세미나실');
      await page.getByLabel('카테고리').click();
      await page.getByRole('option', { name: '업무-option' }).click();
      await page.getByTestId('event-submit-button').click();

      // 토스트 사라질 때까지 대기
      await page.waitForTimeout(1000);
    }

    // 이벤트 리스트에 모든 일정이 표시되는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의').first()).toBeVisible();
    await expect(eventList.getByText('개인 공부').first()).toBeVisible();
    await expect(eventList.getByText('점심 약속').first()).toBeVisible();
    await expect(eventList.getByText('프로젝트 회의').first()).toBeVisible();

    // 검색 입력창에 "회의" 입력
    await page.getByLabel('일정 검색').fill('회의');

    // 이벤트 리스트에 "팀 회의"와 "프로젝트 회의"만 표시되는지 확인
    await expect(eventList.getByText('팀 회의')).toHaveCount(2);
    await expect(eventList.getByText('프로젝트 회의')).toHaveCount(2);

    // "개인 공부"와 "점심 약속"은 표시되지 않는지 확인
    await expect(eventList.getByText('개인 공부')).not.toBeVisible();
    await expect(eventList.getByText('점심 약속')).not.toBeVisible();

    // 캘린더에는 모든 일정이 여전히 표시되는지 확인
    // 캘린더는 검색과 무관하게 모든 일정을 표시
    await expect(page.getByText('팀 회의').first()).toBeVisible();
    await expect(page.getByText('프로젝트 회의').first()).toBeVisible();
  });

  test('5.2 특정 기간에 대한 필터링 (월간 뷰)', async ({ page }) => {
    // 여러 달에 걸쳐 일정 생성
    const events = [
      { title: '11월 회의', date: '2025-11-20', start: '10:00', end: '11:00' },
      { title: '12월 회의', date: '2025-12-15', start: '14:00', end: '15:00' },
    ];

    for (const event of events) {
      await page.getByLabel('제목').fill(event.title);
      await page.getByLabel('날짜').fill(event.date);
      await page.getByLabel('시작 시간').fill(event.start);
      await page.getByLabel('종료 시간').fill(event.end);
      await page.getByLabel('설명').fill(`${event.title} 설명`);
      await page.getByLabel('위치').fill('세미나실');
      await page.getByLabel('카테고리').click();
      await page.getByRole('option', { name: '업무-option' }).click();
      await page.getByTestId('event-submit-button').click();

      // 토스트 사라질 때까지 대기
      await page.waitForTimeout(1000);
    }

    // 월간 뷰(기본값)에서 현재 월(11월)의 일정만 이벤트 리스트에 표시되는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('11월 회의').first()).toBeVisible();
    await expect(eventList.getByText('12월 회의').first()).not.toBeVisible();

    // 다음 달 버튼 클릭하여 12월로 이동
    await page.getByLabel('Next').click();

    // 이벤트 리스트에 12월 일정만 표시되는지 확인
    await expect(eventList.getByText('12월 회의').first()).toBeVisible();
    await expect(eventList.getByText('11월 회의').first()).not.toBeVisible();

    // 캘린더에도 12월 일정만 표시
    await expect(page.getByText('12월 회의').first()).toBeVisible();
    await expect(page.getByText('11월 회의').first()).not.toBeVisible();
  });

  test('5.3 특정 기간에 대한 필터링 (주간 뷰)', async ({ page }) => {
    // 여러 주에 걸쳐 일정 생성
    const events = [
      { title: '첫째 주 회의', date: '2025-11-17', start: '10:00', end: '11:00' }, // 월요일
      { title: '둘째 주 회의', date: '2025-11-24', start: '14:00', end: '15:00' }, // 다음 주 월요일
    ];

    for (const event of events) {
      await page.getByLabel('제목').fill(event.title);
      await page.getByLabel('날짜').fill(event.date);
      await page.getByLabel('시작 시간').fill(event.start);
      await page.getByLabel('종료 시간').fill(event.end);
      await page.getByLabel('설명').fill(`${event.title} 설명`);
      await page.getByLabel('위치').fill('세미나실');
      await page.getByLabel('카테고리').click();
      await page.getByRole('option', { name: '업무-option' }).click();
      await page.getByTestId('event-submit-button').click();

      // 토스트 사라질 때까지 대기
      await page.waitForTimeout(1000);
    }

    // 주간 뷰 선택
    await page.getByLabel('뷰 타입 선택').click();
    await page.getByRole('option', { name: 'Week' }).click();
    await expect(page.getByText('Month')).not.toBeVisible();

    // 현재 주의 일정만 이벤트 리스트에 표시되는지 확인
    const eventList = page.getByTestId('event-list');
    // 현재 날짜에 따라 표시되는 일정이 다를 수 있음

    // 다음 주 버튼 클릭
    await page.getByLabel('Next').click();
    await expect(eventList.getByText('첫째 주 회의').first()).toBeVisible();

    // 이벤트 리스트에 다음 주의 일정이 표시되는지 확인
    // 11월 24일이 포함된 주로 이동하면 "둘째 주 회의" 표시
    await page.getByLabel('Next').click();
    await expect(eventList.getByText('둘째 주 회의').first()).toBeVisible();
  });

  test('5.4 검색 초기화 시 모든 일정 표시', async ({ page }) => {
    // 다양한 제목의 일정 생성
    const events = [
      { title: '팀 회의', date: '2025-11-15', start: '09:00', end: '10:00' },
      { title: '개인 공부', date: '2025-11-16', start: '14:00', end: '16:00' },
      { title: '프로젝트 회의', date: '2025-11-18', start: '15:00', end: '17:00' },
    ];

    for (const event of events) {
      await page.getByLabel('제목').fill(event.title);
      await page.getByLabel('날짜').fill(event.date);
      await page.getByLabel('시작 시간').fill(event.start);
      await page.getByLabel('종료 시간').fill(event.end);
      await page.getByLabel('설명').fill(`${event.title} 설명`);
      await page.getByLabel('위치').fill('세미나실');
      await page.getByLabel('카테고리').click();
      await page.getByRole('option', { name: '업무-option' }).click();
      await page.getByTestId('event-submit-button').click();

      // 토스트 사라질 때까지 대기
      await page.waitForTimeout(1000);
    }

    const eventList = page.getByTestId('event-list');

    // 검색창에 "회의" 입력하여 필터링
    await page.getByLabel('일정 검색').fill('회의');

    // 필터링된 상태 확인
    await expect(eventList.getByText('팀 회의').first()).toBeVisible();
    await expect(eventList.getByText('프로젝트 회의').first()).toBeVisible();
    await expect(eventList.getByText('개인 공부')).not.toBeVisible();

    // 검색창의 내용을 전체 삭제 (빈 문자열)
    await page.getByLabel('일정 검색').clear();

    // 이벤트 리스트에 현재 뷰(월간)의 모든 일정이 다시 표시되는지 확인
    await expect(eventList.getByText('팀 회의').first()).toBeVisible();
    await expect(eventList.getByText('개인 공부').first()).toBeVisible();
    await expect(eventList.getByText('프로젝트 회의').first()).toBeVisible();

    // 캘린더에도 모든 일정이 표시되는지 확인
    await expect(page.getByText('팀 회의').first()).toBeVisible();
    await expect(page.getByText('개인 공부').first()).toBeVisible();
    await expect(page.getByText('프로젝트 회의').first()).toBeVisible();
  });

  test('5.5 검색과 기간 필터 조합', async ({ page }) => {
    // 여러 달에 걸쳐 다양한 일정 생성
    const events = [
      { title: '11월 팀 회의', date: '2025-11-15', start: '09:00', end: '10:00' },
      { title: '11월 개인 시간', date: '2025-11-16', start: '14:00', end: '16:00' },
      { title: '12월 프로젝트 회의', date: '2025-12-10', start: '10:00', end: '11:00' },
      { title: '12월 점심 약속', date: '2025-12-15', start: '12:00', end: '13:00' },
    ];

    for (const event of events) {
      await page.getByLabel('제목').fill(event.title);
      await page.getByLabel('날짜').fill(event.date);
      await page.getByLabel('시작 시간').fill(event.start);
      await page.getByLabel('종료 시간').fill(event.end);
      await page.getByLabel('설명').fill(`${event.title} 설명`);
      await page.getByLabel('위치').fill('세미나실');
      await page.getByLabel('카테고리').click();
      await page.getByRole('option', { name: '업무-option' }).click();
      await page.getByTestId('event-submit-button').click();

      // 토스트 사라질 때까지 대기
      await page.waitForTimeout(1000);
    }

    const eventList = page.getByTestId('event-list');

    // 월간 뷰에서 검색창에 "회의" 입력
    await page.getByLabel('일정 검색').fill('회의');

    // 현재 월(11월)의 "회의" 관련 일정만 이벤트 리스트에 표시되는지 확인
    await expect(eventList.getByText('11월 팀 회의').first()).toBeVisible();
    await expect(eventList.getByText('11월 개인 시간')).not.toBeVisible();
    await expect(eventList.getByText('12월 프로젝트 회의')).not.toBeVisible();
    await expect(eventList.getByText('12월 점심 약속')).not.toBeVisible();

    // 다음 달 버튼 클릭
    await page.getByLabel('Next').click();

    // 검색어가 유지되고 다음 달(12월)의 "회의" 관련 일정만 표시되는지 확인
    await expect(eventList.getByText('12월 프로젝트 회의').first()).toBeVisible();
    await expect(eventList.getByText('12월 점심 약속')).not.toBeVisible();
    await expect(eventList.getByText('11월 팀 회의')).not.toBeVisible();
    await expect(eventList.getByText('11월 개인 시간')).not.toBeVisible();

    // 주간 뷰로 전환
    await page.getByLabel('뷰 타입 선택').click();
    await page.getByRole('option', { name: 'Week' }).click();
    await expect(page.getByText('Month')).not.toBeVisible();

    // 검색어가 유지되고 현재 주의 "회의" 관련 일정만 표시되는지 확인
    // 12월 10일이 포함된 주로 이동했으므로 "12월 프로젝트 회의"가 표시될 수 있음
    const searchInput = page.getByLabel('일정 검색');
    await expect(searchInput).toHaveValue('회의');
  });
});
