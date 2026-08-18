<?php
require_once __DIR__ . '/config.php';
if (!empty($_SESSION['admin_auth']) && $_SESSION['admin_auth'] === true) {
    header('Location: dashboard.php');
    exit;
}
?><!DOCTYPE html><html lang="vi"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin Login — T&T Vina</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="../assets/images/logo_murrplastik_vn.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Barlow',sans-serif;background:#111;min-height:100vh;display:flex;align-items:center;justify-content:center;background-image:linear-gradient(rgba(200,16,46,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(200,16,46,0.05) 1px,transparent 1px);background-size:48px 48px}
.box{background:#1a1a1a;border:1px solid rgba(255,255,255,0.08);padding:3rem 2.5rem;width:100%;max-width:400px}
.logo{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;color:#fff;letter-spacing:1px;margin-bottom:4px}
.logo span{color:#C8102E}
.sub{color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid rgba(255,255,255,0.06)}
label{display:block;color:rgba(255,255,255,0.45);font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;margin-top:1rem}
input{width:100%;background:#111;border:1px solid rgba(255,255,255,0.1);color:#fff;padding:12px 14px;font-family:'Barlow',sans-serif;font-size:14px;outline:none;transition:border-color 0.2s}
input:focus{border-color:#C8102E}
.btn{width:100%;background:#C8102E;color:#fff;padding:13px;font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;margin-top:1.5rem;transition:background 0.2s}
.btn:hover{background:#a50d25}
.btn:disabled{background:#555;cursor:not-allowed}
.err{background:rgba(200,16,46,0.12);border:1px solid rgba(200,16,46,0.3);color:#ff6b6b;padding:10px;font-size:13px;margin-top:10px;display:none;line-height:1.4}
a{display:block;text-align:center;margin-top:1.5rem;color:rgba(255,255,255,0.3);font-size:12px;text-decoration:none}
a:hover{color:rgba(255,255,255,0.7)}
</style></head><body>
<div class="box">
<div class="logo">T&T <span>VINA</span></div>
<div class="sub">Admin Panel · Đại lý Murrplastik</div>
<form id="loginForm">
<label for="u">Tên đăng nhập</label>
<input id="u" type="text" placeholder="admin" required autocomplete="username">
<label for="p">Mật khẩu</label>
<input id="p" type="password" placeholder="••••••••" required autocomplete="current-password">
<div class="err" id="errBox"></div>
<button type="submit" class="btn" id="btnSubmit">Đăng nhập →</button>
</form>
<a href="../">← Về trang chủ</a>
</div>
<script>
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const u = document.getElementById('u').value.trim();
  const p = document.getElementById('p').value;
  const errBox = document.getElementById('errBox');
  const btn = document.getElementById('btnSubmit');

  errBox.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Đang xác thực...';

  try {
    const res = await fetch('auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    const data = await res.json();

    if (res.ok && data.success) {
      // Clear legacy localStorage flags
      localStorage.removeItem('mp_admin');
      window.location.href = data.redirect || 'dashboard.php';
    } else {
      errBox.textContent = data.message || 'Sai tên đăng nhập hoặc mật khẩu.';
      errBox.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Đăng nhập →';
    }
  } catch (err) {
    errBox.textContent = 'Không thể kết nối đến máy chủ xác thực.';
    errBox.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Đăng nhập →';
  }
});
</script>
</body></html>
