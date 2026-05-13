/**
 * form.js — Xử lý form báo giá → Google Sheet
 * Setup: Thay SCRIPT_URL bằng URL của Google Apps Script sau khi deploy
 */

// ⚠️ THAY URL NÀY SAU KHI DEPLOY GOOGLE APPS SCRIPT
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxz21AeAE3MYOh06Dsor3IUjYUWNwEQSCAOVojFyRMtrTuGuOxZftK9yuiJOR3FelVb/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const nameInput = form.querySelector('#f-name');
  const phoneInput = form.querySelector('#f-phone');
  const emailInput = form.querySelector('#f-email');
  const msgEl = form.querySelector('.form-msg');

  // Real-time validation
  const validators = {
    name: (val) => val.trim().length > 0 ? '' : (currentLang === 'vi' ? 'Họ tên không được để trống' : 'Name is required'),
    phone: (val) => {
      const clean = val.replace(/\s/g, '');
      if (!clean) return (currentLang === 'vi' ? 'Số điện thoại không được để trống' : 'Phone is required');
      const phoneRegex = /^(0|84)(3|5|7|8|9)([0-9]{8})$/;
      return phoneRegex.test(clean) ? '' : (currentLang === 'vi' ? 'Số điện thoại không hợp lệ (10 số)' : 'Invalid phone number');
    },
    email: (val) => {
      if (!val.trim()) return '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val.trim()) ? '' : (currentLang === 'vi' ? 'Email không hợp lệ' : 'Invalid email');
    }
  };

  const showFieldError = (input, error) => {
    let errorEl = input.parentElement.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = error;
    input.classList.toggle('invalid', !!error);
  };

  [nameInput, phoneInput, emailInput].forEach(input => {
    const field = input.id.replace('f-', '');
    const validate = () => showFieldError(input, validators[field](input.value));
    
    input.addEventListener('input', validate);
    input.addEventListener('blur', validate);
  });

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

    // Final validation
    const nameErr = validators.name(nameInput.value);
    const phoneErr = validators.phone(phoneInput.value);
    const emailErr = validators.email(emailInput.value);

    showFieldError(nameInput, nameErr);
    showFieldError(phoneInput, phoneErr);
    showFieldError(emailInput, emailErr);

    if (nameErr || phoneErr || emailErr) {
      const firstErr = [nameErr, phoneErr, emailErr].find(e => e);
      showMsg(msgEl, 'error', firstErr);
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

    let fileBase64 = '';
    let fileName = '';

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.size > 10 * 1024 * 1024) {
        showMsg(msgEl, 'error', currentLang === 'vi' ? '❌ File quá lớn (Max 10MB)' : '❌ File too large (Max 10MB)');
        btn.disabled = false;
        btn.setAttribute('data-i18n', 'form.submit');
        btn.textContent = t('form.submit');
        return;
      }
      fileName = file.name;
      fileBase64 = await toBase64(file);
    }

    const payload = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      company: form.querySelector('#f-company').value.trim(),
      product: selectedProducts || '(không chọn)',
      message: form.querySelector('#f-message').value.trim(),
      fileData: fileBase64,
      fileName: fileName,
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
        showSuccessPopup();
        form.reset();
        [nameInput, phoneInput, emailInput].forEach(i => i.classList.remove('invalid'));
        form.querySelectorAll('.field-error').forEach(e => e.textContent = '');
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

function showSuccessPopup() {
  const popup = document.getElementById('successPopup');
  if (popup) {
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeSuccessPopup() {
  const popup = document.getElementById('successPopup');
  if (popup) {
    popup.classList.remove('open');
    document.body.style.overflow = '';
  }
}

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
