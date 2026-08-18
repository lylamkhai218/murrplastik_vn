<?php
/**
 * T&T Vina Admin - Server-side Authentication Endpoint
 * ECC AgentShield Standard (REST API)
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

$config = require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';
$clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Session Rate Limiter tracking
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['last_attempt_time'] = 0;
}

// 1. Action: Check current authentication status
if ($action === 'check') {
    $isAuth = !empty($_SESSION['admin_auth']) && $_SESSION['admin_auth'] === true;
    echo json_encode([
        'authenticated' => $isAuth,
        'user' => $isAuth ? ($_SESSION['admin_user'] ?? 'admin') : null
    ]);
    exit;
}

// 2. Action: Logout
if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']
        );
    }
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
    exit;
}

// 3. Action: Login
if ($action === 'login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
        exit;
    }

    // Check brute-force lockout
    $timeSinceLast = time() - $_SESSION['last_attempt_time'];
    if ($_SESSION['login_attempts'] >= $config['max_attempts'] && $timeSinceLast < $config['lockout_time']) {
        $remaining = $config['lockout_time'] - $timeSinceLast;
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => "Bạn đã đăng nhập sai quá {$config['max_attempts']} lần. Vui lòng thử lại sau " . ceil($remaining / 60) . " phút."
        ]);
        exit;
    }

    // Reset attempt counter if lockout expired
    if ($timeSinceLast >= $config['lockout_time']) {
        $_SESSION['login_attempts'] = 0;
    }

    // Parse input
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    if (!is_array($data)) {
        $data = $_POST;
    }

    $username = trim($data['username'] ?? '');
    $password = (string)($data['password'] ?? '');

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.']);
        exit;
    }

    // Validate credentials server-side using constant-time comparison & bcrypt
    $userValid = hash_equals($config['admin_user'], $username);
    $passValid = password_verify($password, $config['admin_hash']);

    if ($userValid && $passValid) {
        // Success: Reset brute-force counter & regenerate session ID (prevents Session Fixation)
        session_regenerate_id(true);
        $_SESSION['admin_auth'] = true;
        $_SESSION['admin_user'] = $username;
        $_SESSION['auth_time'] = time();
        $_SESSION['login_attempts'] = 0;

        echo json_encode([
            'success' => true,
            'message' => 'Đăng nhập thành công!',
            'redirect' => 'dashboard.php'
        ]);
        exit;
    } else {
        // Failed attempt: increment counter
        $_SESSION['login_attempts']++;
        $_SESSION['last_attempt_time'] = time();
        
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Tên đăng nhập hoặc mật khẩu không chính xác.'
        ]);
        exit;
    }
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Invalid action.']);
