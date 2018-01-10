Práctica 3 ADI - Cliente MiniWallfer en React Native
====================================================

**La aplicación ha sido desarrollada sólo para Android porque no tengo ni Mac ni iPhone ni iPad porque no iDinero**

### Instrucciones de instalación:
```bash
$ npm i # instalar dependencias
$ npm start # ejecutar servidor de desarrollo/bundler
$ npm run android # compilar e instalar APK en modo Debug en el dispositivo Android
```
### Características de la aplicación
* Se han implementado las vistas que aparecían en el enunciado de la práctica: Login, listado de ítems (en mi caso posts), y formulario de creación/edición del mismo. En comparación a la anterior práctica, ya no tengo detalles de un ítem, y los botones de editar y borrar aparecen directamente en el listado.
* En esta práctica, al igual que en la anterior, se accede directamente al API REST desplegado en Heroku por razones ya descritas previamente. Sin embargo, ahora el servidor tiene configurado el CORS.
* El login funciona de forma parecida a la de la anterior práctica: si te conectas, se guarda el JWT y tu ID de usuario en el AsyncStorage (análogo al LocalStorage de React Web). Puedes cerrar sesión y conectarte como otro usuario como en la anterior.
* Quería hacer un registro (tal y como hice en la anterior práctica) pero no me ha dado tiempo. Lo he apañado con un enlace a Swagger en donde te puedes registrar "a mano". De paso, he probado cómo se podía hacer que abriese un enlace al navegador.
* Se han usado las librerías [react-native-navigation](https://github.com/wix/react-native-navigation) y [react-natve-vector-icons](https://github.com/oblador/react-native-vector-icons) para probar cómo funcionan las libreras nativas.
* He intentado añadir redux a la aplicación pero he tenido problemas para hacer las acciones que incluían operaciones asíncronas (comunicación con el servidor) así que tuve que dejarlo.
* Los formularios tienen una validación básica y además los errores se controlan bastante mejor que en la anterior práctica.
