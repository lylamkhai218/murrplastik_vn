/**
 * form.js — Xử lý form báo giá → Google Sheet
 * Setup: Thay SCRIPT_URL bằng URL của Google Apps Script sau khi deploy
 */

// ⚠️ THAY URL NÀY SAU KHI DEPLOY GOOGLE APPS SCRIPT
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxAwd5RF_3MGpUXQjZdA7lWjnITLgiWV3G8yCwqNY5DmOSZes6QfbBpEZ-20lyQwwMu/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  if (!form) return;

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

    const payload = {
      name,
      phone,
      email: form.querySelector('#f-email').value.trim(),
      company: form.querySelector('#f-company').value.trim(),
      product: form.querySelector('#f-product').value,
      message: form.querySelector('#f-message').value.trim(),
      language: currentLang,
      source: window.location.href,
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        showMsg(msgEl, 'success', t('form.success'));
        form.reset();
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
  el.className = 'form-msg ' + type;
  el.textContent = msg;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => { el.style.display = 'none'; el.className = 'form-msg'; }, 8000);
}
