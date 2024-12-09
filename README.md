# Mauricio Alejandro Serrano García
# N.C: 20460545
# MoneyWise Cliente
El presente repositorio muestra el front-end para el proyecto de especialidad MoneyWise, desarrollado con React Native.

## Descripción General
Este repositorio contiene el código fuente del **front-end de MoneyWise**, una aplicación móvil desarrollada en **React Native** para ayudar a los usuarios a gestionar sus finanzas personales. Este módulo maneja la interfaz de usuario, la navegación entre pantallas, y la comunicación con el backend para operaciones como el registro de transacciones, metas de ahorro, y visualización de gráficos financieros.

## Propósito del Proyecto
El cliente de **MoneyWise** tiene como objetivo:
- Proveer una experiencia de usuario intuitiva y atractiva.
- Facilitar la interacción con las funcionalidades principales del sistema, como el registro de transacciones y metas financieras.
- Comunicarse de forma eficiente con el backend para sincronizar datos en tiempo real.


## Tabla de contenido
- [Descripción General](#descripción-general)
- [Propósito del Proyecto](#propósito-del-proyecto)
- [Requisitos de Instalación](#requisitos-de-instalación)
- [Instrucciones para la Instalación](#instrucciones-para-la-instalación)
- [Dependencias](#dependencias)
- [Enlaces Externos](#enlaces-externos)

## Requisitos de instalación

Debes asegurarte de tener instalado y configurado el entorno de desarrollo para React Native antes de comenzar.

- **[Node.js](https://nodejs.org/)** (Versión 16.0 o superior)
- **[React Native CLI](https://reactnative.dev/docs/environment-setup)**
- **[Android Studio](https://developer.android.com/studio)** (Incluyendo la configuración del emulador)
- **[Docker](https://www.docker.com/)** (Para ejecutar el backend de forma local)
- Además, asegúrate de que el backend de MoneyWise esté configurado y corriendo correctamente. Consulta el repositorio [MoneyWiseBack](https://github.com/MauricioASG/MoneyWiseBack.git) para más detalles.

## Instrucciones para la instalación

1. Clonar el repositorio en la máquina local:
   
   ```sh
   git clone https://github.com/MauricioASG/MoneyWiseClient.git
   ```

   2. Navegar al directorio del proyecto:
   
   ```sh
   cd MoneyWiseClient
   ```

   3. instalar las dependencias del proyecto:
   
   ```sh
   npm install
   ```

   4. Ejecutar el backend:
Asegúrate de tener el [Backend](https://github.com/MauricioASG/MoneyWiseBack.git) corriendo para poder probar la aplicación. Sigue las instrucciones en el repositorio del backend para iniciar el backend.

   5. En una nueva terminal, ejecutar la aplicación en el emulador de Android:
   ```sh
   npm run android
   ```
       > **IMPORTANTE**
    >
    > Asegúrate de tener configurado correctamente tu emulador de Android antes de ejecutar este comando.
    > En mi caso use un modelo llamado Pixel 8 pro Api 34
    
   6. La aplicación debería abrirse en tu emulador. Si todo está configurado correctamente, deberías ver la aplicación MoneyWise corriendo.

## Dependencias
El proyecto utiliza las siguientes dependencias clave:
- React Native: Framework para desarrollo móvil.
- react-navigation: Para la navegación entre pantallas.
- axios: Para las solicitudes HTTP al backend.
- redux (opcional): Gestión del estado global (si se utiliza).
- Consulta el archivo [package.json](https://github.com/MauricioASG/MoneyWaiseClient/blob/main/package.json) para una lista completa de dependencias.

## Enlaces externos

- [React Native](https://reactnative.dev) - Aprende más sobre React Native.
- [Node.js](https://nodejs.org) - Aprende más sobre Node.js.
- [Docker](https://www.docker.com) - Aprende más sobre Docker.
- [Android Studio](https://developer.android.com/studio) - Herramienta oficial para desarrollo en Android.
