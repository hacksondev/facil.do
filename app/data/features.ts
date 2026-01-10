/**
 * Datos de características para Facil.do
 * Usado en la página principal y páginas de detalle
 */

export interface FeatureDetail {
  id: string
  title: string
  shortDescription: string
  badge: string
  icon: string
  // Contenido detallado para página individual
  heroTitle: string
  heroDescription: string
  benefits: {
    title: string
    description: string
    icon: string
  }[]
  howItWorks: {
    step: number
    title: string
    description: string
  }[]
  stats: {
    value: string
    label: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
}

export const features: FeatureDetail[] = [
  {
    id: 'apertura',
    title: 'Apertura 100% digital',
    shortDescription: 'Abre tu cuenta empresarial en pesos o en dolar en minutos desde tu celular o computadora. Sin muchos papeleos, sin filas, sin citas.',
    badge: 'Sin filas',
    icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
    heroTitle: 'Abre tu cuenta empresarial en pesos o en dolar desde donde estés',
    heroDescription: 'Desde tu celular mientras atiendes el negocio, o desde tu computadora en casa. Todo el proceso es 100% online, sin necesidad de visitar ninguna sucursal ni hacer citas previas.',
    benefits: [
      {
        title: 'Hazlo desde cualquier dispositivo',
        description: 'Usa tu celular, tablet o computadora. Nuestra plataforma se adapta a cualquier pantalla para que completes el proceso donde prefieras.',
        icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
      },
      {
        title: 'Verificación con tu cámara',
        description: 'Solo necesitas la cámara de tu dispositivo para verificar tu identidad. Toma una foto de tu cédula y una selfie, nosotros validamos en segundos.',
        icon: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z',
      },
      {
        title: 'Documentos desde tu galería',
        description: 'Sube fotos de tu cédula y RNC directo desde tu galería o toma nuevas fotos. Sin escaneos, sin impresiones, sin notarizar.',
        icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
      },
      {
        title: 'Cuenta lista al instante',
        description: 'Una vez aprobado, recibes tu número de cuenta y acceso inmediato a la plataforma. Empieza a operar desde el mismo momento.',
        icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Entra a facil.do',
        description: 'Accede desde tu navegador en celular o computadora. Regístrate con tu email y número de teléfono.',
      },
      {
        step: 2,
        title: 'Verifica tu identidad',
        description: 'Usa la cámara de tu dispositivo para tomar foto de tu cédula y una selfie. El sistema valida todo automáticamente.',
      },
      {
        step: 3,
        title: 'Completa los datos de tu empresa',
        description: 'RNC, nombre comercial y tipo de negocio. Formulario simple que completas en menos de 2 minutos.',
      },
      {
        step: 4,
        title: '¡Listo para operar!',
        description: 'Recibe confirmación por email y SMS. Accede inmediatamente a tu dashboard y comienza a manejar tus finanzas.',
      },
    ],
    stats: [
      { value: '48 horas', label: 'Tiempo de apertura' },
      { value: '100%', label: 'Online' },
      { value: '24/7', label: 'Disponible siempre' },
    ],
    faqs: [
      {
        question: '¿Necesito ir a alguna oficina o sucursal?',
        answer: 'No, absolutamente todo se hace online. Desde tu celular o computadora puedes completar todo el proceso de apertura sin salir de tu negocio o casa.',
      },
      {
        question: '¿Qué documentos necesito tener a mano?',
        answer: 'Solo necesitas tu cédula de identidad vigente y el RNC de tu empresa. Los subes como fotos desde tu dispositivo.',
      },
      {
        question: '¿Puedo empezar en el celular y terminar en la computadora?',
        answer: 'Sí, tu progreso se guarda automáticamente. Puedes continuar desde cualquier dispositivo donde inicies sesión.',
      },
    ],
  },
  {
    id: 'control',
    title: 'Control de ingresos y gastos',
    shortDescription: 'Visualiza tu flujo de efectivo en tiempo real desde cualquier dispositivo. Categorización automática y alertas inteligentes.',
    badge: 'Tiempo real',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    heroTitle: 'Tu flujo de efectivo en la palma de tu mano',
    heroDescription: 'Revisa cuánto entra y sale de tu negocio en cualquier momento, desde tu celular mientras estás en el colmado o desde tu computadora en la oficina. Todo actualizado al instante.',
    benefits: [
      {
        title: 'Dashboard que se actualiza solo',
        description: 'Cada transacción aparece inmediatamente en tu pantalla. Sin esperar estados de cuenta ni descargar archivos.',
        icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5',
      },
      {
        title: 'El sistema aprende de ti',
        description: 'Nuestra IA categoriza tus gastos automáticamente. Entre más usas la plataforma, más precisa se vuelve.',
        icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z',
      },
      {
        title: 'Notificaciones donde las necesitas',
        description: 'Recibe alertas push en tu celular o notificaciones en tu navegador cuando hay movimientos importantes o gastos inusuales.',
        icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
      },
      {
        title: 'Busca lo que necesites al instante',
        description: 'Filtros potentes para encontrar cualquier transacción por fecha, monto, categoría o descripción. Todo desde la barra de búsqueda.',
        icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Inicia sesión en facil.do',
        description: 'Desde tu celular o computadora, accede a tu cuenta con email y contraseña o huella digital.',
      },
      {
        step: 2,
        title: 'Personaliza tus categorías',
        description: 'Usa las categorías que ya tenemos o crea las tuyas propias según cómo manejas tu negocio.',
      },
      {
        step: 3,
        title: 'Define tus límites',
        description: 'Establece presupuestos por categoría y el sistema te avisa cuando te acerques al límite.',
      },
      {
        step: 4,
        title: 'Revisa cuando quieras',
        description: 'Abre la app o el navegador y ve exactamente cómo está tu negocio en ese momento.',
      },
    ],
    stats: [
      { value: 'Instantáneo', label: 'Actualización' },
      { value: '95%', label: 'Precisión IA' },
      { value: 'Push', label: 'Notificaciones' },
    ],
    faqs: [
      {
        question: '¿Puedo ver mis finanzas desde el celular?',
        answer: 'Sí, la plataforma funciona perfectamente en celular, tablet y computadora. El dashboard se adapta a cualquier pantalla.',
      },
      {
        question: '¿Las transacciones aparecen inmediatamente?',
        answer: 'Sí, cada movimiento se refleja en tiempo real. No tienes que esperar días ni descargar estados de cuenta.',
      },
      {
        question: '¿Puedo recibir alertas en mi celular?',
        answer: 'Sí, recibes notificaciones push por cada transacción importante, gastos que exceden tus límites o actividad inusual.',
      },
    ],
  },
  {
    id: 'reportes',
    title: 'Reportes financieros claros',
    shortDescription: 'Genera reportes visuales en segundos desde cualquier dispositivo. Entiende tu negocio sin ser contador.',
    badge: 'Un clic',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    heroTitle: 'Reportes que entiendes sin ser contador',
    heroDescription: 'Gráficos claros y números que hacen sentido. Genera reportes desde tu celular mientras esperas en una reunión, o desde tu computadora para analizar con calma. Todo visual, todo simple.',
    benefits: [
      {
        title: 'Gráficos que hablan solos',
        description: 'Barras, líneas y pastel que te muestran de un vistazo cómo va tu negocio. Sin tablas confusas ni jerga contable.',
        icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
      },
      {
        title: 'Arma tu propio reporte',
        description: 'Elige qué datos ver, el período de tiempo y cómo quieres visualizarlo. Guarda tus reportes favoritos para acceder rápido.',
        icon: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75',
      },
      {
        title: 'Comparte con un toque',
        description: 'Envía reportes por WhatsApp, email o descarga en PDF/Excel. Perfecto para compartir con tu contador o socios.',
        icon: 'M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z',
      },
      {
        title: 'Compara mes a mes',
        description: 'Ve cómo ha evolucionado tu negocio. ¿Vendiste más este mes? ¿Gastaste menos? Los gráficos te lo muestran claro.',
        icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Abre la sección de reportes',
        description: 'Desde el menú principal en tu celular o computadora, entra a "Reportes".',
      },
      {
        step: 2,
        title: 'Selecciona qué quieres ver',
        description: 'Flujo de caja, gastos por categoría, ingresos mensuales... elige el reporte que necesitas.',
      },
      {
        step: 3,
        title: 'Ajusta el período',
        description: 'Esta semana, este mes, último trimestre o el rango de fechas que prefieras.',
      },
      {
        step: 4,
        title: 'Visualiza o comparte',
        description: 'Ve el reporte en pantalla o expórtalo con un toque para compartir por WhatsApp o email.',
      },
    ],
    stats: [
      { value: '10+', label: 'Tipos de reportes' },
      { value: '1 toque', label: 'Para exportar' },
      { value: 'PDF/Excel', label: 'Formatos' },
    ],
    faqs: [
      {
        question: '¿Puedo generar reportes desde mi celular?',
        answer: 'Sí, todos los reportes se pueden generar y ver perfectamente desde el celular. La interfaz está optimizada para pantallas pequeñas.',
      },
      {
        question: '¿Puedo enviar reportes por WhatsApp?',
        answer: 'Sí, puedes exportar cualquier reporte como PDF y compartirlo directamente por WhatsApp, email o cualquier otra app.',
      },
      {
        question: '¿Mi contador puede acceder a los reportes?',
        answer: 'Sí, puedes darle acceso de solo lectura a tu contador para que entre a la plataforma y descargue los reportes que necesite.',
      },
    ],
  },
  {
    id: 'fiscal',
    title: 'Listo para la DGII',
    shortDescription: 'Genera los formatos de la DGII automáticamente desde tu celular o computadora. Cumple sin complicaciones.',
    badge: 'DGII ready',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    heroTitle: 'Cumple con la DGII sin dolores de cabeza',
    heroDescription: 'Los formatos 606, 607 y 608 se generan automáticamente desde tus transacciones. Solo entra a la plataforma desde tu celular o computadora, descarga el archivo y súbelo a la DGII. Así de fácil.',
    benefits: [
      {
        title: 'Formatos listos para subir',
        description: 'El sistema genera automáticamente los archivos en el formato exacto que pide la DGII. Solo descarga y sube, sin editar nada.',
        icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z',
      },
      {
        title: 'NCF organizados',
        description: 'Todos tus Números de Comprobante Fiscal ordenados y accesibles. Busca cualquier NCF en segundos desde tu dispositivo.',
        icon: 'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776',
      },
      {
        title: 'Te avisamos antes de cada fecha',
        description: 'Recibe notificaciones en tu celular días antes de cada vencimiento fiscal. Nunca más te agarran fuera de base.',
        icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
      },
      {
        title: 'Historial completo siempre disponible',
        description: 'Accede a declaraciones pasadas cuando las necesites. Todo guardado en la nube y disponible desde cualquier dispositivo.',
        icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Registra tu info fiscal una vez',
        description: 'Ingresa tu RNC y configura tus obligaciones tributarias desde la web o app. Solo lo haces una vez.',
      },
      {
        step: 2,
        title: 'Opera normalmente',
        description: 'Cada transacción que registras se categoriza automáticamente para efectos fiscales (ITBIS, ISR, etc.).',
      },
      {
        step: 3,
        title: 'Genera los formatos con un toque',
        description: 'Cuando llegue el momento, entra a "Fiscal", selecciona el período y descarga los archivos 606, 607, 608.',
      },
      {
        step: 4,
        title: 'Sube a la DGII y listo',
        description: 'Los archivos están listos para subir directamente al portal de la DGII. Sin conversiones ni ajustes.',
      },
    ],
    stats: [
      { value: '606/607/608', label: 'Formatos' },
      { value: 'Automático', label: 'Generación' },
      { value: 'Push', label: 'Recordatorios' },
    ],
    faqs: [
      {
        question: '¿Puedo generar los formatos desde mi celular?',
        answer: 'Sí, puedes generar y descargar los formatos 606, 607 y 608 directamente desde tu celular. Los archivos quedan listos para subir a la DGII.',
      },
      {
        question: '¿El sistema está actualizado con las normativas vigentes?',
        answer: 'Sí, mantenemos los formatos actualizados según las últimas disposiciones de la DGII. Cuando hay cambios, actualizamos automáticamente.',
      },
      {
        question: '¿Me avisan cuando se acerca una fecha límite?',
        answer: 'Sí, recibes notificaciones push en tu celular y por email varios días antes de cada vencimiento fiscal.',
      },
    ],
  },
]

export function getFeatureById(id: string): FeatureDetail | undefined {
  return features.find((f) => f.id === id)
}

export function getAllFeatureIds(): string[] {
  return features.map((f) => f.id)
}
