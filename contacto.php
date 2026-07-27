<?php
// Configuración de encabezados para seguridad
header("Content-Type: text/plain; charset=UTF-8");

// Validar que la petición sea POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Sanitización y validación de los datos
    $nombre = strip_tags(trim($_POST["nombre"]));
    $telefono = strip_tags(trim($_POST["telefono"]));
    $correo = filter_var(trim($_POST["correo"]), FILTER_SANITIZE_EMAIL);
    
    // Si mandaron intereses, juntarlos separados por coma
    $intereses = "";
    if (isset($_POST["intereses"]) && is_array($_POST["intereses"])) {
        $intereses = implode(", ", $_POST["intereses"]);
    } else {
        $intereses = "Ninguno especificado";
    }

    // 2. Verificar que los campos requeridos no estén vacíos
    if (empty($nombre) || empty($telefono) || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Por favor, completa los campos obligatorios correctamente.";
        exit;
    }

    // 3. Configuración del Correo a enviar
    $destinatario = "enzocortesdoherty@gmail.com";
    $asunto = "Nuevo Contacto Web - Mirador Club: $nombre";

    // Cuerpo del correo
    $mensaje = "Has recibido un nuevo lead (contacto) desde la página de Mirador Club.

";
    $mensaje .= "------------------------------------------------------
";
    $mensaje .= "Nombre: $nombre
";
    $mensaje .= "Teléfono: $telefono
";
    $mensaje .= "Correo Electrónico: $correo
";
    $mensaje .= "Intereses seleccionados: $intereses
";
    $mensaje .= "------------------------------------------------------
";

    // Encabezados (Para que puedas contestarle directo dándole 'Responder')
    $headers = "From: $nombre <$correo>
";
    $headers .= "Reply-To: $correo
";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 4. Envío del Correo
    if (mail($destinatario, $asunto, $mensaje, $headers)) {
        http_response_code(200);
        echo "¡Gracias! Tu mensaje ha sido enviado exitosamente.";
    } else {
        http_response_code(500);
        echo "Lo sentimos, hubo un error técnico al enviar tu mensaje. Inténtalo más tarde.";
    }

} else {
    // Si alguien intenta entrar a contacto.php directamente por URL
    http_response_code(403);
    echo "Hubo un problema con tu envío, por favor intenta de nuevo.";
}
?>