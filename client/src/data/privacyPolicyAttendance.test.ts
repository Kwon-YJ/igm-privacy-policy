import { test } from "node:test";
import assert from "node:assert/strict";
import { policyMeta } from "./privacyPolicy";
import {
  policyMetaAttendance as meta,
  policySectionsAttendance as sections,
} from "./privacyPolicyAttendance";

const content = (id: string) => {
  const section = sections.find(section => section.id === id);
  assert.ok(section, `Missing section: ${id}`);
  return section.content;
};

test("공수달력 공통 방침은 세 앱을 구분하고 고유한 목차·버전을 갖는다", () => {
  assert.equal(
    new Set(sections.map(section => section.id)).size,
    sections.length
  );
  assert.deepEqual(
    sections.map(section => section.number),
    sections.map((_, i) => i + 1)
  );
  assert.ok(
    sections.every(
      section => /^[a-z][a-z-]*$/.test(section.id) && section.content.trim()
    )
  );
  for (const role of ["worker", "manager", "master"])
    assert.ok(content("scope").includes(role));
  assert.match(meta.version, /^ATTENDANCE-DRAFT-/);
  assert.equal(meta.status, "개발·검토본");
  assert.equal(meta.effectiveDate, "공개 서비스 시행 전 확정");
  assert.equal(meta.privacyOfficer.email, policyMeta.privacyOfficer.email);
  assert.ok(content("contact").includes(meta.privacyOfficer.email));
});

test("현재 수집·권한과 과거 GPS를 구분하고 새 수집이나 급여 지급을 약속하지 않는다", () => {
  assert.match(content("items"), /이름, 휴대폰 번호, 이메일, 비밀번호/);
  assert.match(content("location-permissions"), /GPS 위치를 새로 수집하지 않/);
  assert.match(
    content("location-permissions"),
    /과거 데이터의 삭제를 의미하지 않/
  );
  assert.match(
    content("location-permissions"),
    /영상·사진 자체를 서버에 저장하지 않/
  );
  assert.match(
    content("access-sharing"),
    /단가·수령 조건·공수와 예상 금액을 조회/
  );
  assert.match(content("access-sharing"), /변경할 수는 없/);
  assert.match(
    content("access-sharing"),
    /과거 기록을 새 회사·팀에 소급 편입하지 않/
  );
  assert.match(content("purpose"), /실제 급여 지급.*수행하지 않/);
});

test("미확정 보관·위탁·제공을 확정 법정 기간이나 자동 파기로 오인시키지 않는다", () => {
  assert.match(
    content("retention"),
    /3년·30일은 법정 보존기간으로 확정된 내용이 아니/
  );
  assert.match(content("retention"), /자동 파기 기능도 현재 도입하지 않/);
  assert.match(content("retention"), /무기한 보관의 근거/);
  assert.match(content("processors"), /SMTP/);
  assert.match(
    content("processors"),
    /이전받는 자·국가·시기·방법·목적·항목·기간/
  );
  assert.match(content("access-sharing"), /필요한 법적 동의의 대체로 보지 않/);
  assert.match(content("changes"), /기존 가입 확인 기록이 변경되지 않/);
});

test("실제 PWA 인증 쿠키와 문의·탈퇴 경로를 별도로 안내한다", () => {
  for (const cookie of ["attendance_session", "attendance_support_access"])
    assert.ok(content("cookies").includes(cookie));
  assert.match(content("cookies"), /최대 7일/);
  assert.match(content("cookies"), /최대 30분/);
  assert.match(
    content("cookies"),
    /개인정보 API 응답을 앱 셸 캐시에 보관하지 않/
  );
  assert.match(content("rights"), /로그인 불가 문의/);
  assert.match(content("rights"), /번호 변경·탈퇴/);
});
