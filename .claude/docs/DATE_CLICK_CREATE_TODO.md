📋 투두리스트 구조 (날짜 클릭으로 일정 생성 기능)

Phase 1: 기본 날짜 클릭 기능 (작업 1-13)

CalendarCell 컴포넌트 수정 (1-6)

1. ✅ Props 타입에 onDateClick, isEditing 추가

   - `onDateClick?: (date: string) => void` prop 추가
   - `isEditing?: boolean` prop 추가 (기본값: false)

2. ✅ handleCellClick 핸들러 구현

   - 클릭 이벤트 핸들러 함수 생성
   - `day === null` 체크 → 조기 반환
   - `cellDate`가 없으면 조기 반환
   - `events.length > 0` 체크 → 조기 반환 (일정이 있는 셀 무시)
   - `isEditing === true` 체크 → 조기 반환 (편집 모드 무시)
   - 조건 통과 시 `onDateClick?.(cellDate)` 호출

3. ✅ TableCell에 onClick 핸들러 연결

   - `onClick={handleCellClick}` 추가

4. ✅ 조건부 커서 스타일 추가

   - `cursor: day && events.length === 0 && !isEditing ? 'pointer' : 'default'`

5. ✅ 호버 효과 추가 (선택사항)

   - `'&:hover'` 조건부 스타일 추가
   - 조건: `day && events.length === 0 && !isEditing`
   - 배경색: `backgroundColor: '#f5f5f5'`

6. ✅ 날짜 문자열 생성 로직 확인

   - `formatDate(currentDate, day)` 사용 확인
   - `cellDate` 변수에 저장되어 있는지 확인

App.tsx 날짜 클릭 핸들러 구현 (7-8)

7. ⏳ handleDateClick 함수 구현

   - `date: string` 파라미터 받기
   - `editingEvent`가 있으면 조기 반환 (편집 모드 무시)
   - `setDate(date)` 호출하여 날짜 설정

8. ⏳ CalendarViewControls에 props 전달

   - `onDateClick={handleDateClick}` 전달
   - `isEditing={!!editingEvent}` 전달

CalendarViewControls 컴포넌트 수정 (9-10)

9. ⏳ Props 타입에 onDateClick, isEditing 추가

   - `onDateClick?: (date: string) => void` prop 추가
   - `isEditing?: boolean` prop 추가 (기본값: false)

10. ⏳ MonthlyCalendar 및 WeeklyCalendar에 props 전달

    - `onDateClick={onDateClick}` 전달
    - `isEditing={isEditing}` 전달

MonthlyCalendar 수정 (11)

11. ⏳ Props 타입에 onDateClick, isEditing 추가 및 CalendarCell에 전달

    - `onDateClick?: (date: string) => void` prop 추가
    - `isEditing?: boolean` prop 추가 (기본값: false)
    - CalendarCell에 `onDateClick={onDateClick}` 전달
    - CalendarCell에 `isEditing={isEditing}` 전달

WeeklyCalendar 수정 (12)

12. ⏳ Props 타입에 onDateClick, isEditing 추가 및 CalendarCell에 전달

    - `onDateClick?: (date: string) => void` prop 추가
    - `isEditing?: boolean` prop 추가 (기본값: false)
    - CalendarCell에 `onDateClick={onDateClick}` 전달
    - CalendarCell에 `isEditing={isEditing}` 전달

✅ Phase 1 테스트: 작업 13 - 기본 날짜 클릭 기능 테스트

    - 비어있는 날짜 셀 클릭 시 날짜가 폼에 채워지는지 확인
    - 일정이 있는 셀 클릭 시 동작하지 않는지 확인
    - 빈 셀(null day) 클릭 시 동작하지 않는지 확인
    - 날짜 형식이 YYYY-MM-DD인지 확인

---

Phase 2: 편집 모드 처리 (작업 14-15)

14. ⏳ 편집 모드 감지 로직 확인

    - `editingEvent`가 `null`이 아닌 경우 편집 모드로 판단
    - App.tsx에서 `isEditing={!!editingEvent}` 전달 확인

15. ⏳ 편집 모드 중 날짜 클릭 방지 확인

    - CalendarCell의 `handleCellClick`에서 `isEditing` 체크 확인
    - App.tsx의 `handleDateClick`에서 `editingEvent` 체크 확인

✅ Phase 2 테스트: 작업 16 - 편집 모드 처리 시나리오 테스트

    - 편집 모드 중 비어있는 날짜 셀 클릭 시 동작하지 않는지 확인
    - 편집 모드 중 기존 편집 중인 날짜가 유지되는지 확인

---

Phase 3: UX 개선 (작업 17-19) - 선택사항

17. ⏳ 호버 효과 강화

    - 더 눈에 띄는 호버 효과 추가
    - 트랜지션 효과 추가

18. ⏳ 클릭 피드백 추가

    - 클릭 시 시각적 피드백 (예: 배경색 변경)
    - 트랜지션 효과로 부드러운 전환

19. ⏳ 접근성 개선

    - `aria-label` 추가: "비어있는 날짜 셀을 클릭하면 해당 날짜가 일정 폼에 채워집니다"
    - 키보드 포커스 스타일 추가 (향후 키보드 지원을 위해)

✅ Phase 3 테스트: 작업 20 - UX 개선 확인

    - 호버 효과가 정상 작동하는지 확인
    - 시각적 피드백이 적절한지 확인

---

최종 테스트 (작업 21-24)

21. ⏳ 월간 뷰에서 날짜 클릭 기능 테스트

    - 비어있는 셀 클릭 동작 확인
    - 일정이 있는 셀 클릭 무시 확인
    - 날짜가 올바르게 폼에 채워지는지 확인

22. ⏳ 주간 뷰에서 날짜 클릭 기능 테스트

    - 비어있는 셀 클릭 동작 확인
    - 일정이 있는 셀 클릭 무시 확인
    - 날짜가 올바르게 폼에 채워지는지 확인

23. ⏳ 편집 모드 통합 테스트

    - 편집 모드 중 날짜 클릭이 방지되는지 확인
    - 편집 모드 종료 후 날짜 클릭이 다시 작동하는지 확인

24. ⏳ 전체 기능 통합 테스트

    - 모든 시나리오 동작 확인
    - 다른 기능과의 충돌 없는지 확인 (드래그 앤 드롭, 검색 등)

---

🎯 구현 특징

1. **조건부 클릭 처리**: 비어있는 셀, 편집 모드가 아닌 경우에만 동작
2. **사일런트 무시**: 일정이 있는 셀이나 편집 모드에서는 에러 없이 무시
3. **날짜 포맷팅**: 기존 `formatDate` 함수 재사용하여 일관성 유지
4. **Props 드릴링**: App.tsx → CalendarViewControls → MonthlyCalendar/WeeklyCalendar → CalendarCell
5. **편집 모드 보호**: 편집 중인 일정의 날짜를 실수로 변경하는 것 방지

---

📝 작업 순서 특징

1. **점진적 개발**: 각 Phase가 독립적으로 테스트 가능
2. **작은 단위**: 각 작업은 5-15분 내 완료 가능
3. **명확한 완료 조건**: 각 작업마다 구체적인 코드 추가/수정 사항 명시
4. **테스트 포함**: 각 Phase 완료 후 즉시 테스트하여 버그 조기 발견
5. **단순한 구현**: 드래그 앤 드롭과 달리 복잡한 라이브러리 없이 React onClick 이벤트만 사용

---

📌 구현 시 주의사항

- **이벤트 버블링**: EventBar 클릭 시 CalendarCell의 onClick이 발생하지 않도록 주의 (이미 EventBar가 있으므로 events.length > 0 체크로 해결됨)
- **날짜 형식**: `formatDate` 함수가 항상 `YYYY-MM-DD` 형식을 반환하는지 확인
- **편집 모드 상태**: `editingEvent`가 변경될 때마다 `isEditing` prop이 올바르게 업데이트되는지 확인
- **Props 전달**: 모든 컴포넌트에 props가 올바르게 전달되는지 확인 (타입 체크 활용)

---

📋 체크리스트 요약

### 필수 작업 (Phase 1-2)

- [x] CalendarCell 컴포넌트 수정 (1-6)
- [ ] App.tsx 핸들러 구현 (7-8)
- [ ] CalendarViewControls 수정 (9-10)
- [ ] MonthlyCalendar 수정 (11)
- [ ] WeeklyCalendar 수정 (12)
- [ ] 편집 모드 처리 (14-15)

### 선택 작업 (Phase 3)

- [ ] UX 개선 (17-19)

### 테스트

- [ ] Phase 1 테스트 (13)
- [ ] Phase 2 테스트 (16)
- [ ] Phase 3 테스트 (20)
- [ ] 최종 통합 테스트 (21-24)
