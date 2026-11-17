import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { policyMeta } from "./privacyPolicy";
import {
  policyMetaAttendance as meta,
  policySectionsAttendance as sections,
  attendancePolicyDocument,
} from "./privacyPolicyAttendance";

const policyFile = new URL("./attendance-policy.json", import.meta.url);
const rawPolicy = readFileSync(policyFile);
const parsedPolicy = JSON.parse(rawPolicy.toString("utf8"));
const content = (id: string) => {
  const section = sections.find(section => section.id === id);
  assert.ok(section, `Missing section: ${id}`);
  return section.content;
};
const allContent = sections.map(section => section.content).join("\n");

test("공개 JSON은 검토된 시행본과 동일한 바이트·버전·12개 섹션을 사용한다", () => {
  assert.equal(
    createHash("sha256").update(rawPolicy).digest("hex"),
    "58c43933e2da07598f35e8974044690ff1f1d89e27c74950af3ff2157f71f820"
  );
  assert.deepEqual(parsedPolicy, attendancePolicyDocument);
  assert.equal(attendancePolicyDocument.schemaVersion, 1);
  assert.equal(attendancePolicyDocument.version, "ATTENDANCE-2026-11-17");
  assert.equal(attendancePolicyDocument.status, "시행");
  assert.equal(attendancePolicyDocument.effectiveDate, "2026년 11월 17일");
  assert.equal(attendancePolicyDocument.lastUpdated, "2026년 11월 17일");
  assert.equal(attendancePolicyDocument.sections.length, 12);
  assert.equal(meta.version, "ATTENDANCE-2026-11-17");
  assert.equal(meta.status, "시행");
  assert.equal(meta.effectiveDate, "2026년 11월 17일");
  assert.equal(meta.lastUpdated, "2026년 11월 17일");
  assert.deepEqual(
    Object.keys(attendancePolicyDocument).sort(),
    [
      "schemaVersion",
      "title",
      "version",
      "status",
      "effectiveDate",
      "lastUpdated",
      "sections",
    ].sort()
  );
});

test("페이지와 앱이 읽는 12개 섹션은 순서·ID·제목을 유지한다", () => {
  assert.deepEqual(
    sections.map(section => section.number),
    Array.from({ length: 12 }, (_, index) => index + 1)
  );
  assert.deepEqual(
    sections.map(section => section.id),
    [
      "scope",
      "purpose",
      "items",
      "legal-basis",
      "sharing",
      "processors",
      "retention",
      "rights",
      "cookies",
      "security",
      "contact",
      "changes",
    ]
  );
  assert.equal(new Set(sections.map(section => section.id)).size, 12);
  assert.ok(
    sections.every(
      section =>
        /^[a-z][a-z0-9-]*$/.test(section.id) &&
        section.title.trim().length > 0 &&
        section.content.trim().length > 0
    )
  );
});

test("기술인·팀장·사업주별 계정 항목과 실제 수집 항목을 정확히 반영한다", () => {
  const items = content("items");
  assert.ok(items.includes("이름, 휴대폰 번호, 비밀번호"));
  assert.match(items, /팀장·사업주 계정/);
  assert.match(items, /이메일 주소, 이메일 인증 상태/);
  assert.match(items, /현재 신규 기술인 가입에는 이메일을 요구하지 않음/);
  assert.match(items, /세션·이메일 인증·재설정·QR·문의 확인 토큰/);
  for (const item of [
    "주민등록번호",
    "은행명, 계좌번호, 예금주",
    "신발 사이즈, 혈액형, 작업복(조끼) 사이즈",
    "월별 현장·숙박·출퇴·식권·조정월·신고 구분",
    "입사일",
    "재직 상태",
    "공종",
  ])
    assert.ok(items.includes(item), `Missing item: ${item}`);
});

test("현재 GPS·카메라 처리와 과거 위치 기록을 구분한다", () => {
  const items = content("items");
  assert.match(
    items,
    /GPS 위치를 새로 수집하거나 위치 권한을 요청하지 않습니다/
  );
  assert.match(items, /이전 버전에서 저장된 위치 기록이 있는 경우/);
  assert.match(items, /정해진 보유기간과 파기 절차에 따라 처리됩니다/);
  assert.match(
    items,
    /카메라 영상·사진은 기기에서 QR을 인식하는 데 사용되며 서버에 저장하지 않습니다/
  );
});

test("권한 있는 팀장·사업주가 담당 범위를 열람하고 엑셀로 내려받을 수 있음을 안내한다", () => {
  const sharing = content("sharing");
  assert.match(sharing, /권한 있는 팀장·사업주/);
  assert.match(sharing, /담당 범위/);
  assert.match(sharing, /엑셀로 내려받을 수 있습니다/);
  assert.match(sharing, /이미 내려받은 엑셀 파일/);
});

test("확정 보유기간을 빠짐없이 반영한다", () => {
  const retention = content("retention");
  for (const period of [
    "관련 근무일 또는 최종 처리일부터 3년",
    "탈퇴 처리 완료 후 30일 이내",
    "가입일부터 7일",
    "최대 7일",
    "최대 30분",
    "최대 5분",
    "최대 3개월",
    "최대 30일",
  ])
    assert.ok(retention.includes(period), `Missing retention: ${period}`);
});

test("위탁·국외 이전과 회사가 직접 관리하는 전용 서버를 실제 구조대로 안내한다", () => {
  const processors = content("processors");
  assert.match(processors, /Cloudflare, Inc\./);
  assert.match(processors, /Vercel Inc\./);
  assert.match(processors, /미국 소재 법인/);
  assert.match(processors, /전용 서버 환경에서 운영/);
  assert.match(processors, /국외 이전을 거부할 수 있습니다/);
  assert.doesNotMatch(processors, /postgres(?:ql)?:\/\//i);
  assert.doesNotMatch(processors, /smtp:\/\//i);
});

test("운영자·개인정보 보호책임자 정보를 유지한다", () => {
  for (const value of [
    "주식회사 아이지엠",
    "문용식",
    "124-88-01400",
    "권영재",
    "rdw1435@naver.com",
    "010-2496-1435",
  ])
    assert.ok(allContent.includes(value), `Missing operator info: ${value}`);
  assert.equal(meta.privacyOfficer.email, policyMeta.privacyOfficer.email);
  assert.equal(meta.privacyOfficer.phone, policyMeta.privacyOfficer.phone);
});

test("시행 전 드래프트·미확정 문구가 공개 문서에 남아 있지 않다", () => {
  for (const phrase of [
    "개발·검토본",
    "공개 서비스 시행 전 확정",
    "미확정",
    "검토 중인 운영안",
    "정식 시행 전",
    "법적 검토 전",
    "확정 전",
  ])
    assert.ok(!allContent.includes(phrase), `Draft phrase remains: ${phrase}`);
  assert.ok(!JSON.stringify(parsedPolicy).includes("ATTENDANCE-DRAFT-"));
});

test("공개 JSON에 자격증명·연결 문자열이 포함되지 않는다", () => {
  for (const secretPattern of [
    /postgres(?:ql)?:\/\//i,
    /smtp:\/\//i,
    /DATABASE_URL/i,
    /SMTP_PASSWORD/i,
    /BEGIN (?:RSA |EC )?PRIVATE KEY/i,
  ])
    assert.doesNotMatch(rawPolicy.toString("utf8"), secretPattern);
});
