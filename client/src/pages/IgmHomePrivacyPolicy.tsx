/*
 * Design: "Legal Clarity" — same style as Home.tsx (Swiss typography legal document)
 * Privacy policy page for IGM 자녀 앱(홈) / igm_home
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  policySectionsIgmHome,
  policyMetaIgmHome,
} from "@/data/privacyPolicyIgmHome";
import { parseContent } from "@/lib/policyContentParser";
import { Shield, ChevronUp, Menu, X, Trash2, HeartPulse, Users } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const IGM_LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029095588/BEdzSyDEoMCiPARqcX9Dgc/igm-logo_3087f916.jpeg";

export default function IgmHomePrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(
    policySectionsIgmHome[0].id
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setShowScrollTop(scrollY > 400);

    let currentSection = policySectionsIgmHome[0].id;
    for (const section of policySectionsIgmHome) {
      const el = sectionRefs.current[section.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          currentSection = section.id;
        }
      }
    }
    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src={IGM_LOGO_URL}
                alt="IGM Logo"
                className="w-9 h-9 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-base font-bold text-foreground tracking-tight">
                  IGM 자녀 앱(홈)
                </h1>
                <p className="text-[11px] text-muted-foreground -mt-0.5">
                  개인정보처리방침
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                <span>시행일: {policyMetaIgmHome.effectiveDate}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="목차 열기"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile TOC overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-background border-b border-border shadow-lg max-h-[60vh] overflow-y-auto"
          >
            <nav className="p-4 space-y-0.5">
              {policySectionsIgmHome.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all ${
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-xs mr-2 opacity-60">
                    {String(section.number).padStart(2, "0")}
                  </span>
                  {section.title}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 py-8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4 px-3">
                목차
              </p>
              <nav className="sidebar-scroll space-y-0.5 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
                {policySectionsIgmHome.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-all duration-200 group relative ${
                        isActive
                          ? "bg-primary/8 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <span
                        className={`font-mono text-[11px] mr-1.5 ${isActive ? "text-primary" : "opacity-50"}`}
                      >
                        {String(section.number).padStart(2, "0")}
                      </span>
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 py-8 lg:py-10">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5 bg-primary rounded-full" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Privacy Policy
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-3">
                IGM 자녀 앱(홈) 개인정보처리방침
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                IGM은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를
                보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록
                하기 위하여, 보호자 초대 코드로 가입하는 자녀 앱(이하 "본 앱")에
                대하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  IGM(근로자용) 개인정보처리방침 보기
                </Link>
                <Link
                  href="/igm-home-manager"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Users className="w-3.5 h-3.5" />
                  IGM 보호자 앱 개인정보처리방침 보기
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary/70" />
                  시행일: {policyMetaIgmHome.effectiveDate}
                </span>
                <span>최종 수정일: {policyMetaIgmHome.lastUpdated}</span>
              </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-0">
              {policySectionsIgmHome.map((section, index) => (
                <motion.section
                  key={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className={`py-8 ${
                    index < policySectionsIgmHome.length - 1
                      ? "border-b border-border/60"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="shrink-0 text-2xl sm:text-3xl font-black text-primary/20 font-mono leading-none select-none">
                      {String(section.number).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight pt-1">
                      {section.title}
                    </h3>
                  </div>
                  <div className="pl-0 sm:pl-12">
                    {parseContent(section.content)}
                  </div>
                </motion.section>
              ))}
            </div>

            {/* Account Deletion CTA */}
            <div className="mt-12 p-5 sm:p-6 bg-destructive/5 border border-destructive/15 rounded-xl">
              <div className="flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-destructive/70 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">
                    계정 및 데이터 삭제 요청
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    자녀 앱 계정과 관련 데이터의 삭제를 원하시면 아래 링크에서
                    삭제 절차를 확인하실 수 있습니다.
                  </p>
                  <Link
                    href="/delete-account"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline"
                  >
                    삭제 요청 페이지로 이동
                    <ChevronUp className="w-3.5 h-3.5 rotate-90" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                <img
                  src={IGM_LOGO_URL}
                  alt="IGM Logo"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground/70">IGM</p>
                  <p>
                    대표: {policyMetaIgmHome.representative} |
                    사업자등록번호: {policyMetaIgmHome.businessNumber}
                  </p>
                  <p>
                    이메일: {policyMetaIgmHome.email} | 전화:{" "}
                    {policyMetaIgmHome.phone}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground/60">
                <span>개인정보처리방침</span>
                <span>|</span>
                <Link
                  href="/"
                  className="hover:text-primary transition-colors"
                >
                  근로자용 개인정보처리방침
                </Link>
                <span>|</span>
                <Link
                  href="/igm-home-manager"
                  className="hover:text-primary transition-colors"
                >
                  보호자 앱 개인정보처리방침
                </Link>
                <span>|</span>
                <Link
                  href="/delete-account"
                  className="hover:text-primary transition-colors"
                >
                  계정 삭제 요청
                </Link>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground/60">
                &copy; {new Date().getFullYear()} IGM. All rights reserved.
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
            aria-label="맨 위로 이동"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}