import { test, expect } from '@playwright/test';

import { resetE2EDatabase } from './helpers/reset-db';

test.describe.serial('기본 일정 관리 워크플로우 (CRUD)', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json 파일을 초기 상태로 리셋
    resetE2EDatabase();

    // 페이지로 이동
    await page.goto('/');
  });

  test('1.1 페이지 로드 시 저장된 일정 표시', async ({ page }) => {
    // "일정 로딩 완료!" 토스트 메시지가 표시되는지 확인 (중복 표시될 수 있으므로 first() 사용)
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    // 저장되어 있던 일정("기존 회의")이 해당 날짜 셀에 표시되는지 확인
    // 2025-11-15의 일정이 캘린더에 표시됨
    await expect(page.getByText('기존 회의').first()).toBeVisible();

    // 저장되어 있던 일정이 우측 이벤트 리스트에 표시되는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('기존 회의')).toBeVisible();
    await expect(eventList.getByText('2025-11-15')).toBeVisible();
    await expect(eventList.getByText('09:00 - 10:00')).toBeVisible();
  });

  test('1.2 일정 생성 및 저장', async ({ page }) => {
    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1000);

    // 제목 "팀 회의" 입력
    await page.getByLabel('제목').fill('팀 회의');

    // 날짜 선택
    await page.getByLabel('날짜').fill('2025-11-20');

    // 시작 시간 "09:00" 입력
    await page.getByLabel('시작 시간').fill('11:00');

    // 종료 시간 "10:00" 입력
    await page.getByLabel('종료 시간').fill('12:00');

    // 설명 "주간 팀 미팅" 입력
    await page.getByLabel('설명').fill('주간 팀 미팅');

    // 위치 "회의실 A" 입력
    await page.getByLabel('위치').fill('회의실 B');

    // 카테고리 "업무" 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무-option' }).click();

    // "일정 추가" 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // 해당 날짜 셀에 일정이 등록되는지 확인
    await expect(page.getByText('팀 회의').first()).toBeVisible();

    // 이벤트 리스트에 새로운 일정이 추가되는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('2025-11-20')).toBeVisible();
    await expect(eventList.getByText('11:00 - 12:00')).toBeVisible();
    await expect(eventList.getByText('주간 팀 미팅')).toBeVisible();
    await expect(eventList.getByText('회의실 B')).toBeVisible();

    // "일정이 추가되었습니다" 토스트 메시지가 표시되는지 확인
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();
  });

  test('1.3 일정 수정', async ({ page }) => {
    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1000);

    // 이벤트 리스트에 있던 일정의 편집 버튼 클릭
    await page.getByLabel('Edit event').first().click();

    // 일정 폼에 기존 데이터가 채워져 있는지 확인
    await expect(page.getByLabel('제목')).toHaveValue('기존 회의');
    await expect(page.getByLabel('시작 시간')).toHaveValue('09:00');
    await expect(page.getByLabel('종료 시간')).toHaveValue('10:00');

    // 제목을 "전체 회의"로 수정
    await page.getByLabel('제목').clear();
    await page.getByLabel('제목').fill('전체 회의');

    // 시간을 "13:00-14:00"으로 수정
    await page.getByLabel('시작 시간').clear();
    await page.getByLabel('종료 시간').clear();
    await page.getByLabel('시작 시간').fill('13:00');
    await page.getByLabel('종료 시간').fill('14:00');

    // "일정 수정" 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // 날짜 셀과 이벤트 리스트에 수정 내용이 반영되는지 확인
    await expect(page.getByText('전체 회의').first()).toBeVisible();

    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('전체 회의')).toBeVisible();
    await expect(eventList.getByText('13:00 - 14:00')).toBeVisible();

    // "일정이 수정되었습니다" 토스트 메시지가 표시되는지 확인
    await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();
  });

  test('1.4 일정 삭제', async ({ page }) => {
    // 토스트 사라질 때까지 대기
    await page.waitForTimeout(1000);

    // 삭제 전 일정이 존재하는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('기존 회의')).toBeVisible();

    // 이벤트 리스트에 있던 일정의 삭제 버튼 클릭
    await page.getByLabel('Delete event').first().click();

    // 해당 날짜 셀에서 일정이 제거되는지 확인
    // 이벤트 리스트에서 일정이 제거되는지 확인
    await expect(eventList.getByText('기존 회의')).not.toBeVisible();

    // "일정이 삭제되었습니다" 토스트 메시지가 표시되는지 확인
    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();
  });
});
