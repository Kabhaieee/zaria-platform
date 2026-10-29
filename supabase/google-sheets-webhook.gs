/**
 * ============================================================================
 * ZARIA PLATFORM — Google Sheets Real-Time Backup Script (Apps Script)
 * ============================================================================
 * طريقة الربط في أقل من دقيقة:
 * 1. افتح ملف Google Sheet جديد في حسابك.
 * 2. من القائمة العلوية اختر: الإضافات (Extensions) -> Apps Script.
 * 3. امسح أي كود موجود والصق هذا الكود بالكامل ثم اضغط حفظ (Save).
 * 4. اضغط على زر "نشر" (Deploy) -> "نشر جديد" (New deployment).
 * 5. اختر النوع: "تطبيق ويب" (Web app)، واجعل "من لديه حق الوصول" (Who has access): "أي شخص" (Anyone).
 * 6. انسخ الرابط الناتج (Web App URL) وضعه في متغير البيئة GOOGLE_SHEETS_WEBHOOK_URL في Vercel
 *    أو أرسله هنا ليتم تثبيته مباشرة داخل الكود.
 * ============================================================================
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents || '{}');
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (payload.action === 'append_rsvp') {
      var rsvpSheet = ss.getSheetByName('RSVPs') || ss.insertSheet('RSVPs');
      if (rsvpSheet.getLastRow() === 0) {
        rsvpSheet.appendRow(['التاريخ والوقت', 'المناسبة (Slug)', 'الاسم الكريم', 'الحضور', 'عدد الضيوف', 'المعرف (ID)', 'ISO Timestamp']);
      }
      rsvpSheet.appendRow([
        payload.readable_time || new Date().toLocaleString('ar-JO'),
        payload.slug || 'omar-ayat',
        payload.guest_name || '',
        payload.attending ? 'نعم' : 'لا',
        payload.guests_count || 1,
        payload.id || '',
        payload.created_at || new Date().toISOString()
      ]);
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Default: Wishes (التهاني ودفتر الذكريات)
    var wishSheet = ss.getSheetByName('Wishes') || ss.getActiveSheet();
    if (wishSheet.getLastRow() === 0) {
      wishSheet.appendRow(['التاريخ والوقت', 'المناسبة (Slug)', 'الاسم الكريم', 'التهنئة / الكلمة', 'المعرف (ID)', 'ISO Timestamp']);
    }

    wishSheet.appendRow([
      payload.readable_time || new Date().toLocaleString('ar-JO'),
      payload.slug || 'omar-ayat',
      payload.guest_name || '',
      payload.message || '',
      payload.id || '',
      payload.created_at || new Date().toISOString()
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var slugFilter = (e && e.parameter && e.parameter.slug) ? String(e.parameter.slug).trim() : '';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var wishSheet = ss.getSheetByName('Wishes') || ss.getActiveSheet();
    var lastRow = wishSheet.getLastRow();

    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ ok: true, wishes: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var values = wishSheet.getRange(2, 1, lastRow - 1, 6).getValues();
    var wishes = [];

    for (var i = values.length - 1; i >= 0; i--) {
      var row = values[i];
      var rowSlug = String(row[1] || '').trim();
      var guestName = String(row[2] || '').trim();
      var message = String(row[3] || '').trim();
      var id = String(row[4] || ('sheet-' + i)).trim();
      var createdAt = String(row[5] || row[0] || '').trim();

      if (!guestName || !message) continue;
      if (slugFilter && rowSlug !== slugFilter) continue;

      wishes.push({
        id: id,
        slug: rowSlug || slugFilter || 'omar-ayat',
        guest_name: guestName,
        message: message,
        created_at: createdAt
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, wishes: wishes }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, wishes: [], error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
