# 드래그 앤 드롭 테스트 설계

## 1. 개요

캘린더 애플리케이션의 드래그 앤 드롭 기능에 대한 테스트 설계 문서입니다.

### 테스트 범위

- **통합 테스트**: Vitest + React Testing Library를 사용한 컴포넌트 및 상태 관리 테스트
- **E2E 테스트**: Playwright를 사용한 실제 브라우저 환경 테스트

### 주요 검증 사항

1. 일정을 드래그하여 다른 날짜로 이동
2. 드래그 시 겹침 처리 및 다이얼로그 표시
3. 반복 일정 드래그 시 단일 일정으로 변환 및 독립

---

## 2. 통합 테스트 (Vitest)

### 테스트 파일: `src/__tests__/integration/dragAndDrop.spec.tsx`

#### 테스트 환경 설정

```typescript
/**
 * 드래그 앤 드롭 통합 테스트
 *
 * 기술 스택:
 * - @dnd-kit/core: 드래그 앤 드롭 라이브러리
 * - Vitest: 테스트 프레임워크
 * - React Testing Library: 컴포넌트 테스트
 *
 * 테스트 요구사항:
 * - dnd-kit을 사용한 일정 드래그 앤 드롭 검증
 * - 드래그 시 겹침 다이얼로그 표시 확인
 * - 반복 일정 드래그 시 일반 일정으로 변환 및 독립 확인
 * - CalendarCell 간 드래그 (주단위, 월단위 캘린더)
 * - 날짜만 변경, 시간 유지 확인
 */
```

### 2.1 드래그 앤 드롭 기본 동작

#### 테스트 케이스 1: 일정을 다른 날짜로 드래그하면 날짜가 변경되고 시간은 유지된다

**테스트 시나리오**:

1. 초기 데이터: "팀 회의" 일정 (2025-11-15 09:00-10:00)
2. EventBar를 2025-11-16 CalendarCell로 드래그 앤 드롭
3. API 호출 검증: PUT /api/events/:id
4. 업데이트된 일정 확인: 2025-11-16 09:00-10:00
5. 성공 토스트 표시 확인: "일정이 수정되었습니다"

**검증 포인트**:

- 날짜만 변경됨 (2025-11-15 → 2025-11-16)
- 시간은 유지됨 (09:00-10:00)
- API 페이로드에 올바른 날짜 포함
- 이벤트 리스트에서 새 날짜로 표시

**예상 데이터**:

```typescript
// 드래그 전
{
  id: '1',
  title: '팀 회의',
  date: '2025-11-15',
  startTime: '09:00',
  endTime: '10:00',
  // ... 기타 속성
}

// 드래그 후
{
  id: '1',
  title: '팀 회의',
  date: '2025-11-16', // 날짜만 변경
  startTime: '09:00',  // 시간 유지
  endTime: '10:00',    // 시간 유지
  // ... 기타 속성
}
```

---

#### 테스트 케이스 2: 같은 날짜로 드롭하면 아무 변경이 일어나지 않는다

**테스트 시나리오**:

1. 초기 데이터: "프로젝트 회의" 일정 (2025-11-15 14:00-15:00)
2. EventBar를 같은 날짜 2025-11-15 CalendarCell로 드래그
3. API 호출이 발생하지 않음을 검증
4. 일정 데이터가 변경되지 않음을 확인

**검증 포인트**:

- API 호출 없음 (Mock API 호출 횟수 0)
- 이벤트 데이터 동일
- 토스트 메시지 표시 없음

---

### 2.2 반복 일정 드래그

#### 테스트 케이스 3: 반복 일정을 드래그하면 일반 일정으로 변환되고 나머지 반복 일정과 독립된다

**테스트 시나리오**:

1. 초기 데이터: 매일 반복 일정 "데일리 스탠드업" (2025-11-15~2025-11-17, 09:00-09:30)
   - 총 3개 일정: 2025-11-15, 2025-11-16, 2025-11-17
2. 첫 번째 일정 (2025-11-15)을 2025-11-20으로 드래그
3. 드래그된 일정 검증:
   - date: '2025-11-20'
   - repeat.type: 'none'
   - repeat.interval: 0
4. 나머지 반복 일정 (2025-11-16, 2025-11-17) 유지 확인

**검증 포인트**:

- 드래그된 일정이 일반 일정으로 변환 (repeat.type = 'none')
- 드래그된 일정이 새 날짜로 이동 (2025-11-20)
- 나머지 반복 일정은 그대로 유지 (2025-11-16, 2025-11-17)
- API 호출: PUT /api/events/:id (단일 일정 수정)

**예상 데이터**:

```typescript
// 드래그 전 (반복 일정)
{
  id: '1',
  title: '데일리 스탠드업',
  date: '2025-11-15',
  startTime: '09:00',
  endTime: '09:30',
  repeat: { type: 'daily', interval: 1, endDate: '2025-11-17' }
}

// 드래그 후 (일반 일정으로 변환)
{
  id: '1',
  title: '데일리 스탠드업',
  date: '2025-11-20',      // 새 날짜
  startTime: '09:00',
  endTime: '09:30',
  repeat: { type: 'none', interval: 0 }  // 반복 해제
}

// 나머지 반복 일정들은 그대로 유지
// id: '2', date: '2025-11-16', repeat: { type: 'daily', ... }
// id: '3', date: '2025-11-17', repeat: { type: 'daily', ... }
```

---

#### 테스트 케이스 4: 반복 일정 드래그 후 반복 아이콘이 사라진다

**테스트 시나리오**:

1. 초기 데이터: 주간 반복 일정 "주간 리뷰" (2025-11-15, 2025-11-22, 2025-11-29)
2. 첫 번째 일정을 2025-11-18로 드래그
3. 드래그된 일정에서 RepeatIcon이 표시되지 않음 확인
4. 나머지 반복 일정 (2025-11-22, 2025-11-29)에는 RepeatIcon 유지

**검증 포인트**:

- 드래그된 일정: RepeatIcon 미표시 (data-testid="RepeatIcon" 없음)
- 나머지 반복 일정: RepeatIcon 표시 유지
- 이벤트 리스트에서 시각적 구분 가능

---

### 2.3 겹침 처리

#### 테스트 케이스 5: 드래그한 날짜에 겹치는 일정이 있으면 겹침 다이얼로그가 표시된다

**테스트 시나리오**:

1. 초기 데이터:
   - "오전 회의" 일정 (2025-11-15 09:00-10:00)
   - "기존 일정" 일정 (2025-11-16 09:30-10:30)
2. "오전 회의"를 2025-11-16으로 드래그
3. 겹침 감지 (09:00-10:00 vs 09:30-10:30)
4. "일정 겹침" 다이얼로그 표시 확인

**검증 포인트**:

- 다이얼로그 제목: "일정 겹침"
- 메시지: "다음 일정과 겹칩니다"
- 겹치는 일정 정보 표시: "기존 일정" (2025-11-16 09:30-10:30)
- 버튼: "취소", "계속 진행" (또는 "계속")

**다이얼로그 UI 요소**:

```
[일정 겹침]
다음 일정과 겹칩니다:
- 기존 일정 (2025-11-16 09:30-10:30)

[취소] [계속 진행]
```

---

#### 테스트 케이스 6: 겹침 다이얼로그에서 "계속 진행"을 선택하면 일정이 이동된다

**테스트 시나리오**:

1. 테스트 케이스 5의 상황에서 계속
2. 겹침 다이얼로그에서 "계속 진행" 버튼 클릭
3. API 호출 검증: PUT /api/events/:id
4. 일정 이동 확인: "오전 회의"가 2025-11-16에 표시
5. 성공 토스트 확인: "일정이 수정되었습니다"
6. 겹치는 두 일정 모두 이벤트 리스트에 표시

**검증 포인트**:

- API 호출 발생
- 두 일정 모두 2025-11-16에 표시
- 겹침 상태로 유지 (시간 겹침 허용)
- 다이얼로그 닫힘

---

#### 테스트 케이스 7: 겹침 다이얼로그에서 "취소"를 선택하면 일정이 원래 날짜에 유지된다

**테스트 시나리오**:

1. 테스트 케이스 5의 상황에서 계속
2. 겹침 다이얼로그에서 "취소" 버튼 클릭
3. API 호출이 발생하지 않음을 검증
4. 일정이 원래 날짜에 유지됨 확인: "오전 회의"가 2025-11-15에 표시
5. 다이얼로그 닫힘

**검증 포인트**:

- API 호출 없음
- "오전 회의"는 2025-11-15에 그대로 유지
- "기존 일정"은 2025-11-16에 그대로 유지
- 다이얼로그 닫힘 (screen.queryByText('일정 겹침').not.toBeInTheDocument())

---

## 3. E2E 테스트 (Playwright)

### 테스트 파일: `e2e/drag-and-drop.spec.ts`

#### 테스트 환경 설정

```typescript
/**
 * 드래그 앤 드롭 E2E 테스트
 *
 * 실제 브라우저 환경에서 dnd-kit 드래그 앤 드롭 동작 검증
 * - 시각적 피드백 확인
 * - 실제 마우스 드래그 시뮬레이션
 * - 월간/주간 캘린더 뷰 전환 테스트
 */

test.describe('드래그 앤 드롭', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');

    // e2e.json 파일을 초기 상태로 리셋
    resetE2EDatabase();

    // 시간 고정 (2025-11-15 09:00:00)
    const fixedTime = new Date('2025-11-15T09:00:00');
    await page.clock.install({ time: fixedTime });
    await page.clock.resume();

    // 초기 로딩 대기
    await page.waitForTimeout(1000);
  });

  // 테스트 케이스들...
});
```

---

### 3.1 E2E 드래그 앤 드롭 시나리오

#### 테스트 케이스 8: 월간 캘린더에서 일정을 드래그하여 다른 주로 이동할 수 있다

**테스트 시나리오**:

1. 초기 데이터: "팀 회의" 일정 (2025-11-15 10:00-11:00)
2. 월간 캘린더 뷰 확인
3. 2025-11-15 셀에 "팀 회의" EventBar 표시 확인
4. EventBar를 마우스로 드래그 시작
5. 드래그 중 시각적 피드백 확인:
   - EventBar의 opacity 감소 (`opacity: 0.6`)
   - 커서 변경 (`cursor: grabbing`)
6. 2025-11-22 CalendarCell 위로 드래그
7. 드롭 대상 시각적 피드백 확인:
   - CalendarCell 배경색 변경 (`backgroundColor: #fff3e0`)
8. 2025-11-22 CalendarCell에 드롭
9. 드롭 후 확인:
   - 2025-11-22 셀에 "팀 회의" 표시
   - 2025-11-15 셀에는 더 이상 표시되지 않음
   - 성공 토스트: "일정이 수정되었습니다"
10. 이벤트 리스트에서 확인:
    - "팀 회의" 날짜: 2025-11-22
    - 시간 유지: 10:00 - 11:00

**검증 포인트**:

- 드래그 시작 시각 효과 (`isDragging` 상태)
- 드롭 대상 hover 효과 (`isOver` 상태)
- 다른 주로 이동 가능 (2025-11-15 → 2025-11-22)
- 날짜만 변경, 시간 유지
- API 호출 및 UI 업데이트

**Playwright 코드 예시**:

```typescript
// EventBar 찾기
const eventBar = page.locator('text=팀 회의').first();
await expect(eventBar).toBeVisible();

// 드래그 앤 드롭 수행
const targetCell = page.locator('[data-date="2025-11-22"]'); // 예시
await eventBar.dragTo(targetCell);

// 결과 검증
await expect(page.locator('text=일정이 수정되었습니다')).toBeVisible();
await expect(targetCell.locator('text=팀 회의')).toBeVisible();
```

---

## 4. 테스트 구현 가이드

### 4.1 dnd-kit 테스트 유틸리티

**통합 테스트에서의 dnd-kit 시뮬레이션**:

```typescript
import { fireEvent } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';

// dnd-kit은 마우스 이벤트를 사용하므로
// fireEvent 또는 특수 헬퍼 함수 필요
// @testing-library/user-event는 dnd-kit과 호환성 제한 있음

// 드래그 시뮬레이션 예시
const dragStart = (element: HTMLElement) => {
  fireEvent.mouseDown(element);
  fireEvent.dragStart(element);
};

const drop = (element: HTMLElement) => {
  fireEvent.dragOver(element);
  fireEvent.drop(element);
  fireEvent.mouseUp(element);
};
```

### 4.2 Playwright 드래그 앤 드롭

**Playwright API 사용**:

```typescript
// 방법 1: dragTo() 메서드
await page
  .locator('[data-testid="event-bar-1"]')
  .dragTo(page.locator('[data-testid="calendar-cell-2025-11-20"]'));

// 방법 2: mouse 이벤트 직접 제어
const source = await page.locator('[data-testid="event-bar-1"]').boundingBox();
const target = await page.locator('[data-testid="calendar-cell-2025-11-20"]').boundingBox();

await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
await page.mouse.down();
await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2);
await page.mouse.up();
```

### 4.3 Mock 데이터 설정

**반복 일정 Mock 데이터**:

```typescript
const recurringEvents = [
  {
    id: '1',
    title: '데일리 스탠드업',
    date: '2025-11-15',
    startTime: '09:00',
    endTime: '09:30',
    description: '매일 진행되는 스탠드업',
    location: '온라인',
    category: '업무',
    repeat: { type: 'daily', interval: 1, endDate: '2025-11-17' },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '데일리 스탠드업',
    date: '2025-11-16',
    startTime: '09:00',
    endTime: '09:30',
    description: '매일 진행되는 스탠드업',
    location: '온라인',
    category: '업무',
    repeat: { type: 'daily', interval: 1, endDate: '2025-11-17' },
    notificationTime: 10,
  },
  // ...
];
```

### 4.4 겹침 검증 로직

**겹침 감지 유틸리티**:

```typescript
import { findOverlappingEvents } from '@/utils/eventOverlap';

// 테스트에서 겹침 확인
const movedEvent = { ...originalEvent, date: '2025-11-16' };
const overlapping = findOverlappingEvents(movedEvent, allEvents);

expect(overlapping.length).toBeGreaterThan(0);
```

---

## 5. 테스트 케이스 요약

| #   | 분류      | 테스트 케이스                                                 | 프레임워크 |
| --- | --------- | ------------------------------------------------------------- | ---------- |
| 1   | 기본 동작 | 일정을 다른 날짜로 드래그하면 날짜가 변경되고 시간은 유지된다 | Vitest     |
| 2   | 기본 동작 | 같은 날짜로 드롭하면 아무 변경이 일어나지 않는다              | Vitest     |
| 3   | 반복 일정 | 반복 일정을 드래그하면 일반 일정으로 변환되고 독립된다        | Vitest     |
| 4   | 반복 일정 | 반복 일정 드래그 후 반복 아이콘이 사라진다                    | Vitest     |
| 5   | 겹침 처리 | 겹치는 일정이 있으면 겹침 다이얼로그가 표시된다               | Vitest     |
| 6   | 겹침 처리 | 겹침 다이얼로그에서 "계속 진행" 선택 시 일정 이동             | Vitest     |
| 7   | 겹침 처리 | 겹침 다이얼로그에서 "취소" 선택 시 원래 위치 유지             | Vitest     |
| 8   | E2E       | 월간 캘린더에서 일정을 다른 주로 드래그 이동                  | Playwright |

**총 8개 테스트 케이스**

- 통합 테스트 (Vitest): 7개
- E2E 테스트 (Playwright): 1개

---

## 6. 테스트 실행

### 통합 테스트 실행

```bash
# 전체 통합 테스트
pnpm test src/__tests__/integration/dragAndDrop.spec.tsx

# watch 모드
pnpm test:watch src/__tests__/integration/dragAndDrop.spec.tsx
```

### E2E 테스트 실행

```bash
# 전체 E2E 테스트
pnpm test:e2e e2e/drag-and-drop.spec.ts

# UI 모드 (드래그 동작 시각적 확인)
pnpm test:e2e:ui e2e/drag-and-drop.spec.ts
```

---

## 7. 예상 이슈 및 해결 방안

### 이슈 1: dnd-kit 테스트 어려움

- **문제**: @testing-library/user-event가 dnd-kit과 완벽히 호환되지 않음
- **해결**: fireEvent 또는 @dnd-kit/testing-utils 사용 검토

### 이슈 2: 드래그 중 비동기 처리

- **문제**: 드래그 후 API 호출 타이밍 이슈
- **해결**: waitFor, findBy 쿼리 활용

### 이슈 3: 반복 일정 변환 로직

- **문제**: 반복 일정을 일반 일정으로 변환하는 로직 복잡도
- **해결**: 명확한 테스트 데이터와 예상 결과 정의

---

## 8. 참고 문서

- [드래그 앤 드롭 기능 명세서](./.claude/docs/DRAG_AND_DROP_SPEC.md)
- [드래그 앤 드롭 투두리스트](./.claude/docs/DRAG_AND_DROP_TODO.md)
- [dnd-kit 공식 문서](https://docs.dndkit.com/)
- [React Testing Library 드래그 앤 드롭 가이드](https://testing-library.com/docs/user-event/convenience/#drag-and-drop)
- [Playwright 드래그 앤 드롭 API](https://playwright.dev/docs/input#dragging-manually)
