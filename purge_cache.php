<?php
/**
 * T&T Vina - Automated Server & CDN Cache Purge Endpoint
 */

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

echo json_encode([
    "success" => true,
    "timestamp" => time(),
    "opcache_reset" => $opcache_status,
    "message" => "Hostinger server cache & opcache successfully purged."
]);
