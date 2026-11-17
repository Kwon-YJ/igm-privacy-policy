import { useEffect, useState } from "react";
import { CalendarDays, ChevronUp, Menu, Shield, X } from "lucide-react";
import { Link } from "wouter";
import {
  policyMetaAttendance as meta,
  policySectionsAttendance as sections,
} from "@/data/privacyPolicyAttendance";
import { parseContent } from "@/lib/policyContentParser";

export default function AttendancePrivacyPolicy() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "공수달력 개인정보 처리방침 | IGM";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const contents = (
    <ol className="space-y-1">
      {sections.map(section => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            onClick={() => setMenuOpen(false)}
            className="flex gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span className="font-mono text-xs text-primary pt-0.5">
              {String(section.number).padStart(2, "0")}
            </span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div id="attendance-policy-top" className="min-h-screen bg-background">
      <a
        href="#attendance-policy-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-background focus:p-3 focus:text-primary"
      >
        본문으로 바로가기
      </a>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-primary"
          >
            <CalendarDays
              className="w-9 h-9 p-1.5 bg-primary/10 text-primary rounded-lg"
              aria-hidden="true"
            />
            <span>
              <span className="block text-base font-bold">IGM 공수달력</span>
              <span className="block text-[11px] text-muted-foreground">
                기술인 · 팀장 · 사업주
              </span>
            </span>
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="attendance-policy-mobile-toc"
            aria-label={menuOpen ? "목차 닫기" : "목차 열기"}
            onClick={() => setMenuOpen(value => !value)}
            className="lg:hidden p-3 rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="w-5 h-5" />
            ) : (
              <Menu aria-hidden="true" className="w-5 h-5" />
            )}
          </button>
        </div>
        <nav
          id="attendance-policy-mobile-toc"
          aria-label="모바일 개인정보 처리방침 목차"
          hidden={!menuOpen}
          className="lg:hidden max-h-[60vh] overflow-y-auto border-t border-border p-4"
        >
          {contents}
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <nav
            aria-label="개인정보 처리방침 목차"
            className="sticky top-20 py-8 max-h-[calc(100vh-90px)] overflow-y-auto sidebar-scroll"
          >
            <p className="px-3 mb-4 text-xs font-semibold tracking-widest text-muted-foreground">
              목차
            </p>
            {contents}
          </nav>
        </aside>
        <main
          id="attendance-policy-content"
          tabIndex={-1}
          className="flex-1 min-w-0 py-8 lg:py-10 scroll-mt-24"
        >
          <div className="mb-8">
            <p className="text-xs text-primary font-semibold tracking-wider mb-3">
              ATTENDANCE · PRIVACY POLICY
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              공수달력 개인정보 처리방침
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              기술인·팀장·사업주 세 앱과 공통 API에 적용되는 안내입니다.
              건강·안전관리용 IGM 앱의 방침과 구분됩니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Shield
                  className="w-3.5 h-3.5 text-primary"
                  aria-hidden="true"
                />
                {meta.status}
              </span>
              <span>최종 수정: {meta.lastUpdated}</span>
              <span>시행일: {meta.effectiveDate}</span>
            </div>
          </div>

          {sections.map(section => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="py-8 border-b border-border/60 scroll-mt-24"
            >
              <div className="flex items-start gap-4 mb-4">
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl sm:text-3xl font-black text-primary/40 font-mono leading-none"
                >
                  {String(section.number).padStart(2, "0")}
                </span>
                <h2
                  id={`${section.id}-title`}
                  className="text-lg sm:text-xl font-bold tracking-tight"
                >
                  {section.title}
                </h2>
              </div>
              <div
                className={`sm:pl-12 break-words ${["items", "processors", "retention", "cookies"].includes(section.id) ? "[&_table]:min-w-[32rem]" : ""}`}
              >
                {parseContent(section.content)}
              </div>
            </section>
          ))}

          <section
            aria-labelledby="attendance-policy-support-title"
            className="mt-10 p-5 sm:p-6 bg-muted/50 border border-border rounded-xl"
          >
            <h2 id="attendance-policy-support-title" className="font-bold mb-2">
              공수달력 개인정보 문의·탈퇴 요청
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              앱의 '문의·번호 변경·탈퇴' 또는 로그인 화면의 '로그인 불가 문의'를
              이용하세요. 이메일 접근이 어렵거나 별도 권리 행사가 필요하면 아래
              문의처로 연락해 주세요. 다른 IGM 앱의 일괄 삭제 절차와 구분합니다.
            </p>
            <a
              href={`mailto:${meta.privacyOfficer.email}?subject=${encodeURIComponent("공수달력 개인정보 문의")}`}
              className="text-sm font-semibold text-primary underline underline-offset-4 break-all"
            >
              {meta.privacyOfficer.email}
            </a>
          </section>

          <footer className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground space-y-3">
            <p>
              {meta.companyName} · 대표 {meta.representative} · 사업자등록번호{" "}
              {meta.businessNumber}
            </p>
            <p>
              버전: {meta.version} · {meta.status}
            </p>
            <nav
              aria-label="관련 개인정보 안내"
              className="flex flex-wrap gap-x-5 gap-y-3"
            >
              <Link href="/" className="text-primary hover:underline">
                IGM 기본 방침
              </Link>
              <Link
                href="/igm-home"
                className="hover:text-primary hover:underline"
              >
                자녀 앱
              </Link>
              <Link
                href="/igm-home-manager"
                className="hover:text-primary hover:underline"
              >
                보호자 앱
              </Link>
              <Link
                href="/hc-app"
                className="hover:text-primary hover:underline"
              >
                건강 케어 앱
              </Link>
              <a
                href="#attendance-policy-top"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <ChevronUp className="w-4 h-4" aria-hidden="true" />맨 위로
              </a>
            </nav>
          </footer>
        </main>
      </div>
    </div>
  );
}
