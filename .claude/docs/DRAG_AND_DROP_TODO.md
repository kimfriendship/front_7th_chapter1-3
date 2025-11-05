📋 투두리스트 구조 (dnd-kit 기반)

Phase 1: 기본 드래그 앤 드롭 (작업 1-24)

App.tsx DndContext 설정 (1-3)

1. ✅ DndContext import 및 최상위 래핑

   - `@dnd-kit/core`에서 `DndContext`, `MouseSensor`, `TouchSensor`, `useSensor` import
   - `DndContext`로 캘린더 영역 래핑
   - `sensors` 설정 (MouseSensor, TouchSensor)

2. ✅ handleDragEnd 핸들러 구현

   - `onDragEnd` 이벤트 핸들러 추가
   - `active`와 `over` 객체에서 드래그 정보 추출
   - `over`가 없으면 (캘린더 밖 드롭) 아무 작업 안 함
   - `over`의 `id`에서 날짜 정보 추출 (날짜 형식 검증 포함)
   - `active`의 `data.current`에서 이벤트 정보 추출

3. ✅ handleMoveEvent 함수에 연결
   - `handleDragEnd`에서 `handleMoveEvent` 호출
   - 이벤트 ID와 타겟 날짜 전달

EventBar 컴포넌트 수정 (4-6)

4. ✅ useDraggable hook 적용

   - `@dnd-kit/core`에서 `useDraggable` import
   - `useDraggable` hook 사용하여 드래그 가능하게 설정
   - `id`: `event-${event.id}` 형식
   - `data`: `{ eventId: event.id, sourceDate: event.date }`

5. ✅ JSX에 드래그 속성 추가

   - `ref={setNodeRef}` 추가
   - `{...listeners}` spread
   - `{...attributes}` spread

6. ✅ 드래그 시각 효과 추가
   - `isDragging` 상태 사용 (useDraggable에서 제공)
   - `opacity: isDragging ? 0.6 : 1`
   - `cursor: 'grab'`
   - `'&:active': { cursor: 'grabbing' }`

CalendarCell 컴포넌트 수정 (7-11)

7. ✅ Props 타입에 currentDate, onDropEvent 추가

   - `currentDate: Date` prop 추가
   - `onDropEvent?: (eventId: string, targetDate: string) => void` prop 추가

8. ✅ useDroppable hook 적용

   - `@dnd-kit/core`에서 `useDroppable` import
   - `useDroppable` hook 사용하여 드롭 가능하게 설정
   - `id`: 날짜 문자열 형식 `cell-${formatDate(currentDate, day)}`
   - `disabled`: `day === null`일 때 true

9. ✅ isOver 상태 사용

   - `useDroppable`에서 `isOver` 상태 가져오기
   - 드래그오버 시각 효과에 사용

10. ✅ JSX에 드롭 속성 추가

    - `ref={setNodeRef}` 추가
    - `{...attributes}` spread

11. ✅ 드래그오버 시각 효과 추가
    - `isOver` 상태 사용
    - `backgroundColor: isOver ? '#fff3e0' : 'white'`
    - `transition: 'background-color 0.2s ease'`

MonthlyCalendar 수정 (12-13)

12. ✅ Props 타입에 onMoveEvent 추가

    - `onMoveEvent?: (eventId: string, targetDate: string) => void` prop 추가

13. ✅ CalendarCell에 currentDate props 전달
    - `currentDate={currentDate}` 전달

WeeklyCalendar 수정 (14-15)

14. ✅ Props 타입에 onMoveEvent 추가

    - `onMoveEvent?: (eventId: string, targetDate: string) => void` prop 추가

15. ✅ CalendarCell에 currentDate props 전달
    - `currentDate={date}` 전달 (각 날짜의 Date 객체)

App.tsx 기본 이동 로직 (16-21)

16. ✅ pendingMoveEvent 상태 추가

    - `useState<{ eventId: string; targetDate: string } | null>(null)` 추가

17. ✅ 기본 handleMoveEvent 함수 구현 (이벤트 찾기)

    - `eventId`로 이벤트 찾기
    - 이벤트 없으면 에러 메시지 표시 후 return

18. ✅ 날짜 업데이트 로직 추가

    - 찾은 이벤트의 날짜를 `targetDate`로 업데이트한 객체 생성
    - 반복 일정인 경우 `repeat.type = 'none'`으로 변환

19. ✅ 일반 이벤트 저장 로직 추가

    - `saveEvent` 호출 (id 기반으로 업데이트/생성 자동 결정)
    - 성공 알림 표시
    - `fetchEvents` 호출하여 목록 새로고침

20. ✅ MonthlyCalendar에 onMoveEvent prop 전달

    - `onMoveEvent={handleMoveEvent}` 전달

21. ✅ WeeklyCalendar에 onMoveEvent prop 전달
    - `onMoveEvent={handleMoveEvent}` 전달

날짜 계산 헬퍼 함수 추가 (22-23)

22. ✅ CalendarCell에서 날짜 문자열 생성 로직

    - `formatDate(currentDate, day)` 사용하여 날짜 문자열 생성
    - `useDroppable`의 `id`로 `cell-YYYY-MM-DD` 형식 사용

23. ✅ handleDragEnd에서 날짜 파싱
    - `over.id`에서 `cell-` 접두사 제거하여 날짜 추출
    - 날짜 형식 검증 (`YYYY-MM-DD`) 추가
    - `active.data.current`에서 이벤트 정보 추출

✅ Phase 1 테스트: 작업 24 - 기본 드래그 앤 드롭 기능 테스트

---

Phase 2: 일정 겹침 검증 (작업 25-30)

25. ✅ handleMoveEvent에 findOverlappingEvents 통합

    - 이동된 이벤트 객체 생성 후 `findOverlappingEvents` 호출
    - 겹치는 이벤트가 있는지 확인

26. ✅ 겹침 발생 시 OverlapDialog 표시 로직 추가

    - 겹침이 있으면 `setOverlappingEvents` 호출
    - `setPendingMoveEvent`로 이동 정보 저장
    - `setIsOverlapDialogOpen(true)` 호출

27. ✅ handleOverlapConfirm 함수 구현

    - `setIsOverlapDialogOpen(false)` 호출
    - `pendingMoveEvent`가 있으면 이동 진행
    - 반복 일정인 경우 단일 일정으로 변환하여 저장

28. ✅ handleOverlapCancel 함수 구현

    - `setIsOverlapDialogOpen(false)` 호출
    - `setPendingMoveEvent(null)` 호출

29. ✅ OverlapDialog에 새로운 confirm/cancel 핸들러 연결
    - `onConfirm={handleOverlapConfirm}` 연결
    - `onCancel={handleOverlapCancel}` 연결

✅ Phase 2 테스트: 작업 30 - 일정 겹침 시나리오 테스트

---

Phase 3: 반복 일정 처리 (작업 31-37)

31. ✅ isRecurringEvent 헬퍼 함수 추가 또는 import

    - `event.repeat.type !== 'none' && event.repeat.interval > 0` 체크 함수

32. ✅ handleMoveEvent에 반복 일정 처리 로직 추가

    - 반복 일정 감지 시 모달 없이 바로 단일 일정으로 변환
    - `repeat: { type: 'none', interval: 0 }` 설정
    - 일반 이벤트와 동일하게 저장

33. ✅ handleOverlapConfirm에 반복 일정 처리 로직 추가
    - 겹침 확인 후에도 반복 일정을 단일 일정으로 변환하여 저장

✅ Phase 3 테스트: 작업 38 - 반복 일정 이동 시나리오 테스트

---

버그 수정 사항

- ✅ saveEvent 함수 개선: id 기반으로 업데이트/생성 자동 결정 (editing 상태 제거)
- ✅ EventBar key 개선: `${cellDate}-${event.id}` 형식으로 고유성 보장
- ✅ handleDragEnd 날짜 추출 로직 개선: 날짜 형식 검증 및 안전한 파싱
- ✅ handleOverlapConfirm 날짜 검증 추가

---

최종 테스트 (작업 39-42)

39. ⏳ 캘린더 밖 드롭 시나리오 테스트

    - `over`가 null인 경우 처리 확인

40. ⏳ 같은 날짜로 드롭 시나리오 테스트

    - `sourceDate === targetDate`인 경우 무시

41. ⏳ 전체 기능 통합 테스트 (월간/주간 뷰)

    - 두 뷰 모두에서 동작 확인

42. ⏳ DndContext 최적화
    - 불필요한 리렌더링 방지
    - 성능 최적화 확인

---

🎯 dnd-kit 사용 특징

1. DndContext: 최상위에서 드래그 앤 드롭 컨텍스트 제공
2. useDraggable: 드래그 가능한 요소 설정 (EventBar)
3. useDroppable: 드롭 가능한 영역 설정 (CalendarCell)
4. onDragEnd: DndContext에서 모든 드롭 이벤트 중앙 처리
5. active/over: 드래그 중인 항목과 드롭 대상 정보 제공

---

📝 작업 순서 특징

1. 점진적 개발: 각 Phase가 독립적으로 테스트 가능
2. 작은 단위: 각 작업은 5-15분 내 완료 가능
3. 명확한 완료 조건: 각 작업마다 구체적인 코드 추가/수정 사항 명시
4. 테스트 포함: 각 Phase 완료 후 즉시 테스트하여 버그 조기 발견
5. dnd-kit 특화: HTML5 API 대신 dnd-kit의 hooks와 컨텍스트 사용

---

📌 구현 변경 사항

- 반복 일정 이동 시 모달 없이 바로 단일 일정으로 변환하여 이동 (기획 변경)
