import { test, expect } from '@playwright/test';

import { resetE2EDatabase } from './helpers/reset-db';

test.describe('알림 시스템', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json 파일을 초기 상태로 리셋
    resetE2EDatabase();

    // 초기 토스트 사라질 때까지 대기
    await page.waitForTimeout(1000);
  });

  test('4.1 알림 설정한 시간에 일정 알림 표시', async ({ page }) => {
    // 시간을 고정 (2025-11-20 09:00:00)
    const fixedTime = new Date('2025-11-20T09:00:00');
    await page.clock.install({ time: fixedTime });
    await page.clock.resume();

    // 페이지 재로드 (고정된 시간으로)
    await page.reload();
    await page.waitForTimeout(1000);

    // 10분 후 시작되는 일정 생성 (09:10 시작)
    const eventStartTime = new Date(fixedTime.getTime() + 10 * 60 * 1000);
    const dateString = eventStartTime.toISOString().split('T')[0]; // 2025-11-20
    const startTimeString = '09:10';
    const endTimeString = '10:10';

    // 제목 "곧 시작할 회의" 입력
    await page.getByLabel('제목').fill('곧 시작할 회의');

    // 날짜: 2025-11-20
    await page.getByLabel('날짜').fill(dateString);

    // 시작 시간: 09:10
    await page.getByLabel('시작 시간').fill(startTimeString);

    // 종료 시간: 10:10
    await page.getByLabel('종료 시간').fill(endTimeString);

    // 설명 입력
    await page.getByLabel('설명').fill('긴급 회의');

    // 위치 입력
    await page.getByLabel('위치').fill('회의실 A');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();

    // "일정 추가" 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // "일정이 추가되었습니다" 토스트 메시지 확인
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1500);

    // 알림이 즉시 표시되어야 함 (현재 시간이 09:00이고, 일정 시작이 09:10이므로 10분 전 = 지금)
    // 알림 시스템이 1초마다 체크하므로 약간의 시간 진행 필요
    await page.clock.fastForward(2000); // 2초 진행

    // 알림 메시지 "10분 후 곧 시작할 회의 일정이 시작됩니다." 표시 확인
    await expect(page.getByTestId('InfoOutlinedIcon')).toBeVisible();
    await expect(page.getByText('10분 후 곧 시작할 회의 일정이 시작됩니다.')).toBeVisible();

    // 알림의 닫기 버튼 클릭
    const closeButton = page.getByTestId('CloseIcon');
    await closeButton.click();

    // 알림이 사라졌는지 확인
    await expect(page.getByText('10분 후 곧 시작할 회의 일정이 시작됩니다.')).not.toBeVisible();
  });

  test('4.2 같은 일정에 대한 중복 알림 방지', async ({ page }) => {
    // 시간을 고정 (2025-11-21 10:00:00)
    const fixedTime = new Date('2025-11-21T10:00:00');
    await page.clock.install({ time: fixedTime });
    await page.clock.resume();

    // 페이지 재로드 (고정된 시간으로)
    await page.reload();
    await page.waitForTimeout(1000);

    // 첫 번째 일정: "곧 시작할 회의" 생성 (10:10 시작)
    const dateString = '2025-11-21';
    const startTimeString = '10:10';
    const endTimeString = '11:10';

    await page.getByLabel('제목').fill('곧 시작할 회의');
    await page.getByLabel('날짜').fill(dateString);
    await page.getByLabel('시작 시간').fill(startTimeString);
    await page.getByLabel('종료 시간').fill(endTimeString);
    await page.getByLabel('설명').fill('첫 번째 회의');
    await page.getByLabel('위치').fill('회의실 A');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();

    // 일정 추가
    await page.getByTestId('event-submit-button').click();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1500);

    // 시간을 2초 진행시켜 알림 시스템이 체크하도록
    await page.clock.fastForward(2000);

    // 알림이 표시되는지 확인
    await expect(page.getByTestId('InfoOutlinedIcon')).toBeVisible();
    await expect(page.getByText('10분 후 곧 시작할 회의 일정이 시작됩니다.')).toBeVisible();

    // 알림 닫기
    const firstCloseButton = page.getByTestId('CloseIcon');
    await firstCloseButton.click();
    await expect(page.getByText('10분 후 곧 시작할 회의 일정이 시작됩니다.')).not.toBeVisible();

    // 시간을 2초 더 진행 (알림 시스템이 다시 체크)
    await page.clock.fastForward(2000);

    // 같은 일정에 대한 알림이 다시 표시되지 않는지 확인 (중복 방지)
    await expect(page.getByText('10분 후 곧 시작할 회의 일정이 시작됩니다.')).not.toBeVisible();

    // 다른 일정을 10분 이내 시작으로 추가 생성
    // 현재 시간: 10:00+4초, 새 일정 시작: 10:11, 알림 시간: 10:01 (10분 전)
    await page.getByLabel('제목').fill('다른 회의');
    await page.getByLabel('날짜').fill(dateString);
    await page.getByLabel('시작 시간').fill('10:11');
    await page.getByLabel('종료 시간').fill('11:11');
    await page.getByLabel('설명').fill('두 번째 회의');
    await page.getByLabel('위치').fill('회의실 B');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();

    // 일정 추가
    await page.getByTestId('event-submit-button').click();

    // 일정 겹침 경고 다이얼로그가 표시되는지 확인 (10:11-11:11이 10:10-11:10과 겹침)
    await expect(page.getByText('일정 겹침')).toBeVisible();
    await expect(page.getByText('다음 일정과 겹칩니다')).toBeVisible();

    // "계속 진행" 버튼 클릭하여 일정 저장
    await page.getByRole('button', { name: '계속 진행' }).click();

    // "일정이 추가되었습니다" 토스트 메시지 확인
    await expect(page.getByText('일정이 추가되었습니다').first()).toBeVisible();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1500);

    // 현재 시간 10:00+4초 → 10:01로 진행하여 "다른 회의" 알림 조건 만족
    await page.clock.fastForward(58000); // 약 58초 진행 → 10:01+2초

    // 이제 "다른 회의" 알림이 표시되어야 함
    await expect(page.getByText('10분 후 다른 회의 일정이 시작됩니다.')).toBeVisible();

    // 이전 일정("곧 시작할 회의")에 대한 중복 알림은 표시되지 않는지 확인
    await expect(page.getByText('10분 후 곧 시작할 회의 일정이 시작됩니다.')).not.toBeVisible();

    // 알림이 하나만 있는지 확인 (다른 회의 알림만)
    const allAlerts = page.getByTestId('InfoOutlinedIcon');
    await expect(allAlerts).toHaveCount(1);
  });
});
