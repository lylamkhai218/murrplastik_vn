<?php
/**
 * T&T Vina - Automated Server & CDN Cache Purge Endpoint
 * Security: Requires secret authorization key to prevent unauthorized cache purging
 */

$secret_key = "TTVINA_PURGE_CACHE_SECURE_2026_KEY";
$auth_key = isset($_GET['key']) ? $_GET['key'] : (isset($_SERVER['HTTP_X_PURGE_KEY']) ? $_SERVER['HTTP_X_PURGE_KEY'] : '');

if ($auth_key !== $secret_key) {
    http_response_code(403);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        "success" => false,
        "error" => "Forbidden: Invalid or missing authorization key."
    ]);
    exit;
}

// 1. Send LiteSpeed & Hostinger CDN Purge Headers
header("X-LiteSpeed-Purge: *");
header("Cache-Control: private, no-cache, no-store, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

// 2. Reset PHP Opcache if active
$opcache_status = false;
if (function_exists('opcache_reset')) {
    $opcache_status = @opcache_reset();
}

// 3. Clear file stat cache
clearstatcache(true);

header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    "success" => true,
    "timestamp" => time(),
    "opcache_reset" => $opcache_status,
    "message" => "Hostinger server cache & opcache successfully purged."
]);
