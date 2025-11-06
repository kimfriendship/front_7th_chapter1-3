import fs from 'fs';
import path from 'path';

/**
 * E2E 테스트용 데이터베이스(e2e.json)를 초기 상태로 리셋합니다.
 * beforeEach에서 호출하여 각 테스트의 독립성을 보장합니다.
 */
export function resetE2EDatabase() {
  const initialData = fs.readFileSync(
    path.join(process.cwd(), 'e2e/fixtures/initial-data.json'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(process.cwd(), 'src/__mocks__/response/e2e.json'),
    initialData
  );
}

/**
 * 빈 상태로 데이터베이스를 초기화합니다.
 */
export function clearE2EDatabase() {
  const emptyData = JSON.stringify({ events: [] }, null, 2);
  fs.writeFileSync(
    path.join(process.cwd(), 'src/__mocks__/response/e2e.json'),
    emptyData
  );
}

