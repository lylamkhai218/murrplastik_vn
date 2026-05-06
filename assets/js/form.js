/**
 * form.js — Xử lý form báo giá → Google Sheet
 * Setup: Thay SCRIPT_URL bằng URL của Google Apps Script sau khi deploy
 */

// ⚠️ THAY URL NÀY SAU KHI DEPLOY GOOGLE APPS SCRIPT
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxz21AeAE3MYOh06Dsor3IUjYUWNwEQSCAOVojFyRMtrTuGuOxZftK9yuiJOR3FelVb/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  // File upload feedback
  const fileInput = form.querySelector('#f-file');
  const fileHint = form.querySelector('.file-hint');
  if (fileInput && fileHint) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        fileHint.textContent = (currentLang === 'vi' ? '✅ Đã chọn: ' : '✅ Selected: ') + fileName;
        fileHint.classList.add('file-success');
      } else {
        fileHint.textContent = t('form.file.hint');
        fileHint.classList.remove('file-success');
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const msgEl = form.querySelector('.form-msg');

    // Validate required fields
    const name = form.querySelector('#f-name').value.trim();
    const phone = form.querySelector('#f-phone').value.trim();
    if (!name || !phone) {
      showMsg(msgEl, 'error', currentLang === 'vi'
        ? '⚠️ Vui lòng điền Họ tên và Số điện thoại.'
        : '⚠️ Please fill in Name and Phone Number.');
      return;
    }

    // Loading state
    btn.disabled = true;
    btn.setAttribute('data-i18n', 'form.sending');
    btn.textContent = t('form.sending');

    // Collect selected products
    const selectedProducts = Array.from(form.querySelectorAll('input[name="product"]:checked'))
      .map(el => {
        const textSpan = el.parentElement.querySelector('span[data-i18n]');
        return textSpan ? textSpan.textContent.trim() : el.value;
      })
      .join(', ');

    const fileInput = form.querySelector('#f-file');
    let fileBase64 = '';
    let fileName = '';

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.size > 10 * 1024 * 1024) {
        showMsg(msgEl, 'error', currentLang === 'vi' ? '❌ File quá lớn (Max 10MB)' : '❌ File too large (Max 10MB)');
        btn.disabled = false;
        btn.textContent = t('form.submit');
        return;
      }
      fileName = file.name;
      fileBase64 = await toBase64(file);
      console.log('File detected:', fileName, 'Size:', file.size, 'Base64 length:', fileBase64.length);
    }

    const payload = {
      name,
      phone,
      email: form.querySelector('#f-email').value.trim(),
      company: form.querySelector('#f-company').value.trim(),
      product: selectedProducts || '(không chọn)',
      message: form.querySelector('#f-message').value.trim(),
      fileData: fileBase64,
      fileName: fileName,
      language: currentLang,
      source: window.location.href,
      timestamp: new Date().toISOString()
    };

    console.log('Sending Payload:', payload);

    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('GAS Response:', data);
      if (data.status === 'success') {
        showMsg(msgEl, 'success', t('form.success'));
        form.reset();
        const fileHint = form.querySelector('.file-hint');
        if (fileHint) {
          fileHint.textContent = t('form.file.hint');
          fileHint.classList.remove('file-success');
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Form error:', err);
      showMsg(msgEl, 'error', t('form.error'));
    } finally {
      btn.disabled = false;
      btn.setAttribute('data-i18n', 'form.submit');
      btn.textContent = t('form.submit');
    }
  });
});

function showMsg(el, type, msg) {
  el.style.display = 'block';
  el.className = 'form-msg ' + type;
  el.textContent = msg;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => {
    el.style.display = 'none';
    el.className = 'form-msg';
  }, 8000);
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});
