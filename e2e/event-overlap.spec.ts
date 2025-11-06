import { test, expect } from '@playwright/test';

import { resetE2EDatabase } from './helpers/reset-db';

test.describe.serial('일정 겹침 처리', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json 파일을 초기 상태로 리셋
    resetE2EDatabase();

    // 페이지로 이동
    await page.goto('/');

    // 초기 토스트 사라질 때까지 대기
    await page.waitForTimeout(1000);
  });

  test('3.1 같은 시간대 일정 추가 시 겹침 모달 → 계속 진행 선택', async ({ page }) => {
    // "기존 회의" 일정이 "2025-11-15 09:00-10:00"에 존재하는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('기존 회의')).toBeVisible();
    await expect(eventList.getByText('2025-11-15')).toBeVisible();
    await expect(eventList.getByText('09:00 - 10:00')).toBeVisible();

    // 새 일정 제목 "신규 회의" 입력
    await page.getByLabel('제목').fill('신규 회의');

    // 같은 날짜 "2025-11-15" 입력
    await page.getByLabel('날짜').fill('2025-11-15');

    // 시간 "09:30-10:30" 입력 (시간 겹침)
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:30');

    // 설명 입력
    await page.getByLabel('설명').fill('신규 미팅');

    // 위치 입력
    await page.getByLabel('위치').fill('회의실 B');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();

    // "일정 추가" 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // "일정 겹침 경고" 다이얼로그가 표시되는지 확인
    await expect(page.getByText('일정 겹침')).toBeVisible();

    // "다음 일정과 겹칩니다:" 메시지와 겹치는 일정 정보 표시 확인
    await expect(page.getByText('다음 일정과 겹칩니다')).toBeVisible();

    // "계속 진행" 또는 "계속" 버튼 클릭
    await page.getByRole('button', { name: /계속|진행/ }).click();

    // "일정이 추가되었습니다" 토스트 메시지가 표시되는지 확인
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();

    // 겹치는 두 일정이 모두 이벤트 리스트에 표시되는지 확인
    await expect(eventList.getByText('기존 회의')).toBeVisible();
    await expect(eventList.getByText('신규 회의')).toBeVisible();

    // 겹치는 두 일정이 모두 날짜 셀에 표시되는지 확인
    await expect(page.getByText('기존 회의').first()).toBeVisible();
    await expect(page.getByText('신규 회의').first()).toBeVisible();
  });

  test('3.2 같은 시간대 일정 추가 시 겹침 모달 → 취소 선택', async ({ page }) => {
    // 먼저 "점심 회의" 일정 추가 (2025-11-16 12:00-13:00)
    await page.getByLabel('제목').fill('점심 회의');
    await page.getByLabel('날짜').fill('2025-11-16');
    await page.getByLabel('시작 시간').fill('12:00');
    await page.getByLabel('종료 시간').fill('13:00');
    await page.getByLabel('설명').fill('점심 시간 회의');
    await page.getByLabel('위치').fill('카페');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();
    await page.getByTestId('event-submit-button').click();

    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1500);

    // "점심 회의" 일정이 존재하는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('점심 회의')).toBeVisible();
    await expect(eventList.getByText('2025-11-16')).toBeVisible();
    await expect(eventList.getByText('12:00 - 13:00')).toBeVisible();

    // 새 일정 제목 "점심 식사" 입력
    await page.getByLabel('제목').fill('점심 식사');

    // 같은 날짜 "2025-11-16" 입력
    await page.getByLabel('날짜').fill('2025-11-16');

    // 시간 "12:30-13:30" 입력 (시간 겹침)
    await page.getByLabel('시작 시간').fill('12:30');
    await page.getByLabel('종료 시간').fill('13:30');

    // 설명 입력
    await page.getByLabel('설명').fill('점심 식사 시간');

    // 위치 입력
    await page.getByLabel('위치').fill('식당');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인-option' }).click();

    // "일정 추가" 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // "일정 겹침 경고" 다이얼로그가 표시되는지 확인
    await expect(page.getByText('일정 겹침')).toBeVisible();

    // "취소" 버튼 클릭
    await page.getByRole('button', { name: '취소' }).click();

    // 다이얼로그가 닫히는지 확인
    await expect(page.getByText('일정 겹침')).not.toBeVisible();

    // 새 일정이 생성되지 않았는지 확인 (이벤트 리스트)
    await expect(eventList.getByText('점심 식사')).not.toBeVisible();

    // 기존 "점심 회의"는 여전히 존재하는지 확인
    await expect(eventList.getByText('점심 회의')).toBeVisible();

    // 일정 폼의 데이터는 그대로 유지되는지 확인 (사용자가 시간을 수정할 수 있도록)
    await expect(page.getByLabel('제목')).toHaveValue('점심 식사');
    await expect(page.getByLabel('날짜')).toHaveValue('2025-11-16');
    await expect(page.getByLabel('시작 시간')).toHaveValue('12:30');
    await expect(page.getByLabel('종료 시간')).toHaveValue('13:30');
  });
});
