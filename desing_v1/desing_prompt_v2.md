Diseña e implementa una propuesta web profesional para Sur Eficiencia, empresa de ingeniería y consultoría. El objetivo es evaluar una dirección visual con un recurso 3D sutil antes de desarrollar el sitio definitivo.

Antes de trabajar:
1. Lee íntegramente `style-guide-summary.md`: es la fuente de verdad para identidad, colores, tipografías, voz y sistema visual.
2. Revisa el proyecto, sus instrucciones y recursos existentes. Conserva su stack y utiliza Tailwind CSS.
3. Utiliza `frontend-design` y las skills de Three.js pertinentes si están disponibles. No migres el proyecto a otro framework para incorporar el 3D.

DIRECCIÓN CREATIVA

Desarrolla una propuesta arquitectónica y técnica: composición asimétrica equilibrada, retícula precisa, filetes y relaciones visuales inspiradas en planos de ingeniería.

Incorpora una única escena Three.js en la portada. Representa una volumetría arquitectónica conceptual sencilla que ayude a comunicar planificación y precisión. Debe identificarse discretamente como “Visualización conceptual”.

La propuesta debe diferenciarse de una composición editorial fotográfica mediante su organización espacial, tratamiento de servicios y lenguaje gráfico. No basta con añadir un canvas a una plantilla convencional.

REQUISITOS DE MARCA

- Respeta los valores y funciones de los colores definidos en la guía.
- Usa Manrope para títulos y Source Sans 3 para texto.
- Reserva el blanco hueso para la acción de cotizar sobre fondo azul. No lo utilices como material decorativo del modelo.
- Aplica el espaciado, contenedor, radios, bordes e iconografía establecidos.
- Mantén el movimiento de interfaz dentro de las duraciones indicadas.
- Si la guía deja una decisión abierta, adopta una solución conservadora y documenta la suposición.

CONTENIDO Y NAVEGACIÓN COMUNES

Construye una página de inicio completa con navegación por anclas:
Inicio, Servicios, Cómo trabajamos y Contacto.

Incluye estas secciones, en este orden:
1. Portada: identifica qué hace Sur Eficiencia y ofrece “Solicitar cotización”.
2. Servicios: diagnóstico térmico, topografía, pavimentación y aguas lluvias, subdivisión, y agua potable y alcantarillado.
3. Cómo trabajamos: una secuencia breve de consulta inicial, revisión del requerimiento y propuesta técnica. Identifica esta secuencia como contenido propuesto para validación, fuera de la interfaz principal.
4. Contacto: formulario con nombre, correo, servicio y mensaje.
5. Pie de página.

Redacta textos breves y comprensibles en español de Chile, con voz profesional cercana. Explica cada servicio sin inventar prestaciones concretas no respaldadas.

No inventes certificaciones, clientes, proyectos ejecutados, cifras, testimonios, cobertura territorial ni garantías. Los campos pendientes de la guía no deben completarse como hechos. No muestres “pendiente” en la web: omite afirmaciones no verificadas y registra las preguntas por resolver en tu entrega.

ESCENA 3D

- Usa geometría sencilla y materiales sobrios alineados con la paleta.
- Mantén títulos, textos, navegación y botones en HTML accesible fuera del canvas.
- Evita partículas, efectos luminosos llamativos, giros continuos y desplazamiento secuestrado.
- Permite, como máximo, una respuesta leve al puntero en dispositivos adecuados. La escena debe resultar atractiva también en reposo.
- Carga el recurso 3D sin bloquear el contenido principal.
- Limita la resolución de renderizado y detén el render cuando la escena esté fuera de pantalla o la pestaña esté oculta.
- Libera los recursos al desmontar la escena.
- Ofrece una alternativa estática coherente mientras carga o si WebGL falla.
- Usa la alternativa estática con movimiento reducido y, por defecto, en móvil.
- No presentes la volumetría como una obra real de Sur Eficiencia.

IMÁGENES

Puedes utilizar imágenes referenciales de apoyo.
- Identifícalas visiblemente con “Imagen referencial”.
- No las presentes como portafolio ni como trabajos ejecutados.
- Prioriza terreno, viviendas, instrumentos, planos e infraestructura.
- Conserva sus colores naturales, sin filtros ni capas de color.
- Registra sus fuentes en la documentación.
- Si no hay imágenes disponibles, utiliza placeholders cuidados y explícitos.

EXPERIENCIA Y FUNCIONAMIENTO

- Diseña escritorio y móvil con el mismo cuidado.
- Mantén navegación accesible por teclado, foco visible, etiquetas de formulario y contraste adecuado.
- El menú móvil debe funcionar y cerrarse al seleccionar un enlace.
- Los enlaces de cotización deben conducir al formulario.
- Implementa validación del formulario. Si no existe backend, aclara que es una demostración y no simules un envío exitoso.
- Habilita WhatsApp solo si encuentras un número verificado en los recursos. En caso contrario, documenta el dato faltante sin crear un enlace ficticio.
- El contenido y el contacto deben seguir funcionando aunque la escena 3D no cargue.

ENTREGA

Implementa la propuesta, no te limites a describirla. Si existe otra versión, preserva su trabajo y deja esta identificada como “Propuesta 02”.

Comprueba la página en escritorio y móvil; utiliza el navegador o las herramientas disponibles para revisar desbordamientos, navegación, formulario y alternativa estática. Revisa errores de consola y ejecuta las comprobaciones pertinentes del proyecto.

Al terminar, indica:
- Cómo abrir la propuesta.
- La idea visual y el aporte concreto del 3D.
- Las suposiciones y contenidos por validar.
- Las comprobaciones realizadas, el comportamiento de la alternativa estática y las limitaciones pendientes.

La propuesta debe quedar lista para revisar con el cliente, sin explicaciones técnicas dentro de la interfaz.