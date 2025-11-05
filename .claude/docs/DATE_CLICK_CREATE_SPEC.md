# 날짜 클릭으로 일정 생성 기능 명세서

## 1. 개요

캘린더 애플리케이션에서 비어있는 날짜 셀을 클릭하면 해당 날짜가 자동으로 일정 생성 폼에 채워지도록 하는 기능을 구현합니다.

### 목적

- 사용자가 캘린더의 날짜를 직접 클릭하여 빠르게 일정을 생성할 수 있도록 함
- 기존 일정 생성 방식(EventForm에서 직접 날짜 입력)의 보완적 UX 제공
- 직관적인 날짜 선택 경험 제공

### 범위

- 월간 캘린더(MonthlyCalendar) 및 주간 캘린더(WeeklyCalendar)에서 모두 동작
- 비어있는 날짜 셀만 클릭 가능 (일정이 있는 셀은 클릭해도 동작 없음)
- 날짜만 자동 입력되며, 나머지 필드는 사용자가 직접 입력

---

## 2. 기능 요구사항

### 2.1 날짜 셀 클릭 동작

#### 2.1.1 비어있는 날짜 셀 클릭

- **트리거**: CalendarCell 컴포넌트 내 비어있는 날짜 셀(일정이 없는 셀)을 클릭
- **동작**:
  - 클릭한 날짜가 EventForm의 날짜 필드에 자동으로 채워짐
  - 폼이 편집 모드가 아닌 경우(새 일정 생성 모드)에만 동작
  - 폼이 편집 모드인 경우 클릭해도 동작하지 않음
- **시각적 피드백**:
  - 클릭 가능한 셀임을 나타내는 커서 변경: `cursor: pointer` (선택사항)
  - 호버 효과: 배경색 변경 `backgroundColor: #f5f5f5` (선택사항)

#### 2.1.2 일정이 있는 날짜 셀 클릭

- **트리거**: CalendarCell 컴포넌트 내 일정이 있는 날짜 셀을 클릭
- **동작**: 아무 동작도 수행하지 않음 (사일런트 무시)
- **이유**: 일정이 있는 셀은 기존 일정을 클릭할 수 있으므로 날짜 입력과 충돌 방지

#### 2.1.3 빈 셀(null day) 클릭

- **트리거**: CalendarCell의 `day`가 `null`인 셀(이전/다음 달 날짜 표시용 빈 셀) 클릭
- **동작**: 아무 동작도 수행하지 않음

### 2.2 폼 상태 확인

**요구사항**: 편집 모드 중에는 날짜 클릭이 동작하지 않아야 함

**구현 방법**:

- `editingEvent`가 `null`인 경우에만 날짜 클릭 핸들러 동작
- 편집 모드 중에는 날짜 변경을 방지하여 사용자 실수 방지

### 2.3 날짜 형식

**요구사항**: 클릭한 날짜는 `YYYY-MM-DD` 형식으로 폼에 채워짐

**구현 방법**:

- CalendarCell에서 `formatDate(currentDate, day)` 함수를 사용하여 날짜 문자열 생성
- 생성된 날짜 문자열을 `setDate()` 함수로 전달

---

## 3. 기술 스펙

### 3.1 사용 기술

- **UI 프레임워크**: Material-UI (MUI)
- **이벤트 처리**: React onClick 이벤트 핸들러
- **날짜 포맷팅**: 기존 `dateUtils.ts`의 `formatDate` 함수 재사용

### 3.2 관련 컴포넌트 및 파일

| 파일 경로                                         | 역할                        | 수정 필요 여부   |
| ------------------------------------------------- | --------------------------- | ---------------- |
| `src/stories/CalendarCell/CalendarCell.tsx`       | 날짜 셀 클릭 핸들러 추가    | ✅ 수정 필요     |
| `src/stories/MonthlyCalendar/MonthlyCalendar.tsx` | 날짜 클릭 핸들러 props 전달 | ✅ 수정 필요     |
| `src/stories/WeeklyCalendar/WeeklyCalendar.tsx`   | 날짜 클릭 핸들러 props 전달 | ✅ 수정 필요     |
| `src/components/CalendarViewControls.tsx`         | 날짜 클릭 핸들러 props 전달 | ✅ 수정 필요     |
| `src/App.tsx`                                     | 날짜 설정 핸들러 구현       | ✅ 수정 필요     |
| `src/hooks/useEventForm.ts`                       | 날짜 설정 함수 제공         | 재사용 (setDate) |
| `src/utils/dateUtils.ts`                          | 날짜 포맷팅                 | 재사용           |

### 3.3 데이터 구조

#### Event 타입 (`src/types.ts`)

```typescript
export interface Event {
  id: string; // 고유 ID
  title: string; // 일정 제목
  date: string; // YYYY-MM-DD 형식
  startTime: string; // HH:mm 형식
  endTime: string; // HH:mm 형식
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo; // 반복 정보
  notificationTime: number;
}
```

#### 날짜 클릭 핸들러 타입

```typescript
type OnDateClick = (date: string) => void;
```

---

## 4. 구현 세부사항

### 4.1 CalendarCell 컴포넌트 수정 (`src/stories/CalendarCell/CalendarCell.tsx`)

#### 구현 내용

```typescript
interface CalendarCellProps {
  day: number | null;
  events: Event[];
  notifiedEvents: Event['id'][];
  holiday?: string;
  currentDate: Date;
  onDropEvent?: (eventId: string, targetDate: string) => void;
  onDateClick?: (date: string) => void; // NEW
  isEditing?: boolean; // NEW - 편집 모드 여부
}

export default function CalendarCell({
  day,
  holiday,
  events,
  notifiedEvents,
  currentDate,
  onDropEvent,
  onDateClick, // NEW
  isEditing = false, // NEW
}: CalendarCellProps) {
  const cellDate = day ? formatDate(currentDate, day) : null;
  const { setNodeRef, isOver } = useDroppable({
    id: cellDate ? `cell-${cellDate}` : `cell-null-${Math.random()}`,
    disabled: day === null,
  });

  const handleCellClick = () => {
    // 빈 셀이거나 일정이 있거나 편집 모드인 경우 클릭 무시
    if (!day || !cellDate || events.length > 0 || isEditing) {
      return;
    }

    // 날짜 클릭 핸들러 호출
    onDateClick?.(cellDate);
  };

  return (
    <TableCell
      ref={setNodeRef}
      onClick={handleCellClick}
      sx={{
        height: '120px',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        verticalAlign: 'top',
        padding: 1,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: isOver ? '#fff3e0' : 'white',
        transition: 'background-color 0.2s ease',
        cursor: day && events.length === 0 && !isEditing ? 'pointer' : 'default',
        '&:hover':
          day && events.length === 0 && !isEditing
            ? {
                backgroundColor: '#f5f5f5',
              }
            : {},
      }}
    >
      {/* 기존 내용 */}
    </TableCell>
  );
}
```

### 4.2 App.tsx 수정

#### 날짜 클릭 핸들러 구현

```typescript
const handleDateClick = (date: string) => {
  // 편집 모드인 경우 무시
  if (editingEvent) {
    return;
  }

  // 날짜 설정
  setDate(date);

  // 폼이 초기화되지 않은 경우 폼 초기화 (선택사항)
  // 또는 날짜만 업데이트하고 나머지는 유지
};
```

#### CalendarViewControls에 props 전달

```typescript
<CalendarViewControls
  view={view}
  setView={setView}
  currentDate={currentDate}
  navigate={navigate}
  filteredEvents={filteredEvents}
  notifiedEvents={notifiedEvents}
  holidays={holidays}
  onMoveEvent={handleMoveEvent}
  onDateClick={handleDateClick} // NEW
  isEditing={!!editingEvent} // NEW
/>
```

### 4.3 CalendarViewControls 수정 (`src/components/CalendarViewControls.tsx`)

#### Props 추가

```typescript
interface CalendarViewControlsProps {
  view: 'month' | 'week';
  setView: (view: 'month' | 'week') => void;
  currentDate: Date;
  navigate: (direction: 'prev' | 'next' | 'today') => void;
  filteredEvents: Event[];
  notifiedEvents: Event['id'][];
  holidays: Record<string, string>;
  onMoveEvent?: (eventId: string, targetDate: string) => void;
  onDateClick?: (date: string) => void; // NEW
  isEditing?: boolean; // NEW
}
```

#### MonthlyCalendar 및 WeeklyCalendar에 props 전달

```typescript
{
  view === 'month' ? (
    <MonthlyCalendar
      currentDate={currentDate}
      events={filteredEvents}
      holidays={holidays}
      notifiedEvents={notifiedEvents}
      onDateClick={onDateClick} // NEW
      isEditing={isEditing} // NEW
    />
  ) : (
    <WeeklyCalendar
      currentDate={currentDate}
      events={filteredEvents}
      notifiedEvents={notifiedEvents}
      onDateClick={onDateClick} // NEW
      isEditing={isEditing} // NEW
    />
  );
}
```

### 4.4 MonthlyCalendar & WeeklyCalendar 수정

#### MonthlyCalendar (`src/stories/MonthlyCalendar/MonthlyCalendar.tsx`)

```typescript
interface MonthlyCalendarProps {
  currentDate: Date;
  events: Event[];
  holidays: Record<string, string>;
  notifiedEvents: string[];
  onDateClick?: (date: string) => void; // NEW
  isEditing?: boolean; // NEW
}

export default function MonthlyCalendar({
  currentDate,
  events,
  holidays,
  notifiedEvents,
  onDateClick, // NEW
  isEditing = false, // NEW
}: MonthlyCalendarProps) {
  // ... 기존 코드 ...

  return (
    <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
      {/* ... 기존 코드 ... */}
      <CalendarCell
        key={dayIndex}
        day={day}
        holiday={holiday}
        events={dayEvents}
        notifiedEvents={notifiedEvents}
        currentDate={currentDate}
        onDateClick={onDateClick} // NEW
        isEditing={isEditing} // NEW
      />
      {/* ... */}
    </Stack>
  );
}
```

#### WeeklyCalendar (`src/stories/WeeklyCalendar/WeeklyCalendar.tsx`)

```typescript
interface WeeklyCalendarProps {
  currentDate: Date;
  events: Event[];
  notifiedEvents: Event['id'][];
  onDateClick?: (date: string) => void; // NEW
  isEditing?: boolean; // NEW
}

export default function WeeklyCalendar({
  currentDate,
  events,
  notifiedEvents,
  onDateClick, // NEW
  isEditing = false, // NEW
}: WeeklyCalendarProps) {
  // ... 기존 코드 ...

  return (
    <CalendarCell
      key={date.toISOString()}
      day={date.getDate()}
      events={dayEvents}
      notifiedEvents={notifiedEvents}
      currentDate={date}
      onDateClick={onDateClick} // NEW
      isEditing={isEditing} // NEW
    />
  );
}
```

---

## 5. 사용자 플로우

### 5.1 정상적인 날짜 클릭 (비어있는 셀)

```
1. 사용자가 월간/주간 캘린더에서 비어있는 날짜 셀을 클릭
   └─ 셀에 일정이 없고, 편집 모드가 아닌 경우
2. 해당 날짜가 EventForm의 날짜 필드에 자동으로 채워짐
   └─ 날짜 형식: YYYY-MM-DD
3. 사용자가 나머지 필드(제목, 시간 등)를 입력
4. "일정 추가" 버튼 클릭하여 일정 생성
```

### 5.2 일정이 있는 셀 클릭

```
1. 사용자가 일정이 있는 날짜 셀을 클릭
   └─ 셀에 일정이 있는 경우
2. 아무 동작도 수행하지 않음
   └─ 기존 일정을 클릭할 수 있도록 함
```

### 5.3 편집 모드 중 날짜 클릭

```
1. 사용자가 EventList에서 일정을 클릭하여 편집 모드 진입
2. 편집 모드 중 비어있는 날짜 셀을 클릭
   └─ 편집 모드인 경우
3. 아무 동작도 수행하지 않음
   └─ 기존 일정의 날짜를 실수로 변경하는 것을 방지
```

---

## 6. 예외 처리

### 6.1 잘못된 날짜 형식

- **발생 시점**: `formatDate` 함수가 잘못된 형식 반환
- **처리**:
  - `formatDate` 함수는 이미 검증된 함수이므로 문제 없음
  - 추가 검증이 필요한 경우 `YYYY-MM-DD` 형식 확인

### 6.2 편집 모드 중 날짜 클릭

- **발생 시점**: 사용자가 편집 모드 중 날짜 클릭
- **처리**:
  - `isEditing` prop을 확인하여 핸들러 조기 반환
  - 사용자에게 에러 메시지 표시하지 않음 (사일런트 무시)

### 6.3 빈 셀(null day) 클릭

- **발생 시점**: 이전/다음 달 날짜 표시용 빈 셀 클릭
- **처리**:
  - `day === null` 체크하여 핸들러 조기 반환
  - 아무 동작도 수행하지 않음

---

## 7. 성능 고려사항

### 7.1 불필요한 리렌더링 방지

- `onDateClick` 핸들러는 `useCallback`으로 메모이제이션 고려 (선택사항)
- `isEditing` prop이 변경될 때만 CalendarCell 리렌더링

### 7.2 이벤트 핸들러 최적화

- 클릭 이벤트는 필요한 경우에만 처리 (조건부 체크)
- 이벤트 버블링 방지 불필요 (TableCell 내부에서 처리)

---

## 8. 접근성 (a11y)

### 8.1 키보드 지원

- 현재 구현은 마우스 클릭만 지원
- 향후 키보드 내비게이션 추가 고려:
  - Tab: 날짜 셀 간 포커스 이동
  - Enter: 날짜 선택

### 8.2 스크린 리더

- `aria-label` 추가: "비어있는 날짜 셀을 클릭하면 해당 날짜가 일정 폼에 채워집니다"
- 클릭 가능한 셀임을 명확히 표시

### 8.3 시각적 피드백

- 호버 효과로 클릭 가능한 셀임을 시각적으로 표시
- 커서 변경(`cursor: pointer`)으로 상호작용 가능함을 나타냄

---

## 9. 테스트 시나리오

### 9.1 단위 테스트

- [ ] 비어있는 날짜 셀 클릭 시 `onDateClick` 핸들러가 올바른 날짜로 호출되는가
- [ ] 일정이 있는 셀 클릭 시 `onDateClick` 핸들러가 호출되지 않는가
- [ ] 편집 모드 중 날짜 클릭 시 `onDateClick` 핸들러가 호출되지 않는가
- [ ] 빈 셀(null day) 클릭 시 `onDateClick` 핸들러가 호출되지 않는가
- [ ] 날짜 형식이 `YYYY-MM-DD`로 올바르게 생성되는가

### 9.2 통합 테스트

- [ ] 비어있는 날짜 셀 클릭 시 EventForm의 날짜 필드가 업데이트되는가
- [ ] 일정이 있는 셀 클릭 시 EventForm의 날짜 필드가 변경되지 않는가
- [ ] 편집 모드 중 날짜 클릭 시 기존 편집 중인 날짜가 유지되는가
- [ ] 월간 뷰에서 날짜 클릭이 정상 작동하는가
- [ ] 주간 뷰에서 날짜 클릭이 정상 작동하는가

### 9.3 사용자 시나리오 테스트

- [ ] 새로운 일정을 생성할 때 날짜 클릭으로 빠르게 날짜를 입력할 수 있는가
- [ ] 일정이 있는 날짜를 클릭해도 기존 일정에 영향을 주지 않는가
- [ ] 편집 모드 중 실수로 날짜를 변경하는 것을 방지하는가
- [ ] 다른 날짜로 이동한 후에도 날짜 클릭이 정상 작동하는가

---

## 10. 참고 자료

### 10.1 주요 파일 위치

- **CalendarCell 컴포넌트**: `src/stories/CalendarCell/CalendarCell.tsx:1-78`
- **EventForm 컴포넌트**: `src/stories/EventForm/EventForm.tsx:1-214`
- **useEventForm 훅**: `src/hooks/useEventForm.ts:1-109`
- **날짜 포맷팅 유틸**: `src/utils/dateUtils.ts`

### 10.2 기존 유사 기능

- 일정 생성: `App.tsx` 내 `addOrUpdateEvent()` 함수
- 날짜 포맷팅: `src/utils/dateUtils.ts`의 `formatDate()` 함수

---

## 11. 구현 우선순위

### Phase 1: 기본 날짜 클릭 기능 (필수)

1. CalendarCell에 `onDateClick` prop 및 클릭 핸들러 추가
2. App.tsx에 `handleDateClick()` 구현
3. CalendarViewControls에 props 전달
4. MonthlyCalendar 및 WeeklyCalendar에 props 전달
5. 기본 기능 완성

### Phase 2: 편집 모드 처리 (필수)

1. `isEditing` prop 추가 및 전달
2. 편집 모드 중 날짜 클릭 방지 로직 구현

### Phase 3: UX 개선 (선택)

1. 호버 효과 추가
2. 커서 스타일 변경
3. 시각적 피드백 강화

### Phase 4: 접근성 개선 (향후)

1. 키보드 지원
2. 스크린 리더 지원 강화
3. ARIA 속성 추가

---

## 12. 완료 조건

### 기능 완료 조건

- [ ] 요구사항 1: 비어있는 날짜 셀 클릭 시 해당 날짜가 폼에 자동 채워짐
- [ ] 요구사항 2: 일정이 있는 날짜 셀 클릭 시 아무 동작 없음
- [ ] 요구사항 3: 편집 모드 중 날짜 클릭 방지

### 품질 조건

- [ ] 모든 테스트 시나리오 통과
- [ ] 코드 리뷰 완료
- [ ] 사용자 테스트 완료
- [ ] 성능 이슈 없음 (즉시 응답)

---

## 변경 이력

- 2025-01-XX: 초안 작성
