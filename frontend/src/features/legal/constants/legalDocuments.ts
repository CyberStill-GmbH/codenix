import type { LegalDocument } from '@/features/legal/types/legal.types'

const contactEmail = 'ieeecsuni@gmail.com'

export const privacyPolicy: LegalDocument = {
  eyebrow: 'Política de Privacidad',
  title: 'Política de Privacidad de Codenix',
  updatedAt: '12 de agosto de 2026',
  intro:
    'Esta Política de Privacidad explica cómo Codenix recopila, utiliza, protege y comparte información cuando utilizas la plataforma, incluyendo cuando inicias sesión mediante Google OAuth.',
  sections: [
    {
      title: 'Información que recopilamos',
      bullets: [
        'Información de la cuenta, como nombre, dirección de correo electrónico, nombre de usuario e imagen de perfil, cuando sea proporcionada por un proveedor de autenticación.',
        'Identificadores de autenticación de Google o GitHub OAuth para vincular tu cuenta de forma segura.',
        'Actividad dentro de la plataforma, como problemas resueltos, envíos de código, metadatos de ejecución y preferencias necesarias para operar Codenix.',
        'Información técnica, como dirección IP, metadatos del navegador, registros y eventos de seguridad utilizados para proteger el servicio.',
      ],
    },
    {
      title: 'Google OAuth y permisos de Gmail',
      paragraphs: [
        'Codenix utiliza Google OAuth únicamente para autenticar a los usuarios y crear o acceder a su cuenta de Codenix. Solicitamos la información mínima del perfil necesaria para iniciar sesión, como el identificador de tu cuenta de Google, dirección de correo electrónico, nombre y avatar cuando estén disponibles.',
        'Codenix no solicita acceso a mensajes de Gmail, contactos de Gmail, archivos de Google Drive, calendarios ni a ningún otro contenido de Google. No leemos, enviamos, modificamos ni eliminamos correos electrónicos de tu cuenta de Gmail.',
      ],
    },
    {
      title: 'Cómo utilizamos la información',
      bullets: [
        'Crear y mantener tu cuenta.',
        'Autenticarte y mantener segura tu sesión.',
        'Mostrar tu progreso de práctica de programación, envíos y perfil.',
        'Prevenir abusos, depurar errores, limitar solicitudes y mejorar la confiabilidad de la plataforma.',
        'Cumplir con obligaciones legales, de seguridad y operativas.',
      ],
    },
    {
      title: 'Compartición y divulgación',
      paragraphs: [
        'No vendemos información personal. Podemos compartir información limitada con proveedores de infraestructura, proveedores de autenticación o procesadores de servicios únicamente cuando sea necesario para operar Codenix. También podemos divulgar información cuando sea requerido por ley o cuando sea necesario para proteger a los usuarios, la plataforma o la comunidad.',
      ],
    },
    {
      title: 'Conservación de datos',
      paragraphs: [
        'Conservamos la información de la cuenta y de actividad durante el tiempo necesario para proporcionar el servicio, mantener la seguridad, resolver disputas y preservar tu historial de práctica de programación. Puedes solicitar la eliminación de tu cuenta contactándonos.',
      ],
    },
    {
      title: 'Seguridad',
      paragraphs: [
        'Utilizamos medidas técnicas y organizativas razonables para proteger la información de las cuentas. Ningún servicio de Internet puede garantizar una seguridad perfecta, pero Codenix está diseñado para limitar el acceso a los datos personales y proteger los procesos de autenticación.',
      ],
    },
    {
      title: 'Tus opciones',
      bullets: [
        'Puedes optar por no utilizar Google OAuth y registrarte mediante correo electrónico y contraseña cuando esta opción esté disponible.',
        'Puedes revocar el acceso de Codenix desde la configuración de seguridad de tu cuenta de Google.',
        'Puedes solicitar acceso, corrección o eliminación de la información asociada a tu cuenta.',
      ],
    },
    {
      title: 'Contacto',
      paragraphs: [
        `Para consultas sobre privacidad o solicitudes relacionadas con tu cuenta, puedes contactarnos en ${contactEmail}.`,
      ],
    },
  ],
}

export const termsOfService: LegalDocument = {
  eyebrow: 'Términos de Servicio',
  title: 'Términos de Servicio de Codenix',
  updatedAt: '12 de agosto de 2026',
  intro:
    'Estos Términos de Servicio establecen las reglas para utilizar Codenix, una plataforma de práctica de programación orientada al aprendizaje, resolución de problemas y preparación para programación competitiva.',
  sections: [
    {
      title: 'Uso de la plataforma',
      paragraphs: [
        'Puedes utilizar Codenix para crear una cuenta, resolver problemas de programación, enviar código, consultar tu progreso y participar en las actividades de aprendizaje proporcionadas por la plataforma.',
      ],
    },
    {
      title: 'Responsabilidad sobre la cuenta',
      bullets: [
        'Eres responsable de mantener seguras las credenciales de tu cuenta.',
        'Debes proporcionar información precisa y mantener seguro el acceso a tu correo electrónico o proveedor de OAuth.',
        'No debes utilizar la cuenta de otra persona sin su autorización.',
      ],
    },
    {
      title: 'Uso aceptable',
      bullets: [
        'No debes atacar, sobrecargar, realizar scraping, aplicar ingeniería inversa ni abusar de la plataforma.',
        'No debes enviar código malicioso diseñado para escapar de los entornos aislados, acceder a secretos o interrumpir el servicio.',
        'No debes subir contenido ilegal, dañino o que infrinja derechos de terceros.',
        'No debes utilizar Codenix para acosar a otras personas ni interferir con la comunidad de aprendizaje.',
      ],
    },
    {
      title: 'Envíos de código y contenido',
      paragraphs: [
        'Conservas la propiedad de los códigos y contenidos que envías, pero otorgas a Codenix permiso para procesarlos, almacenarlos, mostrarlos y evaluarlos cuando sea necesario para proporcionar el servicio. El contenido público o compartido de los problemas puede ser visible para otros usuarios dependiendo de las funcionalidades disponibles en la plataforma.',
      ],
    },
    {
      title: 'Inicio de sesión mediante OAuth',
      paragraphs: [
        'Si inicias sesión mediante Google u otro proveedor de OAuth, autorizas a Codenix a utilizar la información proporcionada por dicho proveedor para la autenticación y administración de tu cuenta. El uso de ese proveedor también está sujeto a sus propios términos y políticas.',
      ],
    },
    {
      title: 'Disponibilidad del servicio',
      paragraphs: [
        'Codenix puede modificar, suspender o descontinuar determinadas funcionalidades a medida que evoluciona la plataforma. Buscamos mantener el servicio disponible y confiable, pero no garantizamos una disponibilidad ininterrumpida.',
      ],
    },
    {
      title: 'Exención de responsabilidad',
      paragraphs: [
        'Codenix se proporciona como una plataforma educativa y de práctica. En la máxima medida permitida por la legislación aplicable, el servicio se proporciona sin garantías de ningún tipo.',
      ],
    },
    {
      title: 'Contacto',
      paragraphs: [
        `Para consultas relacionadas con estos términos, puedes contactarnos en ${contactEmail}.`,
      ],
    },
  ],
}