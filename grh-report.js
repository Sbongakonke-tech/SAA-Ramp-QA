/* GRH Monthly Monitoring Checklist — PDF audit report
Needs jsPDF + jsPDF-AutoTable loaded before this file runs a report.
Exposes: window.exportSubmissionPDF(submissionRow, buttonElement) */
(function () {
const NAVY = [11, 31, 58];
const GOLD = [200, 155, 60];
const GOLD_DIM = [228, 197, 122];
const INK = [27, 36, 48];
const DIM = [91, 100, 114];
const LINE = [222, 218, 208];
const LIGHT = [246, 245, 241];
const OK = [47, 122, 79];
const BAD = [179, 64, 42];
const BAD_BG = [251, 237, 233];
const AMBER = [176, 122, 20];

const PAGE_W = 210, PAGE_H = 297, M = 14, TOP = 22;

function scoreColor(pct) { return pct >= 90 ? OK : pct >= 70 ? AMBER : BAD; }

function fmtDate(s) {
if (!s) return '-';
const p = String(s).slice(0, 10).split('-');
if (p.length !== 3) return String(s);
const dt = new Date(+p[0], +p[1] - 1, +p[2]);
return dt.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}

function tally(items) {
let c = 0, n = 0;
(items || []).forEach(i => {
if (i.compliance === 'compliant') c++;
else if (i.compliance === 'non_compliant') n++;
});
return { c, n, total: (items || []).length };
}

function pctOf(t) { return t.total ? Math.round((t.c / t.total) * 100) : 0; }

function getSections(d) {
if (Array.isArray(d.sections) && d.sections.length) return d.sections;
// older single-section rows
return [{ title: d.section_name || 'Checklist', ref: d.manual_ref || null, items: d.items || [], notes: d.notes || null }];
}

function label(doc, text, y) {
doc.setFillColor(...GOLD);
doc.rect(M, y - 3.2, 1.6, 4.4, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(...NAVY);
doc.text(text, M + 4, y);
}

function buildReport(d, logo) {
const { jsPDF } = window.jspdf;
const doc = new jsPDF({ unit: 'mm', format: 'a4' });
const sections = getSections(d);
const all = sections.flatMap(s => s.items || []);
const overall = tally(all);
const pct = pctOf(overall);
const auditDate = fmtDate(d.date_captured || d.created_at);
const station = d.station || '-';
const tableMargin = { top: TOP, left: M, right: M, bottom: 18 };

// ---- Header band ----
doc.setFillColor(...NAVY);
doc.rect(0, 0, PAGE_W, 34, 'F');
doc.setFillColor(...GOLD);
doc.rect(0, 34, PAGE_W, 1.2, 'F');

let textX = M;
if (logo) {
doc.setFillColor(255, 255, 255);
doc.roundedRect(M, 7, 20, 20, 2, 2, 'F');
doc.addImage(logo.data, 'PNG', M + 1.5 + (17 - logo.w) / 2, 8.5 + (17 - logo.h) / 2, logo.w, logo.h);
textX = M + 26;
}
doc.setFont('helvetica', 'bold');
doc.setFontSize(8.5);
doc.setTextColor(...GOLD_DIM);
doc.text('SOUTH AFRICAN AIRWAYS', textX, 13);
doc.setFontSize(17);
doc.setTextColor(255, 255, 255);
doc.text('GRH Monthly Monitoring Checklist', textX, 21);
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(210, 218, 230);
doc.text('Audit report | Operations | Version 2/26 | Effective 01 June 2026', textX, 28);

// ---- Audit details ----
doc.autoTable({
startY: 43,
margin: tableMargin,
theme: 'plain',
body: [
['Station', station, 'Date of audit', auditDate],
['Auditor', d.auditor_name || '-', 'Report generated', new Date().toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })],
],
styles: { fontSize: 9.5, textColor: INK, lineColor: LINE, lineWidth: 0.2, cellPadding: { top: 2.6, bottom: 2.6, left: 3, right: 3 } },
columnStyles: {
0: { fontStyle: 'bold', textColor: DIM, fillColor: LIGHT, cellWidth: 28 },
1: { cellWidth: 'auto' },
2: { fontStyle: 'bold', textColor: DIM, fillColor: LIGHT, cellWidth: 36 },
3: { cellWidth: 'auto' },
},
});

// ---- Overall result ----
let y = doc.lastAutoTable.finalY + 10;
label(doc, 'OVERALL RESULT', y);
y += 5;
doc.setFillColor(...LIGHT);
doc.setDrawColor(...LINE);
doc.rect(M, y, PAGE_W - 2 * M, 28, 'FD');
const col = scoreColor(pct);
doc.setFont('helvetica', 'bold');
doc.setFontSize(28);
doc.setTextColor(...col);
doc.text(pct + '%', M + 7, y + 16);
doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.setTextColor(...DIM);
doc.text('OVERALL COMPLIANCE', M + 7, y + 23);
doc.setDrawColor(...LINE);
doc.line(M + 52, y + 4, M + 52, y + 24);
const stats = [
['Compliant', overall.c, OK],
['Non-compliant', overall.n, overall.n ? BAD : DIM],
['Total measures', overall.total, INK],
];
stats.forEach((s, i) => {
const x = M + 60 + i * 40;
doc.setFont('helvetica', 'bold');
doc.setFontSize(19);
doc.setTextColor(...s[2]);
doc.text(String(s[1]), x, y + 15);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(...DIM);
doc.text(s[0], x, y + 22);
});

// ---- Section summary ----
y += 28 + 11;
label(doc, 'SECTION SUMMARY', y);
const pcts = sections.map(s => pctOf(tally(s.items)));
const summaryBody = sections.map(s => {
const t = tally(s.items);
return [s.title, s.ref || '-', String(t.c), String(t.n), pctOf(t) + '%'];
});
summaryBody.push(['Total', '', String(overall.c), String(overall.n), pct + '%']);
doc.autoTable({
startY: y + 3,
margin: tableMargin,
head: [['Section', 'Manual reference', 'Compliant', 'Non-compliant', 'Score']],
body: summaryBody,
theme: 'grid',
headStyles: { fillColor: NAVY, textColor: 255, fontSize: 8.5, halign: 'left' },
styles: { fontSize: 8.5, textColor: INK, lineColor: LINE, lineWidth: 0.2, cellPadding: 2.4 },
columnStyles: { 1: { cellWidth: 56 }, 2: { halign: 'center', cellWidth: 22 }, 3: { halign: 'center', cellWidth: 26 }, 4: { halign: 'center', cellWidth: 20 } },
didParseCell(h) {
if (h.section !== 'body') return;
if (h.row.index === sections.length) {
h.cell.styles.fontStyle = 'bold';
h.cell.styles.fillColor = LIGHT;
}
if (h.column.index === 4) {
const p = h.row.index === sections.length ? pct : pcts[h.row.index];
h.cell.styles.textColor = scoreColor(p);
h.cell.styles.fontStyle = 'bold';
}
if (h.column.index === 3 && Number(h.cell.raw) > 0) {
h.cell.styles.textColor = BAD;
h.cell.styles.fontStyle = 'bold';
}
},
});

// ---- Detailed findings ----
doc.addPage();
y = TOP;
label(doc, 'DETAILED FINDINGS', y);
y += 6;

sections.forEach((s, sIdx) => {
const t = tally(s.items);
if (y > 245) { doc.addPage(); y = TOP; }

doc.setFillColor(...NAVY);
doc.rect(M, y, PAGE_W - 2 * M, 11, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(255, 255, 255);
doc.text(s.title, M + 3, y + 5);
if (s.ref) {
doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.setTextColor(...GOLD_DIM);
doc.text('Ref: ' + s.ref, M + 3, y + 9);
}
doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(...GOLD_DIM);
doc.text(t.c + ' / ' + t.total + ' (' + pcts[sIdx] + '%)', PAGE_W - M - 3, y + 6.5, { align: 'right' });

const body = [];
const meta = [];
(s.items || []).forEach((it, i) => {
const res = it.compliance === 'compliant' ? 'Compliant' : it.compliance === 'non_compliant' ? 'Non-compliant' : 'Not answered';
body.push([String(i + 1), it.text, res]);
meta.push({ type: 'item', compliance: it.compliance });
if (it.compliance === 'non_compliant') {
body.push([{ content: 'Corrective action: ' + (it.correctiveAction || 'not recorded'), colSpan: 3 }]);
meta.push({ type: 'action' });
}
});

doc.autoTable({
startY: y + 11,
margin: tableMargin,
head: [['#', 'Measure', 'Result']],
body,
theme: 'grid',
headStyles: { fillColor: LIGHT, textColor: DIM, fontSize: 8, fontStyle: 'bold' },
styles: { fontSize: 9, textColor: INK, lineColor: LINE, lineWidth: 0.2, cellPadding: 2.6, valign: 'middle' },
columnStyles: { 0: { cellWidth: 9, halign: 'center', textColor: DIM }, 2: { cellWidth: 30, halign: 'center' } },
didParseCell(h) {
if (h.section !== 'body') return;
const m = meta[h.row.index];
if (m.type === 'action') {
h.cell.styles.fillColor = BAD_BG;
h.cell.styles.textColor = BAD;
h.cell.styles.fontStyle = 'italic';
h.cell.styles.fontSize = 8.5;
h.cell.styles.halign = 'left';
h.cell.styles.cellPadding = { top: 2.2, bottom: 2.2, left: 12, right: 3 };
} else if (h.column.index === 2) {
h.cell.styles.fontStyle = 'bold';
h.cell.styles.textColor = m.compliance === 'compliant' ? OK : m.compliance === 'non_compliant' ? BAD : DIM;
}
},
});
y = doc.lastAutoTable.finalY;

if (s.notes) {
doc.autoTable({
startY: y + 2,
margin: tableMargin,
theme: 'plain',
body: [[{ content: 'Notes: ' + s.notes }]],
styles: { fontSize: 8.5, textColor: DIM, fillColor: LIGHT, cellPadding: 3, lineColor: LINE, lineWidth: 0.2 },
});
y = doc.lastAutoTable.finalY;
}
y += 9;
});

// ---- Remarks ----
if (d.remarks) {
if (y > 240) { doc.addPage(); y = TOP; }
label(doc, 'ADDITIONAL REMARKS', y);
doc.autoTable({
startY: y + 3,
margin: tableMargin,
theme: 'plain',
body: [[d.remarks]],
styles: { fontSize: 9, textColor: INK, fillColor: LIGHT, cellPadding: 3.5, lineColor: LINE, lineWidth: 0.2 },
});
y = doc.lastAutoTable.finalY + 9;
}

// ---- Attachments ----
const atts = Array.isArray(d.attachments) ? d.attachments : [];
if (atts.length) {
if (y > 240) { doc.addPage(); y = TOP; }
label(doc, 'ATTACHMENTS', y);
doc.autoTable({
startY: y + 3,
margin: tableMargin,
head: [['File', 'Link']],
body: atts.map(a => [a.name || 'Attachment', 'Open file']),
theme: 'grid',
headStyles: { fillColor: LIGHT, textColor: DIM, fontSize: 8, fontStyle: 'bold' },
styles: { fontSize: 8.5, textColor: INK, lineColor: LINE, lineWidth: 0.2, cellPadding: 2.4 },
columnStyles: { 1: { cellWidth: 28, textColor: [20, 51, 92], fontStyle: 'bold' } },
didDrawCell(h) {
if (h.section === 'body' && h.column.index === 1 && atts[h.row.index] && atts[h.row.index].url) {
doc.link(h.cell.x, h.cell.y, h.cell.width, h.cell.height, { url: atts[h.row.index].url });
}
},
});
y = doc.lastAutoTable.finalY + 9;
}

// ---- Sign-off ----
if (y > 250) { doc.addPage(); y = TOP; }
y += 8;
doc.setDrawColor(...DIM);
doc.setLineWidth(0.3);
doc.line(M, y, M + 80, y);
doc.line(PAGE_W - M - 80, y, PAGE_W - M, y);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(...DIM);
doc.text('Auditor signature and date', M, y + 4.5);
doc.text('Manager review signature and date', PAGE_W - M - 80, y + 4.5);

// ---- Running header (pages 2+) and footer (all pages) ----
const n = doc.getNumberOfPages();
for (let i = 1; i <= n; i++) {
doc.setPage(i);
if (i > 1) {
doc.setFillColor(...NAVY);
doc.rect(0, 0, PAGE_W, 11, 'F');
doc.setFillColor(...GOLD);
doc.rect(0, 11, PAGE_W, 0.8, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(255, 255, 255);
doc.text('GRH Monthly Monitoring Checklist - Audit report', M, 7);
doc.setFont('helvetica', 'normal');
doc.setTextColor(...GOLD_DIM);
doc.text(station + ' | ' + auditDate, PAGE_W - M, 7, { align: 'right' });
}
doc.setDrawColor(...LINE);
doc.setLineWidth(0.2);
doc.line(M, PAGE_H - 12, PAGE_W - M, PAGE_H - 12);
doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.setTextColor(...DIM);
doc.text('South African Airways | GRH Monthly Monitoring Checklist | Internal use only', M, PAGE_H - 7);
doc.text('Page ' + i + ' of ' + n, PAGE_W - M, PAGE_H - 7, { align: 'right' });
}

return doc;
}

// Reads the logo already shown in the page header and converts it to PNG for the PDF
async function fetchLogo() {
try {
const img = document.querySelector('#logoSlot img');
if (!img || !img.src) return null;
const res = await fetch(img.src);
const blob = await res.blob();
const url = URL.createObjectURL(blob);
const dims = await new Promise(resolve => {
const im = new Image();
im.onload = () => resolve({ im, w: im.naturalWidth || 200, h: im.naturalHeight || 200 });
im.onerror = () => resolve(null);
im.src = url;
});
if (!dims) return null;
const cap = 600;
const k = Math.min(1, cap / Math.max(dims.w, dims.h));
const canvas = document.createElement('canvas');
canvas.width = Math.round(dims.w * k);
canvas.height = Math.round(dims.h * k);
canvas.getContext('2d').drawImage(dims.im, 0, 0, canvas.width, canvas.height);
URL.revokeObjectURL(url);
const box = 17;
const scale = Math.min(box / dims.w, box / dims.h);
return { data: canvas.toDataURL('image/png'), w: dims.w * scale, h: dims.h * scale };
} catch (e) {
return null;
}
}

function fileName(d) {
const clean = v => String(v || '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
const date = String(d.date_captured || d.created_at || '').slice(0, 10);
return 'GRH_Checklist_' + (clean(d.station) || 'Station') + '_' + (date || 'report') + '.pdf';
}

window.grhBuildReport = buildReport;

window.exportSubmissionPDF = async function (d, btn) {
const original = btn ? btn.textContent : '';
try {
if (!window.jspdf) throw new Error('PDF library did not load');
if (btn) { btn.disabled = true; btn.textContent = 'Preparing PDF...'; }
const logo = await fetchLogo();
const doc = buildReport(d, logo);
doc.save(fileName(d));
} catch (e) {
console.error(e);
alert('Could not create the PDF. Please try again.');
} finally {
if (btn) { btn.disabled = false; btn.textContent = original; }
}
};

if (typeof document !== 'undefined') {
const s = document.createElement('style');
s.textContent =
'.export-btn{margin-top:10px;background:none;border:1px solid var(--navy);color:var(--navy);' +
'font-size:12px;font-weight:600;font-family:inherit;padding:6px 12px;border-radius:3px;cursor:pointer}' +
'.export-btn:hover{background:var(--navy);color:#fff}' +
'.export-btn:disabled{opacity:.5;cursor:not-allowed}';
document.head.appendChild(s);
}
})();
