<?php
/**
 * T&T Vina Admin - Server-side Security Configuration
 * ECC AgentShield Standard
 */

// Set secure session parameters before starting session
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        ini_set('session.cookie_secure', 1);
    }
    ini_set('session.cookie_samesite', 'Strict');
    session_start();
}

return [
    'admin_user' => 'admin',
    // Secure Bcrypt hash for password 'admin@123' (cost=12)
    'admin_hash' => '$2y$12$Qi3043SrypQzfu1aJJqit.7vTB4ADBweiIT2KBGKRISuc/7js13Vu',
    'max_attempts' => 5,
    'lockout_time' => 900 // 15 minutes lockout on 5 consecutive failures
];
