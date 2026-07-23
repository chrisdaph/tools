function escapeHtmlForDoc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function downloadAsTxt(text, filenameBase) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  a.download = filenameBase + '.txt';
  a.click();
}

function downloadAsMd(text, filenameBase) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/markdown' }));
  a.download = filenameBase + '.md';
  a.click();
}

function downloadAsDoc(text, filenameBase) {
  const body = text.split('\n').map(line => `<p style="margin:0 0 8px;font-family:Calibri,Arial,sans-serif;">${escapeHtmlForDoc(line) || '&nbsp;'}</p>`).join('');
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Oneliest Tools</title></head><body>${body}</body></html>`;
  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filenameBase + '.doc';
  a.click();
}

function downloadAsPdf(text, filenameBase) {
  if (!window.jspdf) { alert('PDF export could not load. Check your connection and try again.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  const lineHeight = 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text || ' ', maxWidth);
  let y = margin;
  lines.forEach(line => {
    if (y > pageHeight - margin) { doc.addPage(); y = margin; }
    doc.text(line, margin, y);
    y += lineHeight;
  });
  doc.save(filenameBase + '.pdf');
}

function downloadAs(format, text, filenameBase) {
  if (format === 'pdf') downloadAsPdf(text, filenameBase);
  else if (format === 'doc') downloadAsDoc(text, filenameBase);
  else if (format === 'md') downloadAsMd(text, filenameBase);
  else downloadAsTxt(text, filenameBase);
}

function initDownloadDropdown(dropdownId, menuId, getText, filenameBase) {
  const dropdown = document.getElementById(dropdownId);
  const menu = document.getElementById(menuId);
  const trigger = dropdown.querySelector('.btn-ghost');

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    dropdown.classList.toggle('open', isOpen);
  });

  document.addEventListener('click', () => {
    menu.classList.remove('open');
    dropdown.classList.remove('open');
  });

  menu.querySelectorAll('.download-option').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.remove('open');
      dropdown.classList.remove('open');
      downloadAs(btn.dataset.format, getText(), filenameBase);
    });
  });
}
