# E2E 테스트 실행 가이드

## 사전 준비

E2E 테스트를 실행하기 전에 개발 서버와 백엔드 서버를 E2E 모드로 실행해야 합니다.

## 테스트 실행 방식

- **순차 실행 (Serial)**: 모든 E2E 테스트 파일은 순차적으로 실행됩니다.
- **workers: 1**: 한 번에 하나의 테스트 파일만 실행되어 데이터베이스 충돌을 방지합니다.
- **fullyParallel: false**: 파일 간 병렬 실행을 비활성화하여 테스트 격리를 보장합니다.

## 실행 방법

### 방법 1: 한 번에 실행 (권장)

터미널 1에서:

```bash
pnpm run dev:e2e
```

서버가 완전히 시작될 때까지 기다린 후 (약 5-10초), 터미널 2에서:

```bash
pnpm run test:e2e
```

### 방법 2: 개별 실행

터미널 1 - 백엔드 서버 (E2E 모드):

```bash
pnpm run server:e2e
```

터미널 2 - 프론트엔드 서버:

```bash
pnpm run start
```

터미널 3 - 테스트 실행:

```bash
pnpm run test:e2e
```

## 테스트 명령어

```bash
# 모든 E2E 테스트 실행 (헤드리스)
pnpm run test:e2e

# UI 모드로 실행 (디버깅 용이)
pnpm run test:e2e:ui

# 브라우저를 보면서 실행 (헤드 모드)
pnpm run test:e2e:headed

# 특정 테스트 파일만 실행
pnpm run test:e2e e2e/basic-event-workflow.spec.ts

# 특정 브라우저에서만 실행
pnpm run test:e2e --project=chromium
pnpm run test:e2e --project=firefox
pnpm run test:e2e --project=webkit

# 테스트 리포트 확인
pnpm run test:e2e:report
```

## E2E 테스트 DB

E2E 테스트는 `src/__mocks__/response/e2e.json` 파일을 데이터베이스로 사용합니다.

- 실제 개발 데이터(`realEvents.json`)와 완전히 분리
- **각 테스트 실행 전 자동으로 초기 상태로 리셋됨** (`beforeEach`에서 처리)
- 초기 데이터는 `e2e/fixtures/initial-data.json`에 저장됨

### 초기 데이터 변경

초기 데이터를 변경하려면 `e2e/fixtures/initial-data.json` 파일을 수정하세요:

```json
{
  "events": [
    {
      "id": "e2e-test-event-1",
      "title": "기존 회의",
      "date": "2025-11-15",
      "startTime": "09:00",
      "endTime": "10:00",
      "description": "E2E 테스트용 초기 일정",
      "location": "회의실 A",
      "category": "업무",
      "repeat": { "type": "none", "interval": 0 },
      "notificationTime": 10
    }
  ]
}
```

### DB 리셋 헬퍼 함수

테스트 파일에서 DB 리셋이 필요한 경우:

```typescript
import { resetE2EDatabase, clearE2EDatabase } from './helpers/reset-db';

test.beforeEach(async ({ page }) => {
  resetE2EDatabase(); // 초기 데이터로 리셋
  // 또는
  clearE2EDatabase(); // 빈 상태로 리셋
  
  await page.goto('/');
});
```

## 트러블슈팅

### 1. 포트가 이미 사용 중인 경우

```bash
# 3000번 포트 확인
lsof -ti:3000

# 5174번 포트 확인
lsof -ti:5174

# 프로세스 종료 (PID는 위 명령어로 확인)
kill -9 <PID>

# 또는 한 번에 종료
lsof -ti:3000 | xargs kill -9
lsof -ti:5174 | xargs kill -9
```

### 2. 테스트가 타임아웃되는 경우

- 서버가 완전히 시작될 때까지 기다렸는지 확인
- 브라우저에서 `http://localhost:5174`이 정상적으로 열리는지 확인
- `e2e.json` 파일이 손상되지 않았는지 확인

### 3. 환경 변수가 제대로 설정되지 않는 경우

터미널에서 직접 확인:

```bash
TEST_ENV=e2e node server.js
```

서버 로그에 "Server running at http://localhost:3000" 메시지가 나타나야 합니다.

### 4. 셀렉터를 찾지 못하는 경우

UI 모드로 실행해서 디버깅:

```bash
pnpm run test:e2e:ui
```

각 단계를 천천히 실행하면서 요소가 제대로 나타나는지 확인할 수 있습니다.

## CI/CD 환경

GitHub Actions 등의 CI 환경에서는 `playwright.config.ts`의 `webServer` 설정 주석을 해제하여 자동으로 서버를 시작할 수 있습니다.

```typescript
webServer: {
  command: 'pnpm run dev:e2e',
  url: 'http://localhost:5174',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
},
```
