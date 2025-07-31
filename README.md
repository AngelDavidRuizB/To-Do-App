# ProductiviApp - Aplicación de Productividad Integral

Una aplicación completa de productividad desarrollada con React que combina gestión de tareas, timer Pomodoro, organización de notas y seguimiento de bienestar mental.

## 🚀 Características

### 📋 Gestión de Tareas
- **Tres categorías de estado**: "No Hechas", "En Progreso", "Hechas"
- **Prioridades**: Alta, Media, Baja
- **Organización por categorías** y fechas de vencimiento
- **Filtros avanzados** para encontrar tareas rápidamente
- **Interfaz intuitiva** con drag & drop visual

### ⏲️ Timer Pomodoro
- **Sesiones de trabajo personalizables** (25 min por defecto)
- **Descansos cortos y largos** configurables
- **Seguimiento de estadísticas** (sesiones completadas, tiempo total)
- **Notificaciones sonoras** al completar sesiones
- **Historial de productividad** diaria

### 📚 Gestión de Notas y Archivos
- **Organización por tema y materia**
- **Soporte para archivos** (PDF, imágenes, documentos)
- **Sistema de etiquetas** para categorización
- **Búsqueda avanzada** en contenido y metadatos
- **Vista de lista y cuadrícula**

### 🧠 Seguimiento de Bienestar Mental
- **Registro diario** de estado de ánimo, estrés y energía
- **Seguimiento de calidad del sueño**
- **Actividades de bienestar** registrables
- **Recomendaciones personalizadas** basadas en patrones
- **Gráficos y tendencias** de progreso

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **Vite** - Herramienta de build moderna
- **Lucide React** - Iconografía
- **CSS3** - Estilos personalizados y animaciones
- **LocalStorage** - Persistencia de datos local

## 📦 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd to-do-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🎯 Uso de la Aplicación

### Dashboard Principal
El dashboard ofrece una vista general de tu productividad con:
- Estadísticas de tareas completadas
- Tiempo de estudio acumulado
- Estado de bienestar actual
- Acciones rápidas para crear contenido

### Gestión de Tareas
1. **Crear nueva tarea**: Click en "Nueva Tarea"
2. **Organizar por estado**: Arrastra tareas entre columnas
3. **Filtrar**: Usa los filtros por estado, prioridad o categoría
4. **Editar**: Click en el ícono de edición en cualquier tarea

### Timer Pomodoro
1. **Configurar tiempos**: Accede a configuración para personalizar duraciones
2. **Iniciar sesión**: Click en play para comenzar
3. **Seguir progreso**: El círculo muestra el progreso visual
4. **Tomar descansos**: El timer cambia automáticamente entre trabajo y descanso

### Notas y Archivos
1. **Crear nota**: Selecciona entre texto o archivo
2. **Organizar**: Asigna tema y materia
3. **Etiquetar**: Usa etiquetas para categorización adicional
4. **Buscar**: Utiliza la barra de búsqueda para encontrar contenido

### Bienestar Mental
1. **Registro diario**: Completa tu estado diario
2. **Actividades**: Marca las actividades realizadas
3. **Revisar tendencias**: Observa patrones en el tiempo
4. **Seguir recomendaciones**: Aplica sugerencias personalizadas

## 🎨 Características de Diseño

- **Responsive Design**: Adaptable a móviles y escritorio
- **Interfaz Moderna**: Design system coherente con colores y tipografía
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Accesibilidad**: Navegación por teclado y lectores de pantalla
- **Tema Claro**: Diseño optimizado para uso prolongado

## 📊 Persistencia de Datos

Los datos se almacenan localmente en el navegador usando LocalStorage:
- `tasks`: Listado de tareas con estados y metadatos
- `pomodoroStats`: Estadísticas del timer Pomodoro
- `notes`: Notas y archivos organizados
- `healthData`: Registros de bienestar mental
- `pomodoroSettings`: Configuración personalizada del timer

## 🔧 Estructura del Proyecto

```
src/
├── components/
│   ├── Dashboard/          # Panel principal
│   ├── Layout/             # Navegación y layout
│   ├── TodoTasks/          # Gestión de tareas
│   ├── PomodoroTimer/      # Timer Pomodoro
│   ├── NotesManager/       # Gestión de notas
│   └── MentalHealthTracker/ # Seguimiento bienestar
├── App.jsx                 # Componente principal
├── App.css                 # Estilos globales
└── main.jsx               # Punto de entrada
```

## 🚧 Próximas Características

- [ ] Exportación de datos a PDF
- [ ] Sincronización en la nube
- [ ] Modo oscuro
- [ ] Recordatorios y notificaciones
- [ ] Análisis avanzado de productividad
- [ ] Integración con calendarios
- [ ] Modo colaborativo

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- React y Vite por las herramientas de desarrollo
- Lucide por los iconos
- La comunidad de código abierto por inspiración y recursos+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
