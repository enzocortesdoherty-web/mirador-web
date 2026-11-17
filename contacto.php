<?php
declare(strict_types=1);
// Mirador Club - formulario web. Requiere PHP 7.4+ y función mail() operativa.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $success, string $message): void {
    http_response_code($status);
    echo json_encode(['ok' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Método no permitido.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 12000) {
    respond(413, false, 'La solicitud excede el tamaño permitido.');
}
if (!empty($_POST['website'])) {
    // Campo invisible: respuesta positiva sin enviar correo para evitar reintentos del bot.
    respond(200, true, 'Solicitud recibida.');
}
function field(string $key, int $maximum): string {
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) respond(422, false, 'Datos inválidos.');
    $value = trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '');
    if (strlen($value) > $maximum) respond(422, false, 'Un campo es demasiado largo.');
    return $value;
}
$name = field('name', 180);
$email = field('email', 254);
$phone = field('phone', 50);
$interest = field('interest', 100);
$allowed = ['Membresías', 'Pádel y espacios activos', 'Fases del proyecto', 'Información general'];
if (strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !preg_match('/^[+0-9()\s.\-]{7,25}$/', $phone) || !in_array($interest, $allowed, true)) {
    respond(422, false, 'Revisa tu nombre, correo, teléfono e interés.');
}
// Evita confiar en el correo del visitante como remitente: mejora la entregabilidad.
$recipient = 'aaroncortes.ac9@gmail.com';
$host = strtolower((string)($_SERVER['SERVER_NAME'] ?? ''));
$host = preg_replace('/:\d+$/', '', $host);
if (!preg_match('/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/', $host)) {
    error_log('Mirador Club: configura un dominio válido en el hosting para el envío de correo.');
    respond(503, false, 'El envío aún no está configurado. Intenta más tarde.');
}
$sender = 'no-reply@' . preg_replace('/^www\./', '', $host);
$subject = 'Nuevo lead - Mirador Club';
$body = "Nuevo contacto desde Mirador Club\n\n"
      . "Nombre: {$name}\nCorreo: {$email}\nTeléfono: {$phone}\n"
      . "Interés: {$interest}\nFecha (UTC): " . gmdate('Y-m-d H:i:s') . "\n";
$headers = [
    'From' => 'Mirador Club <' . $sender . '>',
    'Reply-To' => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
    'MIME-Version' => '1.0',
    'X-Mailer' => 'MiradorClubContact/1.0'
];
try {
    $sent = mail($recipient, $subject, $body, $headers);
} catch (Throwable $error) {
    error_log('Mirador Club mail error: ' . $error->getMessage());
    $sent = false;
}
if (!$sent) {
    error_log('Mirador Club: mail() falló; revisar correo saliente del hosting.');
    respond(503, false, 'No fue posible enviar la solicitud. Intenta nuevamente más tarde.');
}
respond(200, true, 'Solicitud enviada correctamente.');
