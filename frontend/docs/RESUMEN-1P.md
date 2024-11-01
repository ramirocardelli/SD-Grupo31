# Apunte para Sistemas Distribuidos correspondiente a los temas de práctica del primer parcial.
**Martin Ignacio Casas**  
**v1.0.0**

## Índice
1. [JavaScript](#javascript)
2. [API REST en Node.js](#api-rest-en-node)
3. [Frontend en Node.js](#frontend-en-node)
4. [Anexo 1: Git y GitHub](#anexo-1-git-y-github)
5. [Anexo 2: Axios](#anexo-2-axios)

---

## JavaScript

### Introducción
JavaScript es uno de los lenguajes más utilizados en el desarrollo web. Es conocido por su capacidad de manipular dinámicamente el contenido de las páginas web, interactuar con APIs externas y manejar eventos de usuario (aquellos que generan los usuarios cuando interactuan con apps). Originalmente creado para ejecutarse en el navegador, hoy en día JavaScript también es utilizado en el backend gracias a plataformas como Node.js.

Su versatilidad y amplio ecosistema lo han convertido en el lenguaje por excelencia para el desarrollo de aplicaciones web modernas, tanto en el frontend como en el backend. Comparado con otros lenguajes como Java, JavaScript es más dinámico y flexible, permitiendo a los desarrolladores escribir código rápido y eficiente para aplicaciones web interactivas.

### ECMAScript
ECMAScript (ES) es el estándar que define el lenguaje JavaScript. Las versiones de JavaScript se refieren a menudo a las versiones de ECMAScript, como ES6 (ECMAScript 2015), que introdujo mejoras significativas, como las clases, promesas, y las funciones arrow. Desde entonces, el estándar ha seguido evolucionando, añadiendo características como módulos (ESM), async/await y nuevas formas de trabajar con objetos y arreglos.

Cambios significativos en ES6+:
- Clases: Añadieron una sintaxis más estructurada para definir objetos y herencia, similar a Java.
- Promesas: Facilitaron el manejo de operaciones asincrónicas de una manera más clara y legible.
- let/const: Nuevas formas de declarar variables con un mejor control de su alcance (scope).

### Usos Comunes
JavaScript es ampliamente utilizado para:

- **Frontend (Navegador)**: Manipulación del DOM, creación de interfaces de usuario interactivas (React, Vue.js).
- **Backend (Node.js)**: Servidores web, aplicaciones de tiempo real (Express, Nest.js).
- **Desarrollo Fullstack**: Aplicaciones que utilizan JavaScript tanto en el frontend como en el backend (MEAN/MERN stack).
- **Scripting**: Automización de tareas mediante scripts.

### Node.js
Node.js es un entorno de ejecución para JavaScript en el servidor. Permite a los desarrolladores crear aplicaciones del lado del servidor utilizando JavaScript, lo que abre la puerta al desarrollo fullstack utilizando un solo lenguaje.

Ventajas de Node.js:
- **No bloqueante (non-blocking I/O)**: Puede manejar múltiples solicitudes simultáneamente de manera eficiente.
- **Uso de un solo lenguaje**: Tanto frontend como backend en JavaScript.
- **NPM (Node Package Manager)**: El administrador de paquetes más grande del mundo, con acceso a miles de librerías.

### Tipos de Datos
JavaScript es un lenguaje dinámico, lo que significa que el tipo de dato de una variable se determina en tiempo de ejecución. Los tipos básicos incluyen:

- Primitivos: Number, String, Boolean, Undefined, Null, Symbol.
- Objetos: En JavaScript, todo lo demás es un objeto. Arrays y funciones también son objetos.
Ejemplo de uso de tipos primitivos y objetos:

```js
let num = 42;           // Number
let str = "Hola";       // String
let bool = true;        // Boolean
let arr = [1, 2, 3];    // Array (objeto)
let obj = { nombre: "Juan", edad: 30 }; // Objeto
```
### Variables var, let y const
En JavaScript, existen tres formas de declarar variables: var, let y const, cada una con su propio ámbito y casos de uso:

- var: tiene ámbito de función y ha estado disponible desde las primeras versiones de JavaScript.
- let: tiene ámbito de bloque y fue introducido en ES6, ofreciendo un mecanismo de ámbito más predecible.
- const: también tiene ámbito de bloque y se utiliza para declarar constantes que no pueden ser reasignadas después de su inicialización.

Buenas prácticas
Se recomienda usar let y const en lugar de var al escribir código JavaScript para evitar problemas inesperados con los ámbitos y crear un código más predecible y fácil de mantener.

- Usa let si necesitas reasignar el valor de una variable.
- Usa const si deseas declarar constantes que no cambien después de su inicialización.

### Funciones y Objetos
En JavaScript, las funciones pueden ser asignadas a variables, pasadas como argumentos, o devueltas por otras funciones. Los objetos, por su parte, son estructuras clave que permiten agrupar propiedades y métodos.

```js
let persona = {
    nombre: 'Ana',
    saludar: function() {
        console.log(`Hola, soy ${this.nombre}`);
    }
};

persona.saludar();  // Hola, soy Ana
```

### Clases
Introducidas en ES6, las clases en JavaScript proporcionan una sintaxis más limpia y estructurada para trabajar con objetos y herencia. A diferencia de Java, JavaScript utiliza un modelo de herencia basado en prototipos.

```javascript
class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    saludar() {
        console.log(`Hola, soy ${this.nombre} y tengo ${this.edad} años.`);
    }
}

let juan = new Persona('Juan', 25);
juan.saludar();  // Hola, soy Juan y tengo 25 años.
```

### Propiedades del Lenguaje (Scope, Chains y Closures)
En JavaScript, nos referimos a Scope como al alcance de una variable que es accesible en el codigo.

**Alcance Lexico:**
Es el tipo de alcance mas comun en JavaScript. Es determinado durante la fase de escritura de codigo, no durante la ejecucion. En este tipo de alcance, el acceso a las variables esta determinado por su ubicacion en el codigo. Utilizar el alcance lexico permite reducir problemas causados por la utilizacion de variables globales.

Ejemplo:
```javascript
function outer() {
  var outerVariable = "Hello";

  function inner() {
    var innerVariable = "World";
    console.log(outerVariable + " " + innerVariable);
  }

  inner();
}

outer(); output: Hello World
```

En el ejemplo de arriba, la funcion "inner" puede acceder a la variable "outerVariable" que esta definida en "outer". Esto es por esta en su "alcance lexico".

Ventajas del alcance lexico:
- Mayor legilibilidad: hace que el codigo sea mas legible dejando claro que variables estan definidas y cual es su alcance (tambien evitando conflictos de nombrado). Esto permite que el codigo sea mas facil de leer, en contraposicion a si abundaran las variables globales.
- Mayor mantenibilidad (encapsulacion): hace que el codigo sea mas mantenible haciendo que se puedan cambiar variable sin afectar otras partes del codigo. Es decir, el cambio de una variable acotada a un scope, no afecta otros scopes.
- Estado global reducido: el estado global es informacion que puede ser accedida en cualquier parte del codigo. Es necesario a veces, pero se puede reducir a una minima expresion limitando el alcance de las variables, y limitando tambien la modificacion de ese estado global a ciertas partes del codigo para que sea mas mantenible.

**Scope Chain:**
La scope chain es un mecanismo en JavaScript para encontrar variables. Consiste en los objetos de variables del ámbito actual y de todos los ámbitos padres. Al acceder a una variable, el motor de JavaScript primero buscará en el objeto de variables del ámbito actual. Si no la encuentra, seguirá buscando en la cadena de ámbitos hasta encontrar la variable o alcanzar el ámbito global.

```lua
   |
   +-- Contexto de Ejecución de Función 1
   |      |
   |      +-- Contexto de Ejecución de Función 2
   |             |
   |             +-- Contexto de Ejecución de Función 3
   |
   +-- Contexto de Ejecución de Función 4
```

Escenarios de Aplicación de la Scope Chain
La scope chain tiene varios escenarios de aplicación en JavaScript, entre los cuales se incluyen:

- Búsqueda de variables: La scope chain determina el orden en el que se buscan las variables, permitiendo que JavaScript acceda correctamente a las variables. Por ejemplo, si una función declara una variable con el mismo nombre que una variable global, se usará la variable local de la función.
- Closures (cierres): Un closure es una función que puede acceder a las variables del ámbito en el que fue creada, incluso después de que dicho ámbito haya finalizado. Esto es posible porque los closures capturan la cadena de ámbitos del contexto en el que se crearon. Se utilizan en funciones de callback, controladores de eventos, y módulos.
- Desarrollo modular: La scope chain permite implementar organización modular encapsulando variables y funciones en ámbitos privados. Esto significa que solo se puede acceder a esas variables y funciones dentro del ámbito en el que fueron declaradas, mejorando la legibilidad, mantenibilidad y modularidad del código.

Ejemplo de Closure:

```javascript
function createCounter() {
  var count = 0;

  return function() {
    count++;
    console.log(count);
  };
}

var counter = createCounter();
counter(); // Salida: 1
counter(); // Salida: 2
```

En el ejemplo anterior, la función createCounter() devuelve una función interna que tiene acceso a la variable count de la función externa. Incluso después de que createCounter() haya terminado de ejecutarse, la función interna sigue pudiendo acceder y modificar la variable count. Esta es la característica fundamental de los closures.

Escenarios de Aplicación de los Closures
- Variables privadas: Los closures proporcionan un mecanismo para implementar variables privadas, es decir, variables que solo pueden ser accedidas por las funciones en las que fueron declaradas. Esto mejora la encapsulación y la seguridad del código.
- Desarrollo modular: Los closures se utilizan para crear código modular, dividiendo el código en unidades autocontenidas que se pueden reutilizar y mantener de forma independiente. Esto facilita la lectura, mantenibilidad y escalabilidad del código.
- Ejecución diferida: Los closures permiten diferir la ejecución de funciones, lo que es útil para implementar operaciones asíncronas y procesamiento de eventos.

### Event Loop
Un ejemplo popular de Engine de Javascript es el Engine V8 de Google. Es utilizado dentro de Chrome y en Node.js. Un grafico que resume sus componentes es:

![V8 Engine Components](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OnH_DlbNAPvB9KLxUCyMsA.png)

Consiste de dos componentes principales:
- Heap de Memoria: donde se realiza la alocacion de memoria.
- Call Stack: donde el runtime mantiene un track de las llamadas a las funciones

El proceso que realiza el call stack es simple, cuando se está a punto de ejecutar una función, esta es añadida al stack. Si la función llama a su vez, a otra función, es agregada sobre la anterior. Si en algún momento de la ejecución hay un error, este se imprimirá en la consola con un mensaje y el estado del call stack al momento en que ocurrió.

Javascript es un lenguaje single threaded. Esto quiere decir que durante la ejecución de un script existe un solo thread que ejecuta el código. Por lo tanto solo se cuenta con un call stack.

Ejemplo:

```js
function multiply (x, y) {    
  return x * y; 
} 

function printSquare (x) {    
  var s = multiply(x, x);    
  console.log(s); 
} 

printSquare(5);
```

Los estados del call stack serían:

![Call stack status](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*18iNeFsZ2pOq533_-YPGYA.png)

Si se tuviera una función de esta manera:

```js
function foo() {    
  foo(); 
} 

foo();
```

![Call stack overflow](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SsUMEKtyEcfyj67N6cWhzQ.png)

Lo que sucedería es que en algún momento la cantidad de funciones llamadas excede el tamaño del stack, por lo que el navegador mostrará este error:

![Range error: call stack overflow](https://miro.medium.com/v2/resize:fit:772/format:webp/1*8moBF2yE8d8DitZHuXjceQ.png)

Pero qué pasa si llamamos a un timeout o hacemos un request con AJAX a un servidor. Al ser un solo thread, hay un solo call stack y por lo tanto solo se puede ejecutar una cosa a la vez. Es decir el navegador debería congelarse, no podría hacer más nada, no podría renderizar, hasta que la llamada termine de ejecutarse. Sin embargo esto no es asi, JavaScript es asincrónico y no bloqueante. Esto es gracias al Event Loop.

Event Loop
Algo interesante acerca de JavaScript, o mejor dicho de los runtimes de JavaScript, es que no cuentan nativamente con cosas como setTimeout, DOM, o HTTP request. Estas son llamadas web apis, que el mismo navegador provee, pero no están dentro del runtime JS.

Por lo tanto este es el gráfico que muestra una visión más abarcativa de JavaScript. En este se puede ver el runtime, más las Web APIs y el Callback Queue.

![Javascript runtimes components](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*s8PDSxizAIpw4B6Tdtd_Rg.png)

Al haber un solo thread es importante no escribir codigo bloqueante para la UI no quede bloqueada.

Pero ¿Cómo hacemos para escribir código no bloqueante?

La solución son callbacks asincronicas. Para esto combinamos el uso de callbacks (funciones que pasamos como parámetros a otras funciones ) con las WEB API’s.

```js
console.log("Hello");

setTimeout(function timeoutCallback() {

console.log("World");

}, 500);

console.log("Martin");

/* 
 * Resultados:
 * => Hello
 * => Martin
 * => World
 */
```

Como pueden ver la ejecución no se queda bloqueada en setTimeout() ya que imprime la instrucción que le sigue primero) ¿Pero entonces cómo es que posible que esto sea así si solo existe un solo thread? ¿ Cómo es que la ejecución continua y al mismo tiempo el setTimeout hace la cuenta regresiva para ejecutar la función pasada como callback?

Esto es porque, como mencione anteriormente, el setTimeout NO es parte del runtime. Sino que es provista por el navegador como WEB APIs ( o en el caso de Node por c++ apis). Los cuales SI se ejecutan en un thread distinto.

¿Como se maneja esto con una única call stack?

Existe otra estructura donde se guardan las funciones que deben ser ejecutadas luego de cierto evento (timeout, click, mouse move), en el caso del código de ejemplo de arriba se guarda que, cuando el timeout termine se debe ejecutar la función timeoutCallback(). Tener en cuenta que cuando sucede el evento, esta estructura no es la que la ejecuta y tampoco las agrega al call stack ya que sino podría pasar que la función se ejecutará en medio de otro código. Lo que hace es enviarla a la Callback Queue.

Lo que hace el event loop es fijarse el call stack, y si está vacío (es decir no hay nada ejecutandose) envía la primera función que esté en la callback queue al call stack y comienza a ejecutarse.

Luego de terminar la cuenta regresiva del setTimeout() (que no es ejecutada en el runtime de javascript), timeoutCallback() será enviada a la callback queue. El event loop chequeara el Call Stack, si este está vacío enviará timeoutCallback() al call stack para su ejecución.

![Javascript event loop example](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7TBEc7ozzrMZmVgvI3s0mQ.gif)

De esta manera se logra que el código sea no bloqueante, en vez de un setTimeout podría ser una llamada a un servidor, en donde habría que esperar que se procese nuestra solicitud y nos envíe una respuesta, el cual sería tiempo ocioso si no contáramos con callbacks asincronicas, de modo que el runtime pueda seguir con otro código. Una vez que la respuesta haya llegado del servidor y Call Stack esté vacío, se podrá procesar la respuesta (mediante la función pasada como callback ) y hacer algo con ella, por ejemplo mostrarla al usuario.

### Manejo de Paquetes con npm

npm responde a las siglas de Node Package Manager o manejador de paquetes de node, es la herramienta por defecto de JavaScript para la tarea de compartir e instalar paquetes.

Tal como reza su documentación, npm se compone de al menos dos partes principales.

- Un repositorio online para publicar paquetes de software libre para ser utilizados en proyectos Node.js
- Una herramienta para la terminal (command line utility) para interactuar con dicho repositorio que te ayuda a la instalación de utilidades, manejo de dependencias y la publicación de paquetes.

Es decir, en tu proyecto basado en Node — que actualmente incluye los proyectos de aplicaciones web que utilizan Node para su proceso de compilación y generación de archivos — utilizarás la utilidad de linea de comandos (cli) para consumir paquetes desde el repositorio online, un listado gigantesco de soluciones de software para distintos problemas disponibles públicamente en npmjs.com y para manejar dependencias, y para ello necesitas un archivo de configuración que le diga a npm que este es un proyecto node.

package.json
Este archivo indica a npm que el directorio en el que se encuentra es en efecto un proyecto o paquete npm. Este archivo contiene la información del paquete incluyendo la descripción del mismo, versión, autor y más importante aún dependencias.

Este archivo es generado automáticamente mediante la ejecución de un script de npm: 
```bash 
npm init 
``` 
este script es ejecutado para inicializar un proyecto JavaScript, al ejecutarlo la linea de comandos hará algunas preguntas para crear el paquete, como nombre, version, autor, licencia, etc.

Algunos campos son:

- version: Corresponde a la versión de tu proyecto. Lo ideal es mantener este campo actualizado cuando modificas algo en tu proyecto.
- description: Una breve descripción de tu proyecto. Particularmente importante si lo que estás creando es un paquete que publicarás vía npm.
- entry point: Define cuál será el punto de "entrada" de tu proyecto. Esto es, que archivo se ejecutará cuando se importe tu proyecto dentro de otro. Nuevamente, especialmente importante para paquetes de librerías.
- test command: Aquí puedes definir el comando que quieres ejecutar para realizar las pruebas de tu proyecto, este comando se ejecutará cuando escribas npm run test en tu terminal.
- git repository: Define la url del repositorio git en donde este proyecto está alojado, se utiliza para informar a los usuarios de tu paquete el repositorio en donde encontrar el código fuente del proyecto.
- author: El nombre e email de quien creó este proyecto.
- license: Identifica el tipo de licencia de uso de tu proyecto. Permite a las personas saber que y que no está permitido al usar tu código. 
- private: Es un valor boolean que te permite evitar que tu paquete se publique en el repositorio. Si lo que estás creando es un proyecto personal este valor será true.

npm scripts
Una importante sección de este archivo es scripts. Esta sección define un listado de propiedades que permiten ejecutar comandos dentro del contexto de tu proyecto incluyendo: comandos de otros paquetes listados como dependencias, scripts personalizados, scripts bash, etc.

Por defecto se crea un script para ejecutar el comando de test que, si no agregaste nada personalizado en el proceso de inicialización sólo tendrá una llamada al comando echo, es decir, ****al ejecutar en la terminal npm run test verás en la consola Error: no test specified

Un ejemplo de producción de esta sección es:

```json
{
		...
		...
    "scripts": {
        "start": "npm run generate && PORT=5000 react-scripts start",
        "build": "react-scripts build",
        "storybook": "start-storybook -p 6006 -h localhost",
        "build-storybook": "build-storybook -s public",
        "test": "jest",
        "test:watch": "jest --watch --silent",
        "cypress": "cypress run",
        "eject": "react-scripts eject",
        "lint": "eslint src/**/*.{js,ts,tsx} --fix",
        "prettier": "npx prettier --write '**/*.tsx'",
        "generate": "graphql-codegen --config codegen.yml"
    },
    ...
		...
}
```

En este ejemplo podemos ver una lista de 11 scripts que cumplen diferentes tareas tales como:

start: Primero ejecuta el script generate y luego inicia la aplicación web. react-scripts es una dependencia del paquete y se encuentra disponible dentro del directorio node_modules.
build: Ejecuta la compilación de la aplicación en modo producción.
lint: Ejecuta el proceso de linting (revisión de formato y estilo de código) del proyecto
test: Ejecuta el script de pruebas basado en el paquete jest que también está instalado como dependencia.
prettier: Ejecuta prettier mediante el uso de npx. Este es un paquete especial de npm que permite ejecutar binarios dentro del alcance de tu proyecto sin necesidad de especificar dicho comando como script dentro del archivo package.json.

Dependencias y dependencias de desarrollo
La siguiente sección muy relevante dentro del archivo es el listado de dependencias y el listado de dependencias de desarrollo

```json
{
   
    "dependencies": {
        "react": "^17.0.1",
        "react-dom": "^17.0.1",
        "react-hook-form": "6.14.1",
        "react-i18next": "11.8.5",
        "react-query": "^3.5.12",
        "react-router-dom": "5.2.0",
        "react-scripts": "4.0.1",
        "react-table": "^7.6.3",
        "react-virtual": "2.3.2",
        "yup": "0.32.8"
    },
		...
		...
    "devDependencies": {
        "@emotion/jest": "11.1.0",
        "@graphql-codegen/add": "2.0.2",
        "@graphql-codegen/cli": "1.20.1",
        "@graphql-codegen/introspection": "1.18.1",
        "@graphql-codegen/typescript": "1.20.2",
        "@graphql-codegen/typescript-graphql-request": "3.0.1",
        "@graphql-codegen/typescript-operations": "1.17.14",
        "@types/jest": "^26.0.20",
        "@types/node": "^12.0.0",
        "@types/react": "^16.9.53",
        "@types/react-dom": "^16.9.8",
        "@types/react-router-dom": "^5.1.7",
        "cypress": "^6.2.1",
        "eslint": "^7.17.0",
        "eslint-config-prettier": "^7.1.0",
        "eslint-plugin-prettier": "^3.3.1",
        "starwars-names": "1.6.0",
        "stylelint": "13.8.0",
        "stylelint-config-prettier": "8.0.2",
        "stylelint-prettier": "1.1.2",
        "ts-jest": "^26.4.4"
    }
}
```

Estas secciones, definen que paquetes disponibles en el repositorio de npm son requeridos por tu proyecto indicando también la versión necesaria. La versión mostrada aquí está en formato semver y corresponde al campo version mencionado antes.

Estas dependencias son instaladas al ejecutar 
```bash
npm install <pkg> --save 
```
y en el caso de las dependencias de desarrollo utilizando 
```bash
npm install <pkg> --save-dev
```

La diferencia de estos listados es que dependencies está destinado a ser utilizando en producción y devDependencies define paquetes que son necesarios sólo durante el desarrollo de tu proyecto.

Es importante conocer cómo se definen las versiones a utilizar en estas dependencias. Cada una de ellas muestra un número basado en semver en la forma mayor.minor.patch.

- mayor: Representa una versión mayor que genera cambios en la API del producto.
- minor: Representa un valor que aumenta cuando se hacen cambios retro-compatibles.
- patch: Un valor que aumenta cada vez que se hacen reparaciones de errores o mejoras sutiles.

También es posible encontrar algunos símbolos frente a la numeración de la versión, estos son:
- ^: latest minor release. Por ejemplo ^1.0.4 indica que 1.0.4 es la versión más "baja" que se puede instalar pero permite que se instale cualquier versión superior a esa pero que se encuentre dentro de la versión 1.
- ~: latest patch release. Esta es la forma contraria a  ^. Esta especificación  ~1.0.4 puede instalar la versión 1.0.7 si es que esta es la ultima version del patch.
Una vez instalados los paquetes de tus dependencias la información de las versiones instaladas queda almacenada en un archivo llamado package-lock.json

package-lock.json
Este archivo es auto generado por npm install y es una lista descriptiva y exacta de las versiones instaladas durante tu proceso. No esta destinado a ser leído ni manipulado por los desarrolladores, si no, para ser un insumo del proceso de manejo de dependencias.

¿Cómo trabajar con npm?
Lo más usual que harás con npm es la instalación de dependencias, esto se hace mediante 
```bash
npm install
```
para instalar todas las dependencias listadas en el archivo package.json o utilizando 
```bash
npm install <pkg>
```
para instalar algún paquete en particular.

ESM vs CJS

**¿Qué es CommonJS (CJS)?**
CommonJS es un sistema de módulos introducido alrededor de 2009, cuando JavaScript aún no tenía un sistema oficial de módulos. Fue popularizado por Node.js, permitiendo cargar módulos de forma síncrona (es decir, bloquea la ejecución hasta que el módulo se carga completamente).

Ejemplo de CJS:

```javascript
// module-name.js
module.exports = {
  data: 42,
  method: () => console.log("Hello from CJS")
};

// index.js
const module = require("./module-name.js");
module.method();
```

Uso principal:
- Entornos de Node.js.
- Aplicaciones que necesitan transpiladores o empaquetadores como Webpack para funcionar en navegadores.
Adecuado para proyectos legacy o antiguos que no han migrado a ESM.

**¿Qué es ES Modules (ESM)?**
ESM es el sistema de módulos nativo introducido con ES6 en 2015, permitiendo tanto importaciones síncronas como asíncronas. Es compatible con navegadores modernos. ESM mejora la organización del código y permite la eliminación de código no usado (tree-shaking).

Ejemplo de ESM:
```javascript
// module.js
export const data = 42;
export const method = () => console.log("Hello from ESM");

// index.js
import { data, method } from "./module.js";
method();
```

Uso principal:
- Navegadores (sin necesidad de herramientas adicionales).
- Proyectos modernos en Node.js.
- Permite importar directamente desde URLs o CDNs.

### Promesas

Las promesas en JavaScript resuelven los desafíos que surgen debido a su naturaleza de un solo hilo, especialmente al gestionar operaciones asíncronas. En este artículo, aprenderemos desde los fundamentos hasta su uso avanzado.

Entendiendo JavaScript Asíncrono
La programación asíncrona en JavaScript permite que el código siga ejecutándose sin esperar a que una tarea termine. Esto mejora la velocidad, pero añade complejidad.
Antes de la actualización ES6, se usaban callbacks, lo que podía generar una estructura compleja conocida como Callback Hell o "pirámide del desastre", dificultando la legibilidad y el mantenimiento del código.

Ejemplo de Callback Hell:

```javascript
getArticles(20, (user) => {
  console.log("Fetch articles", user);
  getUserData(user.username, (name) => {
    console.log(name);
    getAddress(name, (item) => {
      console.log(item);
    });
  });
});
```

**Fundamentos de las Promesas**
Las promesas se introdujeron en ES6 (2015) para manejar operaciones asíncronas de manera más eficiente. Una promesa permite gestionar datos que estarán disponibles en el futuro, sin bloquear el flujo de ejecución.

Una promesa puede tener tres estados:

Pending (Pendiente): Operación en curso.
Fulfilled (Cumplida): La operación se completó exitosamente.
Rejected (Rechazada): La operación falló.
Métodos clave:

.then(): Define acciones para cuando la promesa se cumple.
.catch(): Maneja los errores si la promesa es rechazada.

Ejemplo:

```javascript
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const randomNumber = Math.random();
    randomNumber < 0.5 
      ? resolve("Datos recuperados con éxito.") 
      : reject("Error al recuperar datos.");
  }, 1000);
});

myPromise
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

**Encadenamiento de Promesas**
El encadenamiento permite ejecutar tareas asíncronas en secuencia, donde el resultado de una operación se pasa a la siguiente. Cada llamada a .then() devuelve una nueva promesa.

Ejemplo:

```javascript
fetchData()
  .then(data => otherFetchData(data))
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

Solo se necesita un .catch() para capturar cualquier error en la cadena.

**Métodos Avanzados: Promise.all() y Promise.race()**

**Promise.all()**
Permite ejecutar múltiples promesas en paralelo y espera a que todas se cumplan. Si alguna falla, toda la operación es rechazada.

Ejemplo:

```javascript
const promise1 = Promise.resolve(123);
const promise2 = 456;
const promise3 = new Promise((resolve) => setTimeout(resolve, 1000, 'foo'));

Promise.all([promise1, promise2, promise3]).then(values => {
  console.log(values);  // [123, 456, 'foo']
});
```

**Promise.race()**
Devuelve el resultado de la primera promesa que se resuelva, sin importar si fue cumplida o rechazada.

Ejemplo:

```javascript
const promise1 = new Promise(resolve => setTimeout(resolve, 500, 'uno'));
const promise2 = new Promise(resolve => setTimeout(resolve, 100, 'dos'));

Promise.race([promise1, promise2]).then(value => {
  console.log(value);  // 'dos'
});
```

**Uso de Async/Await**
El uso de async/await simplifica las promesas al permitir que el código se lea de forma más secuencial. async declara una función que devuelve una promesa, mientras que await espera que una promesa se resuelva.

Ejemplo básico:

```javascript
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

**Manejo de errores con try/catch:**

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Respuesta no válida.');
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
```

**Escenarios del Mundo Real**
Al desarrollar una aplicación web, es necesario utilizar Promises en lugar de callbacks para mejorar la legibilidad y el mantenimiento del código.

Como se muestra a continuación, al realizar desarrollos de esta forma (usando múltiples callbacks), con cada nueva adición o modificación, el código adquiere la forma de la “pirámide de la perdición” (pyramid of doom). Con cada incremento, la legibilidad y el mantenimiento del código se deterioran aún más.

```javascript
getArticles(20, (user) => {
  console.log("Fetch articles", user);
  getUserData(user.username, (name) => {
    console.log(name);
    getAddress(name, (item) => {
      console.log(item);
      // esto sigue y sigue...
    });
  });
});
```

En el ejemplo siguiente, surge una estructura más comprensible.

Enviamos una solicitud a la API con Fetch, y con base en la respuesta, la resolvemos o la rechazamos.
Como resultado, podemos imprimir el resultado en pantalla usando .then() o .catch(). Luego, podemos transformar esto en una cadena de Promises con .then(), lo que hace que el código sea más fácil de actualizar.

```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('La respuesta de la red no fue satisfactoria.');
        }
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

fetchData('https://api.example.com/data')
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

En este ejemplo, Promise nos permite manejar la respuesta de forma más clara y estructurada. Además, si ocurre un error en cualquier punto del proceso, podemos capturarlo con .catch() y manejarlo adecuadamente.


### Paquetes Built-in
Node.js incluye un conjunto de módulos nativos que se pueden utilizar sin necesidad de realizar instalaciones adicionales. Estos módulos están diseñados para proporcionar funcionalidades esenciales del sistema y permiten que las aplicaciones JavaScript interactúen eficientemente con archivos, servidores, flujos de datos, criptografía, entre otras áreas.

Estos módulos son especialmente útiles en aplicaciones tanto del lado del servidor como en herramientas de automatización. A continuación, se presenta una lista de los módulos incorporados en Node.js versión 6.10.3 junto con una breve descripción de cada uno:


**assert**	Proporciona un conjunto de pruebas de aserción para validar condiciones durante la ejecución del programa.
**buffer**	Maneja datos binarios de manera eficiente.
**child_process**	Permite ejecutar procesos hijos para tareas paralelas.
**cluster**	Divide un proceso de Node en múltiples procesos para mejorar la escalabilidad.
**crypto**	Implementa funciones criptográficas usando OpenSSL.
**dgram**	Proporciona sockets UDP para comunicación en redes.
**dns**	Realiza consultas DNS y funciones de resolución de nombres.
**domain**	(Obsoleto) Maneja errores no controlados.
**events**	Permite trabajar con eventos y la emisión de ellos mediante un patrón basado en EventEmitter.
**fs**	Gestiona el sistema de archivos, permitiendo leer, escribir y manipular archivos.
**http**	Permite que Node.js actúe como un servidor HTTP.
**https**	Habilita el uso de HTTPS para servidores seguros.
**net**	Crea servidores y clientes para comunicación a través de sockets.
**os**	Proporciona información sobre el sistema operativo.
**path**	Facilita la manipulación de rutas de archivos y directorios.
**punycode**	(Obsoleto) Implementa un esquema de codificación de caracteres.
**querystring**	Maneja cadenas de consulta (query strings) en URLs.
**readline**	Permite procesar flujos de datos línea por línea.
**stream**	Facilita la gestión de datos en flujo, como archivos de gran tamaño o transmisiones en vivo.
**string_decoder**	Decodifica objetos de tipo Buffer en cadenas de texto.
**timers**	Ejecuta funciones después de un tiempo determinado (en milisegundos).
**tls**	Implementa los protocolos TLS y SSL para comunicaciones seguras.
**tty**	Proporciona clases para manejar terminales de texto.
**url**	Analiza y manipula URLs.
**util**	Ofrece funciones de utilidad generales para facilitar el desarrollo.
**v8**	Provee acceso a información sobre V8, el motor de JavaScript.
**vm**	Compila y ejecuta código JavaScript en una máquina virtual aislada.
**zlib**	Comprime y descomprime archivos utilizando algoritmos como Gzip.

### Naturaleza Sincrónica y Web APIs
Las Web APIs son interfaces que los navegadores proporcionan para extender las funcionalidades de JavaScript, permitiendo la interacción con elementos del entorno web como el DOM, multimedia, red, almacenamiento local, y más. Estas APIs funcionan de forma independiente al motor V8 de JavaScript, que solo ejecuta el código JS. Cuando se invoca una API, la llamada pasa al navegador, que se encarga de ejecutarla en su propio entorno, permitiendo una programación más eficiente.

**¿Para qué se usan las Web APIs?**
Se utilizan para manipular contenidos del navegador y gestionar funcionalidades que no pueden lograrse únicamente con JavaScript nativo. Además, permiten realizar operaciones asíncronas (como llamadas de red) sin bloquear el hilo principal de ejecución.

**Interacción con el motor V8**
El motor V8 de Google ejecuta el código JavaScript, pero delega las llamadas a APIs del navegador hacia otros subsistemas. Por ejemplo, una solicitud a la API fetch es manejada por el navegador y los resultados se devuelven al motor V8 para continuar su procesamiento.

**APIs más comunes y ejemplos simples**

- DOM (Document Object Model): Manipula los elementos de la página.
```js
document.querySelector('h1').textContent = 'Hola Mundo';
```

- Fetch API: Realiza solicitudes HTTP.
```js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

- LocalStorage / SessionStorage: Guarda datos en el navegador.
```js
localStorage.setItem('usuario', 'Alice');
console.log(localStorage.getItem('usuario')); // Alice
```

- Geolocation API: Obtiene la ubicación del dispositivo.
```js
navigator.geolocation.getCurrentPosition(pos => console.log(pos.coords));
```

- Canvas API: Dibuja gráficos en un elemento <canvas>.
```js
const ctx = document.querySelector('canvas').getContext('2d');
ctx.fillRect(10, 10, 100, 100);
```

- Notifications API: Muestra notificaciones del sistema.
```js
new Notification('¡Hola!', { body: 'Tienes un mensaje nuevo' });
```

## API REST en Node
Una API REST (Representational State Transfer) es un estilo arquitectónico que permite la comunicación entre un cliente y un servidor a través de protocolos HTTP. La API expone recursos que pueden ser consultados, creados, actualizados o eliminados mediante métodos HTTP (GET, POST, PUT, DELETE, etc.). REST es muy utilizado por ser sencillo, eficiente y por funcionar sobre estándares web.

Casos de Uso
- Aplicaciones móviles: Las apps consumen API REST para sincronizar datos con un servidor (como el login de usuarios).
- E-commerce: Gestiona productos, inventarios, y órdenes mediante API.
- Servicios financieros: Aplicaciones de bancos permiten transferencias y consulta de cuentas mediante APIs REST.
- Integraciones entre sistemas: Permite que dos sistemas independientes se comuniquen (por ejemplo, el front y el back de una tienda en línea).

Frameworks Comunes en Node.js
- Express: Popular por ser ligero, flexible y fácil de usar.
- Koa: Creado por los desarrolladores de Express, ofrece mayor modularidad.
- NestJS: Enfocado en aplicaciones escalables con TypeScript.
- Hapi: Robusto y orientado a la seguridad.


**Que es frontend y backend?**

El front-end es el código que se ejecuta del lado del cliente. Este código (generalmente HTML, CSS y JavaScript) corre en el navegador del usuario y genera la interfaz de usuario.

El back-end es el código que se ejecuta en el servidor, recibe las solicitudes de los clientes y contiene la lógica necesaria para enviar los datos adecuados de vuelta al cliente. El back-end también incluye la base de datos, que almacena de forma persistente toda la información de la aplicación. Este artículo se enfoca en el hardware y software del lado del servidor que hacen esto posible.

¿Qué son los clientes?
Los clientes son cualquier cosa que envía solicitudes al back-end. A menudo, son navegadores que solicitan el código HTML y JavaScript que ejecutarán para mostrar sitios web al usuario final. Sin embargo, existen muchos tipos de clientes: podrían ser una aplicación móvil, una aplicación que corre en otro servidor, o incluso un electrodoméstico inteligente con acceso a la web.

El back-end incluye toda la tecnología necesaria para procesar las solicitudes entrantes y generar y enviar una respuesta al cliente. Generalmente, consta de tres partes principales:

- El servidor: es la computadora que recibe las solicitudes.
- La aplicación: es el software que corre en el servidor, escucha las solicitudes, recupera información de la base de datos, la procesa y envía respuestas.
- La base de datos: se utiliza para organizar y almacenar los datos de manera persistente.

El servidor ejecuta una aplicación que contiene la lógica necesaria para responder a varias solicitudes según el verbo HTTP y el URI (Identificador Uniforme de Recursos). La combinación de un verbo HTTP y un URI se conoce como ruta, y emparejarlas basándose en una solicitud se llama enrutamiento.

Algunas de estas funciones serán middleware. En este contexto, el middleware es cualquier código que se ejecuta entre la recepción de la solicitud por parte del servidor y el envío de la respuesta. Estas funciones pueden modificar la solicitud, consultar la base de datos u otros procesos. El middleware normalmente pasa el control a la siguiente función en la cadena en lugar de enviar una respuesta directamente.

Eventualmente, una función de middleware terminará el ciclo de solicitud-respuesta enviando una respuesta HTTP al cliente.

Muchos programadores usan frameworks como Express para simplificar la lógica del enrutamiento. Por ahora, basta con entender que cada ruta puede tener una o varias funciones que se ejecutan cada vez que una solicitud coincide con esa ruta.

¿Qué tipos de respuestas puede enviar un servidor?
El servidor puede enviar datos en diferentes formatos. Por ejemplo, podría servir un archivo HTML, enviar datos en formato JSON, o devolver solo un código de estado HTTP. Probablemente has visto el código "404 - Not Found" al intentar acceder a un recurso que no existe, pero existen muchos otros códigos de estado que indican lo que ocurrió cuando el servidor recibió la solicitud.

¿Qué es una base de datos y por qué necesitamos usarla?
Las bases de datos son una parte fundamental del back-end de las aplicaciones web. Permiten almacenar datos de manera persistente en memoria. Esto reduce la carga en la memoria principal del CPU del servidor y asegura que los datos estén disponibles incluso si el servidor se reinicia o pierde energía.

Muchas solicitudes que se envían al servidor requerirán realizar una consulta a la base de datos. Un cliente podría pedir información almacenada o enviar datos para que se guarden en la base de datos.

¿Qué es realmente una API web?
Una API (Interfaz de Programación de Aplicaciones) es una colección de métodos definidos para permitir la comunicación entre diferentes componentes de software.

Más específicamente, una API web es la interfaz creada por el back-end, que define una colección de endpoints y los recursos que expone.

Una API web se define por los tipos de solicitudes que puede manejar, que se determinan por las rutas que implementa, y por los tipos de respuestas que los clientes pueden esperar al hacer esas solicitudes.

Una única API web puede proporcionar datos para diferentes front-ends. Como la API web proporciona datos sin especificar cómo deben visualizarse, se pueden crear múltiples páginas HTML o aplicaciones móviles para mostrar esos datos.

Otros principios del ciclo de solicitud-respuesta:
- El servidor no puede iniciar respuestas sin una solicitud previa.
- Toda solicitud necesita una respuesta, incluso si es solo un código 404 indicando que el recurso no fue encontrado. De lo contrario, el cliente quedaría esperando indefinidamente.
- El servidor no debe enviar más de una respuesta por solicitud. Esto generará errores en el código.

Mapeando una solicitud
Veamos un ejemplo concreto de los pasos principales cuando un cliente realiza una solicitud al servidor:

1. Alice está comprando en SuperCoolShop.com. Hace clic en la imagen de una funda para su smartphone, y ese clic genera una solicitud GET a http://www.SuperCoolShop.com/products/66432.

- El verbo GET indica que el cliente está solicitando datos, no modificándolos.
- El URI /products/66432 indica que el cliente busca información sobre el producto con ID 66432.

2. La solicitud viaja a través de Internet hasta uno de los servidores de SuperCoolShop. Este paso puede ser lento, ya que la solicitud no puede viajar más rápido que la velocidad de la luz. Por eso, muchos sitios web tienen servidores en diferentes partes del mundo para acercarse a los usuarios.

3. El servidor, que está escuchando solicitudes continuamente, recibe la solicitud de Alice.

4. Los listeners que coinciden con la solicitud (verbo GET y URI /products/66432) se activan. El código que corre entre la solicitud y la respuesta es el middleware.

5. Para procesar la solicitud, el servidor hace una consulta a la base de datos para obtener más información sobre la funda del smartphone. La base de datos contiene el nombre del producto, su precio, algunas reseñas y una cadena con la ruta de la imagen del producto.

6. La consulta a la base de datos se ejecuta, y la información solicitada es devuelta al servidor. Este paso también puede ser lento, ya que leer y escribir en la memoria estática es más lento, y la base de datos podría estar en una máquina diferente al servidor original.

7. El servidor recibe los datos necesarios y construye la respuesta para enviar al cliente. El cuerpo de la respuesta contiene toda la información que el navegador de Alice necesita para mostrar los detalles del producto (precio, reseñas, tamaño, etc.). El encabezado de la respuesta incluirá el código de estado HTTP 200, indicando que la solicitud fue exitosa.

8. La respuesta viaja de regreso a la computadora de Alice a través de Internet.

9. El navegador de Alice recibe la respuesta y usa la información para generar y renderizar la vista final que ella verá.

**Arquitecturas de backend**

Arquitectura Monolítica:
La arquitectura monolítica consiste en construir una aplicación como una unidad única y cohesiva. Todos los componentes, incluidos el servidor, el enrutamiento, la lógica de negocio y las capas de acceso a datos, están estrechamente integrados.
![Arquitectura Monolítica](https://media.licdn.com/dms/image/v2/D5612AQEMAHgPasJROA/article-inline_image-shrink_1000_1488/article-inline_image-shrink_1000_1488/0/1711066553818?e=1735776000&v=beta&t=zgt9aQ_CAiACrEK_dbHQ46D1ktpkLJF66b9zVqy1REw)

Arquitectura de Microservicios:
La arquitectura de microservicios descompone una aplicación en servicios más pequeños e independientes, cada uno encargado de una función específica del negocio. Estos servicios se comunican a través de APIs, lo que permite escalabilidad y flexibilidad.
![Arquitectura de Microservicios](https://media.licdn.com/dms/image/v2/D5612AQGX9u3Xcd13CA/article-inline_image-shrink_1000_1488/article-inline_image-shrink_1000_1488/0/1711066581818?e=1735776000&v=beta&t=lqjsqqiGlSAxpMqqYqQWBrRJl9RtFshi8YltE10Q1ww)

Arquitectura Serverless:
La arquitectura serverless abstrae la gestión del servidor, permitiendo a los desarrolladores centrarse únicamente en escribir funciones (funciones serverless) que responden a eventos o desencadenantes. Un ejemplo de esto es Firebase y sus cloud functions.
![Arquitectura Serverless](https://media.licdn.com/dms/image/v2/D5612AQHIwJNAZ8vs2Q/article-inline_image-shrink_1000_1488/article-inline_image-shrink_1000_1488/0/1711066610626?e=1735776000&v=beta&t=KyDKZ6omInDmbntABTCqALp7DjRHtK8io2gcu9Z6cWE)

API Gateway

Un API Gateway es un componente esencial en el desarrollo moderno de software que actúa como un intermediario entre los clientes (como aplicaciones móviles o web) y los servicios backend. Su principal función es gestionar, asegurar y simplificar las comunicaciones entre estos servicios, facilitando el intercambio de datos y la integración de funcionalidades.

![API GATEWAY](https://miro.medium.com/v2/resize:fit:4800/format:webp/0*UrPdEBXiVMeU5Qmk.png)

Función en la Arquitectura de Microservicios
El API Gateway desempeña un papel fundamental al actuar como un punto de entrada único y simplificado para los clientes, en lugar de que tengan que interactuar con múltiples endpoints. Además, funciona como (aunque no necesariamente):

- Controlador de tráfico: Redirige solicitudes entrantes hacia el servicio backend adecuado.
- Validador de acceso: Verifica las credenciales y permisos del cliente para garantizar que solo las solicitudes autorizadas accedan a los servicios.

Beneficios de un API Gateway
- Seguridad: Aplica políticas de autenticación y autorización para proteger tus datos.
- Simplificación: Ofrece un único punto de entrada, eliminando la complejidad de gestionar múltiples endpoints.
- Análisis: Proporciona métricas sobre el uso de las APIs, facilitando la toma de decisiones y optimizaciones.

¿Cómo funciona un API Gateway?
1. Enrutamiento de solicitudes:
El API Gateway actúa como un “GPS” para las solicitudes, guiándolas al servicio backend correcto según reglas predefinidas. Esto evita que los clientes tengan que interactuar directamente con múltiples servicios.

2. Autenticación y autorización:
Verifica las credenciales del cliente, permitiendo solo el acceso a usuarios autenticados. Luego, aplica permisos específicos para determinar qué acciones pueden realizarse, asegurando que cada usuario o aplicación solo acceda a los recursos permitidos.

3. Limitación de tasa y control de tráfico:
Para evitar que los servicios se sobrecarguen, el API Gateway implementa:
- Limitación de tasa: Restringe el número de solicitudes que un cliente puede hacer en un tiempo definido.
- Control de tráfico: Regula la frecuencia de las solicitudes para mantener un flujo constante y evitar colapsos.

Casos de Uso de un API Gateway
- Desarrollo de Microservicios: Facilita la comunicación entre microservicios, actuando como un centro de control que permite su escalabilidad y gestión eficiente.
- Desarrollo de Aplicaciones Móviles: Provee un punto de entrada único para que las apps móviles interactúen con múltiples servicios backend sin complicaciones.
- Integración de Terceros: Simplifica la integración con APIs de terceros, manejando las complejidades de conexión y autenticación.

Las API Gateway no se limitan a API REST, tambien existen para GraphQL, SOAP, etc.


**Variables de Entorno**

Las variables de entorno son valores definidos fuera del código de la aplicación, generalmente mediante el sistema operativo o un servicio. Estas variables se representan mediante pares nombre/valor y se cargan al inicio del programa para ser usadas sin necesidad de modificar el código fuente.

Ejemplo:

```javascript
fetch(process.env.REACT_APP_METEORITE_STRIKE_DATASET)
  .then((response) => response.json())
  .then((data) => {
    this.setState({ meteoriteStrikes: data, isDataLoaded: true });
  });
```

![env vars](https://miro.medium.com/v2/resize:fit:1040/format:webp/1*BIgXzxgolWVDBNq5F_eZpg.png)

Aquí, process.env.REACT_APP_METEORITE_STRIKE_DATASET es reemplazada en tiempo de ejecución por su valor correspondiente.

**Ventajas de las variables de entorno**
- Menos cambios en el código: Permiten evitar modificaciones innecesarias al código cada vez que cambie la configuración (por ejemplo, la URL de un API).
- Previenen errores: Al no modificar el código directamente, se reduce el riesgo de introducir errores accidentales.

**Usos comunes de las variables de entorno**
- Modos de ejecución (producción, desarrollo, pruebas)
- URLs de APIs o dominios
- Claves de autenticación pública/privada (solo seguras en servidores)
- Nombres de cuentas de servicio o emails de grupos

Estas variables se cargan automáticamente en process.env en tiempo de ejecución.

Para gestionar variables en diferentes entornos (como Heroku o Docker), es útil conocer las particularidades de cada plataforma. El paquete cross-env ayuda a definir variables de entorno de forma independiente del sistema operativo.

Uso del paquete dotenv
dotenv permite usar variables de entorno en el frontend y backend a través de archivos .env. Ejemplo:

1. Crear un archivo .env con las variables:
```js
REACT_APP_METEORITE_LANDING_HOMEPAGE="https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh"
```

2. Importar y configurar dotenv en tu aplicación:
```javascript
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.REACT_APP_METEORITE_STRIKE_DATASET);
```

3. Agregar .env a .gitignore evita que estas variables sensibles se suban a repositorios públicos.


**Paquete http en Node.js**

El módulo HTTP de Node.js es una biblioteca incorporada que permite a los desarrolladores crear servidores web y comunicarse con otras APIs utilizando HTTP 1.1, HTTP 2 y HTTPS.

Arquitectura
El módulo HTTP extiende dos clases incorporadas:

- Módulo Net: Proporciona una API de red para crear servidores o clientes TCP basados en flujos (streams).
- Módulo Events: Proporciona una arquitectura basada en eventos utilizando la clase EventEmitter.

Esto significa que al trabajar con el módulo HTTP, puedes escuchar y actuar en función de los eventos mientras los datos se procesan mediante flujos. Ambos funcionan de manera no bloqueante, lo que permite procesar múltiples solicitudes simultáneamente sin pausar el servidor

Servidor Simple
Para comenzar, crea un archivo JavaScript (por ejemplo, app.js) e importa el módulo HTTP:

```javascript
const http = require('http');
```

Luego, crea una instancia del servidor utilizando http.createServer():

```javascript
const server = http.createServer((req, res) => { ... });
```

Esta función recibe dos argumentos:

- Objeto de solicitud (req)
- Objeto de respuesta (res)
Ambos son objetos de tipo stream.

Ejemplo de un servidor básico que responde "Hello!":

```javascript
const server = http.createServer((req, res) => {
  res.end('Hello!');
});
```

Configura el puerto del servidor usando server.listen():

```javascript
server.listen(3000, () => {
  console.log('Server started on localhost:3000!');
});
```

Ejecuta el archivo con node app.js. Luego, ve a localhost:3000 en tu navegador para ver la respuesta del servidor.

Objeto Request
El objeto Request es una instancia de http.IncomingMessage que extiende un flujo legible. Contiene información como:

- URL de la solicitud
- Método HTTP (GET/POST/PUT/DELETE)
- Cuerpo de la solicitud
- Cabeceras (headers)

Ejemplo de cómo extraer datos de la solicitud:

```javascript
const server = http.createServer((req, res) => {
  console.log('Headers :>> ', req.headers);
  console.log('Method :>> ', req.method);
  console.log('URL :>> ', req.url);
  res.end('Thank you Mario, but our princess is in another castle...');
});
```

Si accedes a http://localhost:3000/api/users?userid=100, se imprimirá la información en la consola.

Extracción de Parámetros de la URL
Puedes usar el módulo url para analizar la URL:

```javascript
const url = require('url');

const server = http.createServer((req, res) => {
  const urlData = url.parse(req.url, true);
  console.log('urlData :>> ', urlData);

  res.end('Thank you Mario, but our princess is in another castle...');
});
```

Resultado:

urlData :>> Url {
  pathname: '/api/users',
  query: { userid: '100' },
  path: '/api/users?userid=100'
}

Extracción del Cuerpo de la Solicitud
El cuerpo de la solicitud llega como un flujo de datos. Puedes interceptarlo así:

```javascript
const server = http.createServer((req, res) => {
  const bodyStream = [];

  req.on('data', (chunk) => {
    bodyStream.push(chunk);
  });

  req.on('end', () => {
    const bufferData = Buffer.concat(bodyStream);
    const requestBody = JSON.parse(bufferData);

    console.log('Request Body :>> ', requestBody);
    res.end('All good!');
  });
});
```

Si envías una solicitud POST con este cuerpo:

```json
{
  "name": "Super Mario",
  "level": 94,
  "job": "Plumber"
}
```
Verás la salida en consola:

Request Body :>> { name: 'Super Mario', level: 94, job: 'Plumber' }

Objeto Response
El objeto Response es una instancia de http.ServerResponse. Se utiliza para enviar la respuesta al cliente. Ejemplo de envío en fragmentos:

```javascript
const server = http.createServer((req, res) => {
  res.write('Hello');
  res.write('World');
  res.end('!');
});
```

O enviando todo a la vez:

```javascript
const server = http.createServer((req, res) => {
  res.end('Hello World!');
});
```

Códigos de Estado y Cabeceras de Respuesta
Puedes establecer el código de estado de la respuesta:

```javascript
const server = http.createServer((req, res) => {
  res.statusCode = 400;
  res.end('Something went wrong!');
});
```

Establecer cabeceras:

```javascript
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ greetings: 'Hello World' }));
});
```

Manejo de Errores
Puedes manejar errores utilizando los eventos de error en los objetos de solicitud y respuesta:

```javascript
const server = http.createServer((req, res) => {
  req.on('error', (err) => {
    console.log('Request error :>> ', err);
    res.statusCode = 400;
    res.end('Bad Request!');
  });

  res.on('error', (err) => {
    console.log('Response error :>> ', err);
    res.statusCode = 500;
    res.end('Internal Server Error!');
  });

  res.end('All good!');
});
```

También puedes usar bloques try-catch:

```javascript
const server = http.createServer((req, res) => {
  try {
    res.end('All good!');
  } catch (err) {
    console.error('Error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error!');
  }
});
```

Rutas Simples con el Objeto Request
El módulo HTTP no tiene un enrutador incorporado, pero puedes usar la URL y el método de solicitud para manejar diferentes rutas:

```javascript
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/') {
    res.end(JSON.stringify({ greeting: 'Hello World' }));
  } else if (req.url === '/profile') {
    res.end(JSON.stringify({ data: 'Profile page!' }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});
```

JWT
El JSON Web Token (JWT) es un estándar abierto (RFC 7519) para transmitir información de manera segura entre partes como un objeto JSON. El token está firmado digitalmente, lo que garantiza su autenticidad e integridad. Los JWT se utilizan principalmente para autenticar usuarios, autorizar el acceso a ciertos recursos y asegurar la comunicación.

Estructura de un JWT
Un JWT está compuesto por tres partes separadas por puntos (.), que son cadenas codificadas en base64url:

Header (Encabezado):
El encabezado generalmente consta de dos partes: el tipo de token (JWT) y el algoritmo de firma utilizado, como HMAC SHA256 o RSA.
Ejemplo:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Payload (Cuerpo):
El cuerpo contiene las "claims" (declaraciones) que representan información sobre el usuario u otros datos. Estas declaraciones pueden ser de tres tipos: registradas, públicas y privadas.
Ejemplo:

```json
{
  "sub": "user123",
  "name": "John Doe",
  "admin": true
}
```

Signature (Firma):
La firma se genera tomando el encabezado y el cuerpo codificados, junto con una clave secreta y el algoritmo especificado. Esta firma garantiza que el emisor del JWT es quien dice ser y que el mensaje no ha sido alterado.
Ejemplo (usando HMAC SHA256):

```scss
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

![JWT PARTS](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*AEmntZNyAoMpylE9b7FD9w.png)

Principio de Funcionamiento
Cuando un usuario inicia sesión o intenta acceder a un recurso protegido, el servidor genera un JWT tras la autenticación exitosa. El cliente almacena este token, generalmente en el local storage o en una cookie. En cada solicitud posterior que requiera autenticación, el cliente envía el JWT en los encabezados de la solicitud. El servidor valida el token comprobando la firma y decodificando el cuerpo para verificar la autenticidad y autorización del usuario.

Ventajas de JWT
- Sin estado: Los JWT contienen toda la información necesaria dentro de ellos, lo que evita que el servidor mantenga información de sesión. Esto reduce la carga del servidor y facilita la escalabilidad.
- Compacto y eficiente: Su pequeño tamaño los hace adecuados para transmisión a través de redes y fáciles de interpretar por los clientes.
- Seguro: Los JWT están firmados digitalmente, garantizando la integridad de los datos y evitando manipulaciones. Los algoritmos de cifrado aumentan aún más la seguridad.
- Comunicación entre dominios: Los JWT pueden utilizarse entre diferentes dominios o microservicios, ya que no dependen de cookies o sesiones en el servidor.


Mejores Prácticas para Implementar JWT
- Almacenamiento seguro: Almacena los JWT en cookies HTTP-only para evitar el acceso desde JavaScript, lo que reduce el riesgo de ataques XSS.
- Expiración de tokens: Define un tiempo de expiración razonable para limitar la ventana de uso indebido.
- Revocación de tokens: Implementa un mecanismo para revocar o añadir a una lista negra los tokens comprometidos.
- Uso de HTTPS: Asegura que todas las comunicaciones entre cliente y servidor utilicen HTTPS para evitar escuchas no autorizadas y ataques de intermediario.
- Evita almacenar datos sensibles: No almacenes información sensible en el cuerpo del JWT, ya que es fácilmente legible al decodificarlo en base64.

Consejo: Se debe mantener la clave secreta (secret) segura y no exponerla en el código o sistemas de control de versiones (como Github). En una aplicación real, esta clave se suele almacenar en una variable de entorno o archivo de configuración seguro.

![diagrama de flujo](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*TNF50fkV0LDWtgZO8MsNOQ.jpeg)


## Anexo 1: Git y GitHub

**¿Qué es un sistema de control de versiones?**
El control de versiones es un sistema que permite registrar cambios en archivos a lo largo del tiempo. Esto facilita que los usuarios puedan ver versiones específicas de esos archivos posteriormente.

Un sistema de control de versiones (VCS, por sus siglas en inglés) registra el historial de cambios realizados por equipos o personas en un proyecto. A medida que el proyecto evoluciona, los equipos pueden realizar pruebas, corregir errores y añadir nuevas funciones con la tranquilidad de que siempre se puede recuperar cualquier versión anterior. Un VCS también ayuda a responder preguntas como:

- ¿Qué cambios se hicieron?
- ¿Quién los hizo?
- ¿Cuándo y por qué se realizaron?

Git es un ejemplo de sistema de control de versiones distribuido (DVCS). A diferencia de los sistemas centralizados, un DVCS como Git permite que cada usuario tenga una copia completa del proyecto con todo su historial, archivos y ramas. Esto permite trabajar de forma asincrónica sin necesidad de estar conectado continuamente a un repositorio central.

Un repositorio o proyecto Git es la colección completa de archivos y carpetas de un proyecto, junto con su historial de cambios. Estos cambios se registran como commits, que son como fotografías del proyecto en momentos específicos. Un repositorio puede tener varias ramas que representan diferentes líneas de desarrollo.

Como Git es un sistema distribuido, cualquier persona con una copia del repositorio tiene acceso a todo el código y su historial. Git también permite interactuar con el historial, clonar, crear ramas, fusionar, comparar versiones y mucho más.

GitHub es una plataforma de alojamiento para proyectos Git. Proporciona herramientas que mejoran la colaboración mediante discusiones, revisiones de código y solicitudes de cambios (pull requests). GitHub tiene una comunidad activa y ofrece integraciones útiles en su marketplace.

El flujo de trabajo de GitHub sigue estos pasos:

- Crear una rama: Permite trabajar en cambios específicos sin afectar la rama principal.
- Añadir commits: Guarda puntos seguros en el historial del proyecto.
- Abrir una pull request: Propone cambios y permite recibir retroalimentación del equipo.
- Revisar código: Los equipos comentan y prueban los cambios propuestos.
- Fusionar (merge): Se combinan los cambios en la rama principal.
- Desplegar: El código puede pasar a producción usando herramientas de integración continua.

Se puede encontrar una explicacion detallada de Gitflow en este [enlace](https://www.atlassian.com/es/git/tutorials/comparing-workflows/gitflow-workflow)


## Anexo 2: Axios
Axios es una popular biblioteca de JavaScript que facilita la realización de solicitudes HTTP desde aplicaciones del lado cliente. Simplifica el proceso de comunicación entre clientes y servidores, permitiendo enviar y recibir datos de manera eficiente y con menos código. Es compatible tanto con navegadores como con entornos de Node.js, ofreciendo una forma clara e intuitiva de gestionar peticiones asíncronas.

Uso de Axios
Instalación:

```bash
npm install axios
```

Importación:
```javascript
import axios from 'axios'; // ES6
const axios = require('axios'); // CommonJS
```

Ejemplo de solicitud GET:
```javascript
axios.get('https://api.example.com/data')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
```
Este ejemplo accede a un endpoint para recuperar datos. Si hay un error, lo registra en la consola.


Métodos HTTP soportados por Axios
- GET: Obtiene datos del servidor.
- POST: Envía datos para crear recursos.
- PUT: Actualiza recursos existentes.
- DELETE: Elimina recursos.


**Interceptors en Axios**
Los interceptores de Axios permiten capturar y modificar las solicitudes o respuestas antes de que lleguen a su destino final. Esto resulta útil para añadir configuraciones globales como autenticación, gestión de errores y manejo automático de sesiones (por ejemplo, usando tokens de acceso y refresh tokens).

Request Interceptor (Interceptor de Solicitudes)
Este interceptor actúa antes de que se envíe una solicitud al servidor. Suele utilizarse para:
- Añadir cabezeras como tokens de autenticación en cada petición.
- Configurar parámetros comunes (como una URL base).
- Registrar información de la solicitud para depuración.

Ejemplo: Añadiendo un token de autenticación
```javascript
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('Request:', config); // Depuración
  return config;
}, error => {
  console.error('Error en la solicitud:', error);
  return Promise.reject(error); // Manejo de errores
});
```

¿Dónde usarlo?
Este interceptor puede colocarse en la configuración inicial de Axios, típicamente en el archivo donde se crea una instancia personalizada de Axios (como api.js o axiosConfig.js).

Response Interceptor (Interceptor de Respuestas)
Este interceptor se ejecuta después de que el servidor responde, pero antes de que los datos lleguen al código que los consume. Se usa para:
- Manejo global de errores, como redirección en errores 401 (No autorizado).
- Transformación de respuestas para devolver solo la parte útil.
- Actualización automática del token cuando ha expirado, usando un refresh token.

Manejo de Tokens con Refresh Tokens
Un escenario común es que el token de acceso expira mientras el usuario sigue usando la aplicación. En este caso, el response interceptor detecta un error 401 y lanza una solicitud para obtener un nuevo token (refresh token). Después, reintenta la solicitud original con el nuevo token.

Ejemplo de un Response Interceptor con Refresh Token:
```javascript
axios.interceptors.response.use(
  response => response, // Si no hay errores, simplemente devuelve la respuesta

  async error => {
    const originalRequest = error.config; // Guarda la solicitud original

    // Si el error es 401 (token expirado) y no estamos reintentando
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Evita un bucle infinito

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        // Realiza la solicitud para obtener un nuevo token
        const { data } = await axios.post('/auth/refresh-token', { token: refreshToken });

        // Guarda el nuevo token en localStorage
        localStorage.setItem('accessToken', data.accessToken);

        // Actualiza el encabezado de la solicitud original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // Reintenta la solicitud original con el nuevo token
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError);
        // Redirige al usuario al login si el refresh token también es inválido
        window.location.href = '/login';
      }
    }

    return Promise.reject(error); // Si no es un error 401, rechaza el error normalmente
  }
);
```


Referencias:
[How does JavaScript actually work](https://medium.com/sessionstack-blog/how-does-javascript-actually-work-part-1-b0bacc073cf)
[Que es NPM](https://www.freecodecamp.org/espanol/news/que-es-npm/)
[Scopes, Chains and Closures](https://dev.to/shingaiz/scopes-scope-chains-and-closures-explained-3e89)
[Lexical scope in JavaScript](https://cleverzone.medium.com/lexical-scope-in-javascript-929789101dab)
[ESM y CJS](https://lenguajejs.com/nodejs/fundamentos/commonjs-vs-esm/)
[Web APIs](https://dev.to/ra1nbow1/useful-built-in-javascript-web-apis-4oi7)
[Axios, a beginners guide](https://medium.com/@reggiecheston/a-beginners-guide-to-using-axios-in-node-js-simplifying-http-requests-441291fef064)
[Mastering Promises on JavaScript](https://medium.com/insiderengineering/mastering-javascript-promises-from-basics-to-advanced-f24669381c56)
[Backend architecture](https://www.codecademy.com/article/back-end-architecture)
[Different backend architectures](https://www.linkedin.com/pulse/types-backend-web-architecture-nodejs-aakarshit-giri-af4hc/)
[What is an API Gateway](https://medium.com/@learnwithwhiteboard_digest/understanding-what-is-api-gateway-and-how-it-works-with-examples-4762c26faca3)
[Git](https://medium.com/swlh/an-introduction-to-git-and-github-22ecb4cb1256)
[JWT](https://medium.com/@extio/understanding-json-web-tokens-jwt-a-secure-approach-to-web-authentication-f551e8d66deb)

