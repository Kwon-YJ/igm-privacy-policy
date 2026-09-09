/*
 * Design: "Legal Clarity" — consistent with privacy policy page
 * Account Deletion Request page for Google Play Store compliance
 * Requirements:
 * - App/developer name displayed
 * - Clear steps for account deletion request
 * - Data types deleted vs retained with retention periods
 */

import { useState } from "react";
import { policyMeta } from "@/data/privacyPolicy";
import { Shield, Trash2, Mail, Phone, CheckCircle2, AlertTriangle, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const IGM_LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029095588/BEdzSyDEoMCiPARqcX9Dgc/igm-logo_3087f916.jpeg";

type AppTarget = "igm" | "manager";

export default function DeleteAccount() {
  const [appTarget, setAppTarget] = useState<AppTarget>("igm");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const managerSteps = [
    {
      number: 1,
      title: "개인정보 보호책임자에게 삭제 요청 이메일 발송",
      description: "아래 이메일 주소로 계정 삭제를 요청하는 이메일을 보내주세요.",
      detail: `이메일 주소: ${policyMeta.privacyOfficer.email}\n\n이메일 제목에 \"[IGM Manager] 계정 삭제 요청\"을 포함하고, 본문에 가입 시 사용한 아이디와 이름을 기재해 주세요.`,
    },
    {
      number: 2,
      title: "본인 확인 절차 진행",
      description: "부정 삭제를 방지하기 위해 본인 확인 절차를 진행합니다.",
      detail: "개인정보 보호책임자가 요청자의 본인 여부를 확인하기 위해 가입 시 등록한 이메일 또는 전화번호로 확인 연락을 드릴 수 있습니다.",
    },
    {
      number: 3,
      title: "계정 및 데이터 삭제 처리",
      description: "본인 확인 완료 후, 계정과 관련 데이터가 삭제됩니다.",
      detail: "본인 확인이 완료되면 요청일로부터 7일 이내에 계정 및 관련 데이터를 삭제 처리합니다. 삭제 완료 시 이메일로 결과를 안내드립니다.",
    },
  ];

  const managerDeletedData = [
    { category: "계정 정보", items: "아이디, 비밀번호, 이름, 이메일, 전화번호", timing: "요청 후 7일 이내 삭제" },
    { category: "소속/현장 정보", items: "현장명, 소속(회사/카테고리) 정보, 역할(site_admin, category_admin, manager, master)", timing: "요청 후 7일 이내 삭제" },
    { category: "기기·서비스 정보", items: "인증 토큰, 기기 ID, 푸시 알림 토큰(FCM)", timing: "요청 후 7일 이내 삭제" },
  ];

  const appLabel = appTarget === "manager" ? "IGM Manager" : "IGM";
  const mailSubject = appTarget === "manager" ? "[IGM Manager] 계정 삭제 요청" : "[IGM] 계정 삭제 요청";

  const steps = appTarget === "manager" ? managerSteps : [
    {
      number: 1,
      title: "개인정보 보호책임자에게 삭제 요청 이메일 발송",
      description: "아래 이메일 주소로 계정 삭제를 요청하는 이메일을 보내주세요.",
      detail: `이메일 주소: ${policyMeta.privacyOfficer.email}\n\n이메일 제목에 \"[IGM] 계정 삭제 요청\"을 포함하고, 본문에 가입 시 사용한 아이디와 이름을 기재해 주세요.`,
    },
    {
      number: 2,
      title: "본인 확인 절차 진행",
      description: "부정 삭제를 방지하기 위해 본인 확인 절차를 진행합니다.",
      detail: "개인정보 보호책임자가 요청자의 본인 여부를 확인하기 위해 가입 시 등록한 이메일 또는 전화번호로 확인 연락을 드릴 수 있습니다.",
    },
    {
      number: 3,
      title: "계정 및 데이터 삭제 처리",
      description: "본인 확인 완료 후, 계정과 관련 데이터가 삭제됩니다.",
      detail: "본인 확인이 완료되면 요청일로부터 7일 이내에 계정 및 관련 데이터를 삭제 처리합니다. 삭제 완료 시 이메일로 결과를 안내드립니다.",
    },
  ];

  const deletedData = appTarget === "manager" ? managerDeletedData : [
    { category: "계정 정보", items: "아이디, 비밀번호, 이름, 이메일", timing: "요청 후 7일 이내 삭제" },
    { category: "건강 데이터", items: "심박수(BPM), PPG 원신호, HRV 지표, 스트레스 지수", timing: "요청 후 7일 이내 삭제" },
    { category: "기기 정보", items: "블루투스 기기 정보, 스마트폰 기기 정보", timing: "요청 후 7일 이내 삭제" },
    { category: "선택 정보", items: "생년월일, 성별, 관리자 코드", timing: "요청 후 7일 이내 삭제" },
  ];

  const retainedData = [
    { category: "서비스 이용 기록", reason: "전자상거래법", period: "5년" },
    { category: "소비자 불만·분쟁 처리 기록", reason: "전자상거래법", period: "3년" },
    { category: "접속 로그", reason: "통신비밀보호법", period: "3개월" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src={IGM_LOGO_URL}
                alt="IGM Logo"
                className="w-9 h-9 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-base font-bold text-foreground tracking-tight">IGM</h1>
                <p className="text-[11px] text-muted-foreground -mt-0.5">계정 삭제 요청</p>
              </div>
            </div>
            <Link href="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              개인정보처리방침
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-destructive rounded-full" />
            <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Account Deletion</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-3">
            계정 및 데이터 삭제 요청
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {appLabel} 앱 사용자는 언제든지 자신의 계정과 관련 데이터의 삭제를 요청할 수 있습니다.
            아래 안내에 따라 삭제를 요청해 주시면, 신속하게 처리해 드리겠습니다.
          </p>
          <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-muted/50 rounded-lg w-fit">
            <Shield className="w-4 h-4 text-primary/70" />
            <span className="text-xs text-muted-foreground">
              앱 이름: <strong className="text-foreground">{appLabel}</strong> | 개발자: <strong className="text-foreground">IGM (대표: {policyMeta.representative})</strong>
            </span>
          </div>
          {appTarget === "manager" && (
            <p className="text-xs text-muted-foreground leading-relaxed mt-3 max-w-2xl">
              IGM Manager 앱은 관리자용 앱으로 근로자의 건강 데이터를 직접 수집하지 않습니다.
              근로자(워치)의 건강 데이터 삭제는 IGM 앱의 계정 삭제 절차를 통해 처리됩니다.
            </p>
          )}

          {/* App Selector Tabs */}
          <div className="mt-6 inline-flex p-1 bg-muted rounded-lg border border-border" role="tablist" aria-label="앱 선택">
            <button
              role="tab"
              aria-selected={appTarget === "igm"}
              onClick={() => {
                setAppTarget("igm");
                setExpandedStep(null);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                appTarget === "igm" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              IGM
            </button>
            <button
              role="tab"
              aria-selected={appTarget === "manager"}
              onClick={() => {
                setAppTarget("manager");
                setExpandedStep(null);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                appTarget === "manager" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              IGM Manager
            </button>
          </div>
        </motion.div>

        {/* Steps Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive/70" />
            삭제 요청 절차
          </h3>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-border/80"
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                  className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-destructive">{step.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      expandedStep === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedStep === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border"
                  >
                    <div className="p-4 sm:p-5 pl-[4.5rem] bg-muted/20">
                      {step.detail.split("\n").map((line, i) => (
                        <p key={i} className={`text-sm text-foreground/80 leading-relaxed ${line === "" ? "h-3" : ""}`}>
                          {line}
                        </p>
                      ))}
                      {step.number === 1 && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                          <a
                            href={`mailto:${policyMeta.privacyOfficer.email}?subject=${encodeURIComponent(mailSubject)}`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            <Mail className="w-4 h-4" />
                            이메일로 삭제 요청하기
                          </a>
                          <a
                            href={`tel:${policyMeta.privacyOfficer.phone}`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            전화 문의: {policyMeta.privacyOfficer.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Deleted Data Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            삭제되는 데이터
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            계정 삭제 요청 시 아래 데이터가 영구적으로 삭제되며, 복구할 수 없습니다.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-50">
                  <th className="px-4 py-3 text-left font-semibold text-foreground/90 border-b border-border">데이터 유형</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground/90 border-b border-border">세부 항목</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground/90 border-b border-border">삭제 시점</th>
                </tr>
              </thead>
              <tbody>
                {deletedData.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                    <td className="px-4 py-3 font-medium text-foreground/85 border-b border-border/50 whitespace-nowrap">{row.category}</td>
                    <td className="px-4 py-3 text-foreground/75 border-b border-border/50">{row.items}</td>
                    <td className="px-4 py-3 text-green-700 font-medium border-b border-border/50 whitespace-nowrap">{row.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Retained Data Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            법령에 따라 보관되는 데이터
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            아래 데이터는 관련 법령에 따라 일정 기간 보관 후 파기됩니다. 보관 기간 동안 해당 데이터는 법적 의무 이행 목적으로만 사용됩니다.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="px-4 py-3 text-left font-semibold text-foreground/90 border-b border-border">데이터 유형</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground/90 border-b border-border">보관 근거</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground/90 border-b border-border">보관 기간</th>
                </tr>
              </thead>
              <tbody>
                {retainedData.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                    <td className="px-4 py-3 font-medium text-foreground/85 border-b border-border/50 whitespace-nowrap">{row.category}</td>
                    <td className="px-4 py-3 text-foreground/75 border-b border-border/50">{row.reason}</td>
                    <td className="px-4 py-3 border-b border-border/50 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {row.period}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12 p-6 bg-muted/30 rounded-xl border border-border"
        >
          <h3 className="text-base font-bold text-foreground mb-4">문의처</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">개인정보 보호책임자</p>
              <div className="space-y-1.5 text-sm">
                <p className="text-foreground/85"><span className="text-muted-foreground w-14 inline-block">성명</span> {policyMeta.privacyOfficer.name} ({policyMeta.privacyOfficer.title})</p>
                <p className="text-foreground/85"><span className="text-muted-foreground w-14 inline-block">이메일</span> <a href={`mailto:${policyMeta.privacyOfficer.email}`} className="text-primary hover:underline">{policyMeta.privacyOfficer.email}</a></p>
                <p className="text-foreground/85"><span className="text-muted-foreground w-14 inline-block">전화</span> <a href={`tel:${policyMeta.privacyOfficer.phone}`} className="text-primary hover:underline">{policyMeta.privacyOfficer.phone}</a></p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">회사 연락처</p>
              <div className="space-y-1.5 text-sm">
                <p className="text-foreground/85"><span className="text-muted-foreground w-14 inline-block">회사명</span> {policyMeta.companyName}</p>
                <p className="text-foreground/85"><span className="text-muted-foreground w-14 inline-block">이메일</span> <a href={`mailto:${policyMeta.email}`} className="text-primary hover:underline">{policyMeta.email}</a></p>
                <p className="text-foreground/85"><span className="text-muted-foreground w-14 inline-block">전화</span> <a href={`tel:${policyMeta.phone}`} className="text-primary hover:underline">{policyMeta.phone}</a></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <img
              src={IGM_LOGO_URL}
              alt="IGM Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground/70">IGM</p>
              <p>대표: {policyMeta.representative} | 사업자등록번호: {policyMeta.businessNumber}</p>
              <p>이메일: {policyMeta.email} | 전화: {policyMeta.phone}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground/60">
            <Link href="/" className="hover:text-primary transition-colors">개인정보처리방침</Link>
            <span>|</span>
            <Link href="/igm-home" className="hover:text-primary transition-colors">자녀 앱 개인정보처리방침</Link>
            <span>|</span>
            <span>계정 삭제 요청</span>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} IGM. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
