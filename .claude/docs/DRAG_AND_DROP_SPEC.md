# 드래그 앤 드롭 기능 명세서

## 1. 개요

캘린더 애플리케이션의 일정(EventBar)을 마우스로 드래그하여 다른 날짜로 이동하는 기능을 구현합니다.

### 목적
- 사용자가 일정을 시각적으로 직관적인 방법으로 날짜 간 이동할 수 있도록 함
- 기존 일정 수정 방식(EventList에서 수정)의 보완적 UX 제공

### 범위
- 월간 캘린더(MonthlyCalendar) 및 주간 캘린더(WeeklyCalendar)에서 모두 동작
- 일정 겹침 검증 및 사용자 확인 프로세스 포함
- 반복 일정의 특수한 처리 방식 포함

---

## 2. 기능 요구사항

### 2.1 기본 드래그 앤 드롭 동작

#### 2.1.1 드래그 시작
- **트리거**: EventBar 컴포넌트를 마우스로 클릭하고 드래그
- **시각적 피드백**:
  - 드래그 중인 EventBar는 불투명도 감소 (`opacity: 0.6`)
  - 커서 변경: `cursor: grab` → `cursor: grabbing`
- **데이터 전송**: 이벤트 ID, 원본 날짜 정보를 드래그 데이터로 전달

#### 2.1.2 드래그 중
- **드롭 가능 영역**: CalendarCell 컴포넌트 (날짜가 존재하는 셀)
- **시각적 피드백**:
  - 드래그 오버 중인 CalendarCell 배경색 변경 (`backgroundColor: #fff3e0`)
  - 커서 변경: `dropEffect: move`

#### 2.1.3 드롭
- **성공 조건**: 유효한 CalendarCell 위에 드롭
- **실패 조건**:
  - 캘린더 밖의 영역에 드롭
  - 빈 CalendarCell (day가 null인 셀)에 드롭
- **실패 시 동작**: 일정이 원래 날짜에 그대로 유지됨 (변경 없음)

### 2.2 캘린더 범위 밖 드롭 처리

**요구사항**: 캘린더 밖으로 드래그하고 드롭하면 변경 없이 원래 날짜에 일정이 유지되어야 함

**구현 방법**:
- `onDrop` 이벤트가 CalendarCell에서만 처리됨
- 캘린더 컨테이너 밖에서 드롭 시 `onDragEnd`에서 상태만 리셋
- API 호출 없이 UI 상태만 복원

### 2.3 반복 일정 처리

**요구사항**: 반복 일정을 드래그하여 이동하면 해당 일정은 더 이상 반복 일정이 아닌 단일 일정으로 변경됨

#### 2.3.1 반복 일정 감지
- `event.repeat.type !== 'none'`인 경우 반복 일정으로 판단
- EventBar에 반복 아이콘(Repeat) 표시

#### 2.3.2 사용자 확인 프로세스
드롭 후 RecurringEventDialog 표시:
- **옵션 1**: 이 일정만 이동
  - 선택한 일정만 새 날짜로 이동
  - `repeat.type`을 `'none'`으로 변경하여 단일 일정으로 전환
- **옵션 2**: 반복 일정 전체 이동
  - 관련된 모든 반복 일정의 날짜를 동일한 일수만큼 이동
  - 반복 속성 유지

#### 2.3.3 API 호출
- **단일 이동**: `PUT /api/events/:id` (repeat.type = 'none' 포함)
- **전체 이동**: `PUT /api/recurring-events/:id` (날짜 차이 계산하여 모든 관련 이벤트 업데이트)

### 2.4 일정 겹침 검증

**요구사항**: 일정을 옮겼을 때 옮긴 일정의 시간과 원래 그 날짜에 있던 일정의 시간이 겹치면 일정 겹침 모달을 표시

#### 2.4.1 겹침 검증 로직
- **사용 함수**: `findOverlappingEvents(movedEvent, existingEvents)` (`utils/eventOverlap.ts`)
- **검증 시점**: 드롭 후, API 호출 전
- **검증 기준**:
  ```typescript
  // 겹침 조건: start1 < end2 && start2 < end1
  const start1 = new Date(`${event1.date}T${event1.startTime}`);
  const end1 = new Date(`${event1.date}T${event1.endTime}`);
  const start2 = new Date(`${event2.date}T${event2.startTime}`);
  const end2 = new Date(`${event2.date}T${event2.endTime}`);
  ```

#### 2.4.2 OverlapDialog 표시
- **구성요소**:
  - 제목: "일정 겹침 경고"
  - 겹치는 일정 목록: `${title} (${date} ${startTime}-${endTime})`
  - 안내 메시지: "다음 일정과 겹칩니다. 계속 진행하시겠습니까?"
- **액션**:
  - **취소**: 일정 이동 취소 (원래 날짜 유지)
  - **계속 진행**: 겹침에도 불구하고 일정 이동 진행

#### 2.4.3 처리 플로우
```
1. 드롭 이벤트 발생
2. 이동된 일정 객체 생성 (날짜만 변경)
3. findOverlappingEvents() 호출
4. 겹침 있음?
   ├─ Yes → OverlapDialog 표시
   │         ├─ 취소 → 이동 취소
   │         └─ 계속 → 5번으로
   └─ No → 5번으로
5. 반복 일정인가?
   ├─ Yes → RecurringEventDialog 표시 → API 호출
   └─ No → API 호출
6. 성공 알림 표시 (notistack)
7. 이벤트 목록 새로고침
```

---

## 3. 기술 스펙

### 3.1 사용 기술
- **드래그 앤 드롭 라이브러리**: `@dnd-kit/core` v6.3.1 (이미 설치됨)
- **UI 프레임워크**: Material-UI (MUI)
- **애니메이션**: Framer Motion (선택 사항)
- **알림**: notistack

### 3.2 관련 컴포넌트 및 파일

| 파일 경로 | 역할 | 수정 필요 여부 |
|-----------|------|----------------|
| `src/stories/EventBar/EventBar.tsx` | 드래그 소스 | ✅ 수정 필요 |
| `src/stories/CalendarCell/CalendarCell.tsx` | 드롭 타겟 | ✅ 수정 필요 |
| `src/stories/MonthlyCalendar/MonthlyCalendar.tsx` | 월간 뷰 컨테이너 | ✅ 수정 필요 (props 추가) |
| `src/stories/WeeklyCalendar/WeeklyCalendar.tsx` | 주간 뷰 컨테이너 | ✅ 수정 필요 (props 추가) |
| `src/App.tsx` | 메인 상태 관리 및 이벤트 핸들러 | ✅ 수정 필요 |
| `src/hooks/useEventOperations.ts` | 이벤트 CRUD API | 재사용 |
| `src/hooks/useRecurringEventOperations.ts` | 반복 일정 로직 | 재사용 |
| `src/utils/eventOverlap.ts` | 겹침 검증 | 재사용 |
| `src/components/OverlapDialog.tsx` | 겹침 확인 모달 | 재사용 |
| `src/components/RecurringEventDialog.tsx` | 반복 일정 확인 모달 | 재사용 (추가 옵션 필요) |

### 3.3 데이터 구조

#### Event 타입 (`src/types.ts`)
```typescript
export interface Event {
  id: string;              // 고유 ID
  title: string;           // 일정 제목
  date: string;            // YYYY-MM-DD 형식
  startTime: string;       // HH:mm 형식
  endTime: string;         // HH:mm 형식
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;      // 반복 정보
  notificationTime: number;
}

export interface RepeatInfo {
  type: RepeatType;        // 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number;        // 반복 간격
  endDate?: string;        // 반복 종료일
  id?: string;             // 반복 시리즈 ID
}
```

#### 드래그 데이터 전송 구조
```typescript
interface DragData {
  eventId: string;    // 드래그 중인 이벤트 ID
  sourceDate: string; // 원본 날짜 (YYYY-MM-DD)
}
```

### 3.4 API 엔드포인트

| 메서드 | 엔드포인트 | 용도 | 요청 본문 |
|--------|-----------|------|----------|
| PUT | `/api/events/:id` | 단일 이벤트 업데이트 | Event 객체 |
| PUT | `/api/recurring-events/:id` | 반복 일정 시리즈 업데이트 | Event 객체 |
| GET | `/api/events` | 모든 이벤트 조회 | - |

---

## 4. 구현 세부사항

### 4.1 EventBar 컴포넌트 수정 (`src/stories/EventBar/EventBar.tsx`)

#### 추가할 Props
```typescript
interface EventBarProps {
  isNotified: boolean;
  event: Event;
  onDragStart?: (event: Event) => void;  // NEW
  onDragEnd?: () => void;                 // NEW
}
```

#### 추가할 상태 및 핸들러
```typescript
const [isDragging, setIsDragging] = useState(false);

const handleDragStart = (e: React.DragEvent) => {
  setIsDragging(true);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('application/json', JSON.stringify({
    eventId: event.id,
    sourceDate: event.date,
  }));
  onDragStart?.(event);
};

const handleDragEnd = (e: React.DragEvent) => {
  setIsDragging(false);
  onDragEnd?.();
};
```

#### 스타일 수정
```typescript
sx={{
  opacity: isDragging ? 0.6 : 1,
  cursor: 'grab',
  transition: 'opacity 0.2s ease',
  '&:active': { cursor: 'grabbing' },
  // ... 기존 스타일
}}
```

#### JSX 수정
```tsx
<Box
  draggable={true}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  // ... 기존 props
>
  {/* 기존 내용 */}
</Box>
```

### 4.2 CalendarCell 컴포넌트 수정 (`src/stories/CalendarCell/CalendarCell.tsx`)

#### 추가할 Props
```typescript
interface CalendarCellProps {
  day: number | null;
  events: Event[];
  notifiedEvents: Event['id'][];
  holiday?: string;
  currentDate: Date;                                    // NEW - 날짜 계산용
  onDropEvent?: (eventId: string, targetDate: string) => void;  // NEW
}
```

#### 추가할 상태 및 핸들러
```typescript
const [isDragOver, setIsDragOver] = useState(false);

const handleDragOver = (e: React.DragEvent) => {
  if (day === null) return; // 빈 셀은 드롭 불가
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

const handleDragEnter = (e: React.DragEvent) => {
  if (day === null) return;
  setIsDragOver(true);
};

const handleDragLeave = (e: React.DragEvent) => {
  setIsDragOver(false);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(false);

  if (day === null) return;

  try {
    const data: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
    const targetDate = formatDate(currentDate, day);

    if (data.sourceDate === targetDate) {
      // 같은 날짜로 드롭 → 아무 작업 안 함
      return;
    }

    onDropEvent?.(data.eventId, targetDate);
  } catch (error) {
    console.error('Drop failed:', error);
  }
};
```

#### 스타일 수정
```typescript
sx={{
  backgroundColor: isDragOver ? '#fff3e0' : 'white',
  transition: 'background-color 0.2s ease',
  // ... 기존 스타일
}}
```

#### JSX 수정
```tsx
<TableCell
  onDragOver={handleDragOver}
  onDragEnter={handleDragEnter}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  // ... 기존 props
>
  {/* 기존 내용 */}
</TableCell>
```

### 4.3 App.tsx 수정

#### 추가할 상태
```typescript
const [pendingMoveEvent, setPendingMoveEvent] = useState<{
  eventId: string;
  targetDate: string;
} | null>(null);
```

#### 메인 드롭 핸들러 구현
```typescript
const handleMoveEvent = async (eventId: string, targetDate: string) => {
  const eventToMove = events.find(e => e.id === eventId);
  if (!eventToMove) {
    enqueueSnackbar('일정을 찾을 수 없습니다.', { variant: 'error' });
    return;
  }

  // 날짜만 업데이트한 이벤트 객체 생성
  const updatedEvent: Event = {
    ...eventToMove,
    date: targetDate,
  };

  // 1. 겹침 검증
  const overlapping = findOverlappingEvents(updatedEvent, events);
  if (overlapping.length > 0) {
    setOverlappingEvents(overlapping);
    setPendingMoveEvent({ eventId, targetDate });
    setIsOverlapDialogOpen(true);
    return;
  }

  // 2. 반복 일정 처리
  if (isRecurringEvent(eventToMove)) {
    await handleRecurringMove(eventToMove, targetDate);
    return;
  }

  // 3. 일반 이벤트 이동
  await performMove(updatedEvent);
};

const handleRecurringMove = async (event: Event, targetDate: string) => {
  // RecurringEventDialog 표시
  setPendingRecurringEdit(event);
  setPendingMoveEvent({ eventId: event.id, targetDate });
  setRecurringDialogMode('move');
  setIsRecurringDialogOpen(true);
};

const performMove = async (updatedEvent: Event) => {
  try {
    await saveEvent(updatedEvent);
    enqueueSnackbar('일정이 이동되었습니다.', { variant: 'success' });
    await fetchEvents();
  } catch (error) {
    enqueueSnackbar('일정 이동에 실패했습니다.', { variant: 'error' });
  }
  setPendingMoveEvent(null);
};
```

#### OverlapDialog 확인 핸들러
```typescript
const handleOverlapConfirm = async () => {
  setIsOverlapDialogOpen(false);

  if (!pendingMoveEvent) return;

  const eventToMove = events.find(e => e.id === pendingMoveEvent.eventId);
  if (!eventToMove) return;

  const updatedEvent: Event = {
    ...eventToMove,
    date: pendingMoveEvent.targetDate,
  };

  // 반복 일정인 경우 추가 확인
  if (isRecurringEvent(eventToMove)) {
    await handleRecurringMove(eventToMove, pendingMoveEvent.targetDate);
  } else {
    await performMove(updatedEvent);
  }
};

const handleOverlapCancel = () => {
  setIsOverlapDialogOpen(false);
  setPendingMoveEvent(null);
};
```

#### RecurringEventDialog 수정
기존 edit/delete 모드에 'move' 모드 추가:
```typescript
const handleRecurringDialogConfirm = async (editSingleOnly: boolean) => {
  setIsRecurringDialogOpen(false);

  if (recurringDialogMode === 'move' && pendingRecurringEdit && pendingMoveEvent) {
    const updatedEvent: Event = {
      ...pendingRecurringEdit,
      date: pendingMoveEvent.targetDate,
      repeat: editSingleOnly ? { type: 'none', interval: 0 } : pendingRecurringEdit.repeat,
    };

    if (editSingleOnly) {
      // 단일 이벤트로 변환하여 이동
      await saveEvent(updatedEvent);
    } else {
      // 전체 시리즈 이동 (날짜 차이 계산 필요)
      await handleRecurringEdit(updatedEvent, false);
    }

    enqueueSnackbar('일정이 이동되었습니다.', { variant: 'success' });
    await fetchEvents();
    setPendingMoveEvent(null);
    setPendingRecurringEdit(null);
  }
  // ... 기존 edit/delete 로직
};
```

#### Calendar 컴포넌트에 props 전달
```tsx
<MonthlyCalendar
  currentDate={currentDate}
  events={filteredEvents}
  holidays={holidays}
  notifiedEvents={notifiedEvents}
  onMoveEvent={handleMoveEvent}  // NEW
/>

<WeeklyCalendar
  currentDate={currentDate}
  events={filteredEvents}
  notifiedEvents={notifiedEvents}
  onMoveEvent={handleMoveEvent}  // NEW
/>
```

### 4.4 MonthlyCalendar & WeeklyCalendar 수정

#### Props 추가
```typescript
interface MonthlyCalendarProps {
  // ... 기존 props
  onMoveEvent?: (eventId: string, targetDate: string) => void;  // NEW
}
```

#### CalendarCell에 props 전달
```tsx
<CalendarCell
  key={dayIndex}
  day={day}
  holiday={holiday}
  events={dayEvents}
  notifiedEvents={notifiedEvents}
  currentDate={currentDate}      // NEW
  onDropEvent={onMoveEvent}       // NEW
/>
```

---

## 5. 사용자 플로우

### 5.1 정상 이동 (겹침 없음, 일반 일정)
```
1. 사용자가 EventBar를 클릭하고 드래그 시작
   └─ EventBar 불투명도 감소, 커서 변경
2. 다른 CalendarCell 위로 드래그
   └─ 타겟 셀 배경색 변경
3. CalendarCell에 드롭
   └─ 겹침 검증 → 통과
   └─ 반복 일정 검증 → 일반 일정
   └─ API 호출 (PUT /api/events/:id)
4. 성공 알림 표시
5. 이벤트 목록 새로고침
   └─ 일정이 새 날짜에 표시됨
```

### 5.2 겹침 발생
```
1-3. (위와 동일)
4. 겹침 검증 → 실패
5. OverlapDialog 표시
   ├─ 옵션 A: "취소" 클릭
   │   └─ 다이얼로그 닫힘, 일정 이동 취소
   └─ 옵션 B: "계속 진행" 클릭
       └─ 6번으로
6. 반복 일정 검증
7. API 호출
8. 성공 알림
9. 이벤트 목록 새로고침
```

### 5.3 반복 일정 이동
```
1-3. (위와 동일)
4. 겹침 검증 → 통과 (또는 사용자 확인 완료)
5. 반복 일정 검증 → 반복 일정임
6. RecurringEventDialog 표시
   ├─ 옵션 A: "이 일정만" 선택
   │   └─ repeat.type = 'none'으로 변경
   │   └─ PUT /api/events/:id
   └─ 옵션 B: "반복 일정 전체" 선택
       └─ 날짜 차이 계산
       └─ PUT /api/recurring-events/:id
7. 성공 알림
8. 이벤트 목록 새로고침
```

### 5.4 캘린더 밖으로 드롭
```
1. 사용자가 EventBar를 클릭하고 드래그 시작
2. 캘린더 범위 밖으로 드래그
3. 캘린더 밖 영역에 드롭
   └─ onDrop 이벤트 발생하지 않음
   └─ onDragEnd만 호출됨
4. UI 상태만 리셋 (원래 위치로 돌아감)
5. API 호출 없음
```

---

## 6. 예외 처리

### 6.1 네트워크 오류
- **발생 시점**: API 호출 실패
- **처리**:
  - notistack으로 에러 메시지 표시
  - 일정이 원래 날짜에 유지됨
  - 사용자가 재시도 가능

### 6.2 잘못된 드래그 데이터
- **발생 시점**: dataTransfer 파싱 실패
- **처리**:
  - console.error 로그
  - 조용히 실패 (사용자에게 에러 표시 안 함)
  - 일정 위치 변경 없음

### 6.3 존재하지 않는 이벤트
- **발생 시점**: eventId로 이벤트를 찾을 수 없음
- **처리**:
  - "일정을 찾을 수 없습니다" 에러 표시
  - 조기 반환

### 6.4 같은 날짜로 드롭
- **발생 시점**: sourceDate === targetDate
- **처리**:
  - 아무 작업 안 함 (조용히 무시)
  - API 호출 없음

---

## 7. 성능 고려사항

### 7.1 불필요한 리렌더링 방지
- EventBar의 `draggable` 속성은 항상 true (조건부 렌더링 불필요)
- 드래그 상태는 로컬 useState로 관리
- CalendarCell의 드래그오버 상태도 로컬 관리

### 7.2 이벤트 목록 새로고침 최적화
- 이동 성공 후에만 `fetchEvents()` 호출
- 실패/취소 시 불필요한 API 호출 방지

### 7.3 디바운싱 (선택사항)
- 빠른 연속 드롭 방지를 위해 드롭 핸들러 디바운싱 고려

---

## 8. 접근성 (a11y)

### 8.1 키보드 지원 (향후 개선 사항)
- 현재 구현은 마우스 드래그만 지원
- 향후 키보드 내비게이션 추가 고려:
  - Tab: 이벤트 간 포커스 이동
  - Enter: 드래그 모드 활성화
  - Arrow keys: 날짜 간 이동
  - Enter: 드롭 확정

### 8.2 스크린 리더
- `aria-label` 추가: "일정을 드래그하여 다른 날짜로 이동할 수 있습니다"
- 드롭 성공 시 알림 메시지는 notistack이 자동으로 announce

---

## 9. 테스트 시나리오

### 9.1 단위 테스트
- [ ] `findOverlappingEvents()` 함수가 정확히 겹치는 이벤트를 반환하는가
- [ ] 같은 날짜로 드롭 시 API 호출이 발생하지 않는가
- [ ] 반복 일정을 단일 일정으로 변환할 때 repeat.type이 'none'으로 변경되는가

### 9.2 통합 테스트
- [ ] 일반 일정을 다른 날짜로 드래그하면 새 날짜에 나타나는가
- [ ] 겹치는 시간대로 드롭 시 OverlapDialog가 표시되는가
- [ ] OverlapDialog에서 "취소" 선택 시 일정이 원래 위치에 유지되는가
- [ ] OverlapDialog에서 "계속 진행" 선택 시 일정이 이동되는가
- [ ] 반복 일정 드롭 시 RecurringEventDialog가 표시되는가
- [ ] "이 일정만" 선택 시 해당 일정만 이동되고 단일 일정으로 변경되는가
- [ ] "반복 일정 전체" 선택 시 모든 관련 일정이 이동되는가
- [ ] 캘린더 밖으로 드롭 시 일정이 이동되지 않는가

### 9.3 사용자 시나리오 테스트
- [ ] 월간 뷰에서 다음 달로 일정을 드래그할 수 있는가
- [ ] 주간 뷰에서 같은 주 내 다른 날로 드래그할 수 있는가
- [ ] 네트워크 오류 발생 시 적절한 에러 메시지가 표시되는가
- [ ] 일정 이동 후 검색 필터가 여전히 작동하는가
- [ ] 일정 이동 후 알림 상태가 유지되는가

---

## 10. 참고 자료

### 10.1 주요 파일 위치
- **EventBar 컴포넌트**: `src/stories/EventBar/EventBar.tsx:1-58`
- **CalendarCell 컴포넌트**: `src/stories/CalendarCell/CalendarCell.tsx:1-55`
- **겹침 검증 유틸**: `src/utils/eventOverlap.ts:1-26`
- **OverlapDialog**: `src/components/OverlapDialog.tsx:1-45`
- **반복 일정 처리**: `src/hooks/useRecurringEventOperations.ts:1-229`

### 10.2 기존 유사 기능
- 이벤트 생성/수정: `App.tsx` 내 `addOrUpdateEvent()` 함수
- 반복 일정 편집/삭제 플로우: `App.tsx` 내 RecurringEventDialog 처리 로직

### 10.3 라이브러리 문서
- [@dnd-kit/core 공식 문서](https://docs.dndkit.com/)
- [Material-UI 드래그 앤 드롭 예제](https://mui.com/material-ui/react-table/#sorting-amp-selecting)

---

## 11. 구현 우선순위

### Phase 1: 기본 드래그 앤 드롭 (필수)
1. EventBar에 draggable 속성 및 핸들러 추가
2. CalendarCell에 드롭 핸들러 추가
3. App.tsx에 `handleMoveEvent()` 구현
4. 일반 일정 이동 기능 완성

### Phase 2: 겹침 검증 (필수)
1. `findOverlappingEvents()` 통합
2. OverlapDialog 표시 로직 추가
3. 사용자 확인 후 이동 처리

### Phase 3: 반복 일정 처리 (필수)
1. 반복 일정 감지 로직 추가
2. RecurringEventDialog 'move' 모드 추가
3. 단일/전체 이동 처리 구현

### Phase 4: UX 개선 (선택)
1. 드래그 시각 효과 강화 (그림자, 확대 등)
2. 드롭 위치 미리보기
3. 애니메이션 추가 (Framer Motion)

### Phase 5: 접근성 개선 (향후)
1. 키보드 지원
2. 스크린 리더 지원 강화

---

## 12. 완료 조건

### 기능 완료 조건
- [x] 요구사항 1: CalendarCell의 EventBar를 드래그하여 다른 날짜로 이동 가능
- [x] 요구사항 2: 캘린더 밖으로 드롭 시 변경 없음
- [x] 요구사항 3: 반복 일정 드래그 시 단일 일정으로 변환 (또는 전체 이동 선택)
- [x] 요구사항 4: 시간 겹침 시 모달 표시

### 품질 조건
- [ ] 모든 테스트 시나리오 통과
- [ ] 코드 리뷰 완료
- [ ] 사용자 테스트 완료
- [ ] 성능 이슈 없음 (300ms 이내 응답)

---

## 변경 이력
- 2025-11-06: 초안 작성 (코드베이스 분석 완료)
