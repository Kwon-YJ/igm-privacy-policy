import { policyMeta, type PolicySection } from "./privacyPolicy";
import attendancePolicyJson from "./attendance-policy.json";

export interface AttendancePolicyDocument {
  schemaVersion: 1;
  title: string;
  version: string;
  status: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: PolicySection[];
}

// The issued JSON is the single source of truth for this page and for the
// /attendance-policy.json document read by the three attendance apps.
export const attendancePolicyDocument =
  attendancePolicyJson as unknown as AttendancePolicyDocument;

export const policySectionsAttendance: PolicySection[] =
  attendancePolicyDocument.sections;

export const policyMetaAttendance = {
  ...policyMeta,
  appName: "공수달력 · 기술인·팀장·사업주",
  companyName: "주식회사 아이지엠",
  version: attendancePolicyDocument.version,
  effectiveDate: attendancePolicyDocument.effectiveDate,
  lastUpdated: attendancePolicyDocument.lastUpdated,
  status: attendancePolicyDocument.status,
};
