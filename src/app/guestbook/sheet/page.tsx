'use client';

/**
 * @file src/app/guestbook/sheet/page.tsx
 * @description Live Online Spreadsheet & Backup Manager (`/guestbook/sheet`).
 * Provides an automatic Google-Sheets-style table of all guestbook wishes with:
 * - Auto-sync & local browser backup so zero comments are ever lost
 * - 1-Click Excel / Google Sheets CSV download
 * - 1-Click Google Sheets `=IMPORTDATA(...)` formula (zero Apps Script needed!)
 * - Row-by-row delete button for managing or removing test comments
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Amiri, Aref_Ruqaa } from 'next/font/google';
import type { GuestbookWishRow } from '@/types/zaria';

const aref = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400', '700'] });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });

const BACKUP_STORAGE_KEY = 'zaria_sheet_backup_omar_ayat_v2';

export default function GuestbookSheetPage() {
  const slug = 'omar-ayat';
  const [wishes, setWishes] = useState<GuestbookWishRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [copiedTable, setCopiedTable] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSavedMsg, setWebhookSavedMsg] = useState<string | null>(null);
  const [savingWebhook, setSavingWebhook] = useState(false);

  const importDataFormula = `=IMPORTDATA("https://zaria-zov.com/api/guestbook/export?slug=omar-ayat")`;

  const loadWishes = useCallback(async () => {
    try {
      const res = await fetch(`/api/guestbook?slug=${encodeURIComponent(slug)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      const serverWishes: GuestbookWishRow[] = Array.isArray(data?.wishes) ? data.wishes : [];

      // Merge with local browser backup so nothing is ever lost
      let localBackup: GuestbookWishRow[] = [];
      try {
        const rawLocal = localStorage.getItem(BACKUP_STORAGE_KEY);
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          if (Array.isArray(parsed)) localBackup = parsed;
        }
      } catch {
        // Ignore storage errors
      }

      const map = new Map<string, GuestbookWishRow>();
      for (const w of [...serverWishes, ...localBackup]) {
        if (w && w.id && w.guest_name && w.message) {
          map.set(w.id, w);
        }
      }

      const merged = Array.from(map.values()).sort((a, b) =>
        (b.created_at || '').localeCompare(a.created_at || '')
      );

      setWishes(merged);
      try {
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // Ignore
      }
    } catch {
      // Fallback to local backup if offline
      try {
        const rawLocal = localStorage.getItem(BACKUP_STORAGE_KEY);
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          if (Array.isArray(parsed)) setWishes(parsed);
        }
      } catch {
        // Ignore
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadWishes();
    fetch('/api/guestbook/sheets-config')
      .then((r) => r.json())
      .then((d) => {
        if (d?.webhookUrl) setWebhookUrl(d.webhookUrl);
      })
      .catch(() => {});

    const interval = setInterval(loadWishes, 6000);
    return () => clearInterval(interval);
  }, [loadWishes]);

  const handleDeleteRow = async (id: string) => {
    setWishes((prev) => {
      const next = prev.filter((w) => w.id !== id);
      try {
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    try {
      await fetch(`/api/guestbook?id=${encodeURIComponent(id)}&slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
    } catch {
      // Ignore
    }
  };

  const handleCopyFormula = async () => {
    try {
      await navigator.clipboard.writeText(importDataFormula);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 3000);
    } catch {
      // Ignore
    }
  };

  const handleCopyAllForSheets = async () => {
    const header = ['التاريخ والوقت', 'الاسم الكريم', 'التهنئة / الكلمة'].join('\t');
    const rows = wishes.map((w) =>
      [
        formatDate(w.created_at),
        w.guest_name.replace(/\t|\n/g, ' '),
        w.message.replace(/\t|\n/g, ' '),
      ].join('\t')
    );
    const tsv = [header, ...rows].join('\n');
    try {
      await navigator.clipboard.writeText(tsv);
      setCopiedTable(true);
      setTimeout(() => setCopiedTable(false), 3000);
    } catch {
      // Ignore
    }
  };

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWebhook(true);
    setWebhookSavedMsg(null);
    try {
      const res = await fetch('/api/guestbook/sheets-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl, slug }),
      });
      const data = await res.json();
      if (res.ok && data?.ok) {
        setWebhookSavedMsg(
          `تم الربط بنجاح ومزامنة ${data.syncedCount || 0} تهنئة إلى Google Sheets!`
        );
      } else {
        setWebhookSavedMsg(data?.error || 'تأكد من صحة الرابط.');
      }
    } catch {
      setWebhookSavedMsg('تعذر الحفظ حالياً.');
    } finally {
      setSavingWebhook(false);
    }
  };

  function formatDate(iso: string) {
    try {
      return new Intl.DateTimeFormat('ar-JO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  return (
    <main
      dir="rtl"
      className={`min-h-screen w-full bg-[#1E0408] text-[#F7E7CE] py-8 px-4 sm:px-8 ${amiri.className}`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#3B0A11] via-[#4A0E17] to-[#3B0A11] border border-[#E6C79C]/40 rounded-3xl p-6 sm:p-8 shadow-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-block text-xs text-[#E6C79C] border border-[#E6C79C]/40 rounded-full px-3 py-1 mb-2">
              النسخة الاحتياطية المباشرة (تحديث تلقائي كل 6 ثوانٍ)
            </span>
            <h1 className={`text-2xl sm:text-4xl font-bold text-[#FDFBF7] ${aref.className}`}>
              جدول تهاني العروسين — المهندس عمر و الدكتورة آيات
            </h1>
            <p className="text-sm sm:text-base text-[#F7E7CE]/80 mt-1">
              إجمالي التهاني المحفوظة: <strong className="text-[#E6C79C]">{wishes.length}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`/api/guestbook/export?slug=${slug}`}
              className="px-5 py-2.5 rounded-xl bg-[#107C41] hover:bg-[#0E6B37] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>📊</span>
              <span>تحميل ملف Excel / Google Sheets</span>
            </a>

            <button
              type="button"
              onClick={handleCopyAllForSheets}
              className="px-4 py-2.5 rounded-xl bg-[#4A0E17] hover:bg-[#63121E] border border-[#E6C79C]/50 text-[#FDFBF7] font-bold text-sm transition-all cursor-pointer"
            >
              {copiedTable ? 'تم نسخ الجدول ✅' : 'نسخ الجدول للّصق في شيت 📋'}
            </button>
          </div>
        </div>

        {/* 1-Step Zero-Code Google Sheets Formula Box */}
        <div className="bg-[#2B060C] border border-[#E6C79C]/35 rounded-2xl p-5 mb-6 shadow-lg">
          <h2 className={`text-lg sm:text-xl font-bold text-[#E6C79C] mb-2 ${aref.className}`}>
            ✨ ربط مباشر مع Google Sheets بدون أي كود برمجي (بخطوة واحدة فقط):
          </h2>
          <p className="text-sm sm:text-base text-[#F7E7CE]/90 mb-3 leading-relaxed">
            افتح أي ملف Google Sheet فارغ في حسابك، واضغط على الخانة الأولى <strong>A1</strong>، والصق فيها هذه المعادلة فقط (بدون Apps Script نهائياً) وسيظهر الجدول كاملاً داخل Google Sheets تلقائياً:
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <code
              dir="ltr"
              className="flex-1 bg-black/50 border border-[#E6C79C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#E6C79C] font-mono select-all overflow-x-auto"
            >
              {importDataFormula}
            </code>
            <button
              type="button"
              onClick={handleCopyFormula}
              className="px-5 py-3 rounded-xl bg-[#E6C79C] text-[#2D070D] font-bold text-sm hover:bg-[#f2d8b3] transition-all shrink-0 cursor-pointer"
            >
              {copiedFormula ? 'تم النسخ ✅' : 'نسخ المعادلة'}
            </button>
          </div>
        </div>

        {/* Spreadsheet Table */}
        <div className="bg-[#FDFBF7] text-[#2D070D] rounded-2xl shadow-2xl overflow-hidden border-2 border-[#E6C79C]">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#3B0A11] text-[#E6C79C] text-sm sm:text-base border-b border-[#E6C79C]/40">
                  <th className="py-3.5 px-4 border-l border-[#E6C79C]/20 w-14 text-center">#</th>
                  <th className="py-3.5 px-4 border-l border-[#E6C79C]/20 w-44">التاريخ والوقت</th>
                  <th className="py-3.5 px-4 border-l border-[#E6C79C]/20 w-52">الاسم الكريم</th>
                  <th className="py-3.5 px-4 border-l border-[#E6C79C]/20">التهنئة / الكلمة</th>
                  <th className="py-3.5 px-4 w-24 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#63121E] font-bold">
                      جاري تحميل البيانات...
                    </td>
                  </tr>
                ) : wishes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#8A7968] font-bold text-base">
                      لا توجد تعليقات حالياً — أي تهنئة تُكتب في صفحة الدعوة ستظهر هنا فوراً كسطر جديد.
                    </td>
                  </tr>
                ) : (
                  wishes.map((w, idx) => (
                    <tr
                      key={w.id}
                      className="border-b border-[#E6C79C]/40 hover:bg-[#FAF3E8] transition-colors text-sm sm:text-base"
                    >
                      <td className="py-3 px-4 border-l border-[#E6C79C]/30 text-center font-mono font-bold text-[#63121E]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 border-l border-[#E6C79C]/30 text-xs sm:text-sm text-[#5A4F46] whitespace-nowrap">
                        {formatDate(w.created_at)}
                      </td>
                      <td className="py-3 px-4 border-l border-[#E6C79C]/30 font-bold text-[#3B0A11]">
                        {w.guest_name}
                      </td>
                      <td className="py-3 px-4 border-l border-[#E6C79C]/30 text-[#2D070D] leading-relaxed">
                        {w.message}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(w.id)}
                          className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-600 text-red-700 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optional Webhook Input */}
        <form
          onSubmit={handleSaveWebhook}
          className="mt-6 bg-[#2B060C]/80 border border-[#E6C79C]/25 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <span className="text-xs sm:text-sm text-[#F7E7CE]/80 shrink-0">
            رابط Google Apps Script (اختياري):
          </span>
          <input
            dir="ltr"
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="flex-1 rounded-xl bg-black/40 border border-[#E6C79C]/30 px-3 py-2 text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-[#E6C79C]"
          />
          <button
            type="submit"
            disabled={savingWebhook}
            className="px-5 py-2 rounded-xl bg-[#63121E] hover:bg-[#7A1828] border border-[#E6C79C]/50 text-[#FDFBF7] text-xs sm:text-sm font-bold cursor-pointer"
          >
            {savingWebhook ? 'جاري الحفظ...' : 'حفظ ومزامنة'}
          </button>
          {webhookSavedMsg && (
            <span className="text-xs text-[#E6C79C] font-bold">{webhookSavedMsg}</span>
          )}
        </form>
      </div>
    </main>
  );
}
