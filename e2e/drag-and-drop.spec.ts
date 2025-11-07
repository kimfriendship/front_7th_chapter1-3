import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { resetE2EDatabase } from './helpers/reset-db';

test.describe.serial('드래그 앤 드롭', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json 파일을 초기 상태로 리셋
    resetE2EDatabase();

    // "팀 회의" 일정 추가
    const e2eDataPath = path.join(process.cwd(), 'src/__mocks__/response/e2e.json');
    const currentData = JSON.parse(fs.readFileSync(e2eDataPath, 'utf8'));

    currentData.events.push({
      id: 'e2e-test-event-2',
      title: '팀 회의',
      date: '2025-11-04',
      startTime: '10:00',
      endTime: '11:00',
      description: '드래그 앤 드롭 테스트용 일정',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    });

    fs.writeFileSync(e2eDataPath, JSON.stringify(currentData, null, 2));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 시간을 고정 (2025-11-15 09:00:00)
    const fixedTime = new Date('2025-11-04T09:00:00');
    await page.clock.install({ time: fixedTime });
    await page.clock.resume();

    // 초기 로딩 대기
    await page.waitForTimeout(1000);
  });

  test('월간 캘린더에서 일정을 다른 주로 드래그 이동', async ({ page }) => {
    // 1. 초기 데이터: "팀 회의" 일정 (2025-11-15 10:00-11:00)
    // 2. 월간 캘린더 뷰 확인
    await expect(page.getByText('2025년 11월')).toBeVisible();

    // 3. 2025-11-15 셀에 "팀 회의" EventBar 표시 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('2025-11-04')).toBeVisible();
    await expect(eventList.getByText('10:00 - 11:00')).toBeVisible();

    // 캘린더에서도 "팀 회의" 표시 확인 (첫 번째 항목)
    const teamMeetingInCalendar = page.getByText('팀 회의').first();
    await expect(teamMeetingInCalendar).toBeVisible();

    // 4. EventBar를 마우스로 드래그 시작
    const calendar = page.getByTestId('month-view');
    const sourceEventBar = page.getByText('팀 회의').first();
    await expect(sourceEventBar).toBeVisible();

    // 5. 드래그 중 시각적 피드백 확인: opacity 감소
    const initialOpacity = await sourceEventBar.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(initialOpacity).toBe('1');

    // 6. 2025-11-07 CalendarCell 찾기 (다른 주)
    const targetCell = page.locator('td').filter({ hasText: /^7$/ }).first();
    await expect(targetCell).toBeVisible();

    // 7. 드래그 앤 드롭 실행 (수동 드래그 방식)
    // EventBar의 위치 가져오기
    const eventBarBox = await sourceEventBar.boundingBox();
    if (!eventBarBox) throw new Error('EventBar not found');

    // 대상 셀의 위치 가져오기
    const targetBox = await targetCell.boundingBox();
    if (!targetBox) throw new Error('Target cell not found');

    // 드래그 시작: EventBar 중앙으로 이동
    await page.mouse.move(
      eventBarBox.x + eventBarBox.width / 2,
      eventBarBox.y + eventBarBox.height / 2
    );
    await page.mouse.down();

    // 조금 이동 (드래그 시작을 위해)
    await page.mouse.move(
      eventBarBox.x + eventBarBox.width / 2 + 10,
      eventBarBox.y + eventBarBox.height / 2 + 10
    );

    // 대상 셀로 이동
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
      steps: 10,
    });

    // 드롭
    await page.mouse.up();

    // 8. 드롭 후 확인: 성공 토스트 (약간의 대기 시간 필요)
    await expect(page.getByText('일정이 이동되었습니다.')).toBeVisible({ timeout: 5000 });

    // 9. 이벤트 리스트에서 확인: 날짜 변경, 시간 유지
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('2025-11-07')).toBeVisible();
    await expect(eventList.getByText('10:00 - 11:00')).toBeVisible();

    // 10. 2025-11-22 셀에 "팀 회의" 표시 확인
    // 캘린더에서 "팀 회의"가 여전히 표시되는지 확인 (위치가 변경됨)
    await expect(page.getByText('팀 회의').first()).toBeVisible();
  });
});
