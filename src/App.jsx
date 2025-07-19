import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Bike, Bot, Calendar, MapPin, DollarSign, FileText, Shield, Package, Wifi, Crosshair, Heart, Settings, Download, Loader2, KeyRound, Clock } from 'lucide-react';

// --- Componentes de UI Auxiliares ---

const IconWrapper = ({ icon: Icon }) => (
  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
  </div>
);

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
    </div>
  );
};

const RadioGroup = ({ question, options, value, onChange, name }) => (
  <div className="w-full">
    <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{question}</label>
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(name, e.target.value)}
            className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <span className="ml-4 text-gray-700 dark:text-gray-300">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const CheckboxGroup = ({ question, options, values, onChange, name }) => (
    <div className="w-full">
        <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{question}</label>
        <div className="space-y-3">
            {options.map((option) => (
                <label key={option.value} className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <input
                        type="checkbox"
                        name={option.value}
                        checked={values.includes(option.value)}
                        onChange={(e) => {
                            const newValues = e.target.checked
                                ? [...values, option.value]
                                : values.filter(v => v !== option.value);
                            onChange(name, newValues);
                        }}
                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-4 text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
            ))}
        </div>
    </div>
);


const InputField = ({ question, value, onChange, name, type = "text", placeholder }) => (
  <div className="w-full">
    <label htmlFor={name} className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{question}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
    />
  </div>
);

// --- Componente Principal de la Aplicación ---

export default function App() {
  const [step, setStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({
    fechaSalida: '',
    diasViaje: '',
    horasMinPorDia: '',
    horasMaxPorDia: '',
    paisOrigen: '',
    ciudadSalida: '',
    viajeNacional: '',
    destinoFinal: '',
    ciudadesRuta: '',
    tipoRuta: '',
    zonasEvitar: [],
    regionesIncluirEvitar: '',
    preferenciaCarreteras: '',
    motoMarcaModelo: '',
    rendimientoConocido: '',
    rendimientoValor: '',
    modificacionesConsumo: 'Ninguna',
    combustibleTipo: '',
    autonomia: '',
    hospedajePreferido: [],
    alimentacion: '',
    dormirRemoto: '',
    estacionamiento: '',
    presupuestoTotal: '',
    moneda: '',
    desglosePresupuesto: '',
    gastosIncluir: [],
    margenImprevistos: '',
    pasaporteVigente: '',
    licenciaValida: '',
    infoVisaTIP: '',
    hacerTramites: '',
    puntosMantenimiento: '',
    incluirSitiosTuristicos: '',
    paradasCombustible: '',
    viajaCon: '',
    tipoEquipaje: [],
    pesoEquipaje: '',
    appsNavegacion: [],
    navegacionOffline: '',
    infoConectividad: '',
    objetivoViaje: '',
    publicaraRedes: '',
    diasGrabar: '',
    condicionMedica: '',
    infoVacunas: '',
    evitarAltitudes: '',
    detalleRuta: '',
    incluirRecomendaciones: '',
    idiomaResultado: 'Español',
    incluirGastosCiudad: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const questions = useMemo(() => [
    { component: InputField, props: { name: "fechaSalida", question: "0. ¿Cuál es la fecha estimada de salida?", type: "date" }, icon: Calendar },
    { component: InputField, props: { name: "diasViaje", question: "¿Cuántos días en total durará tu viaje?", type: "number", placeholder: "Ej: 5" }, icon: Calendar },
    { component: InputField, props: { name: "horasMinPorDia", question: "1. ¿Cuántas horas MÍNIMO quieres conducir por día?", type: "number", placeholder: "Ej: 4" }, icon: Clock },
    { component: InputField, props: { name: "horasMaxPorDia", question: "2. ¿Cuántas horas MÁXIMO quieres conducir por día?", type: "number", placeholder: "Ej: 8" }, icon: Clock },
    { component: InputField, props: { name: "paisOrigen", question: "3. ¿En qué país inicia el viaje?", placeholder: "Ej: México" }, icon: MapPin },
    { component: InputField, props: { name: "ciudadSalida", question: "4. ¿Cuál es la ciudad de salida?", placeholder: "Ej: Reynosa" }, icon: MapPin },
    { component: RadioGroup, props: { name: "viajeNacional", question: "5. ¿Viajarás unicamente dentro de ese país?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, icon: MapPin },
    { component: InputField, props: { name: "destinoFinal", question: "6. ¿Cuál es el destino final?", placeholder: "Ej: Mérida" }, icon: MapPin },
    { component: InputField, props: { name: "ciudadesRuta", question: "7. ¿Ciudades previstas en ruta? (Escribe 'No sé' si desconoces)", placeholder: "Tampico, Veracruz, etc." }, icon: MapPin },
    { component: RadioGroup, props: { name: "tipoRuta", question: "8. ¿Tipo de ruta?", options: [{ label: "Con paradas turísticas", value: "A" }, { label: "Lo más directa posible", value: "B" }] }, icon: MapPin },
    { component: CheckboxGroup, props: { name: "zonasEvitar", question: "9. ¿Zonas a evitar?", options: [{ label: "Peligrosas", value: "A" }, { label: "Alto riesgo", value: "B" }, { label: "Fronteras conflictivas", value: "C" }] }, icon: MapPin },
    { component: InputField, props: { name: "regionesIncluirEvitar", question: "10. ¿Regiones/ciudades que deseas incluir o evitar?", placeholder: "Incluir la Huasteca Potosina" }, icon: MapPin },
    { component: RadioGroup, props: { name: "preferenciaCarreteras", question: "11. ¿Preferencia de carreteras?", options: [{ label: "Autopistas de cuota", value: "A" }, { label: "Carreteras libres", value: "B" }, { label: "Mezcla optimizada", value: "C" }] }, icon: MapPin },
    { component: InputField, props: { name: "motoMarcaModelo", question: "12. ¿Qué moto tienes? (Marca, modelo y cilindrada)", placeholder: "Ej: Honda Africa Twin 1100" }, icon: Bike },
    { component: RadioGroup, props: { name: "rendimientoConocido", question: "13. ¿Conoces el rendimiento en carretera (km/L)?", options: [{ label: "Sí", value: "A" }, { label: "No (investígalo)", value: "B" }] }, icon: Bike },
    { component: InputField, props: { name: "rendimientoValor", question: "Si lo conoces, ¿cuál es? (km/L)", type: "number", placeholder: "21" }, condition: (data) => data.rendimientoConocido === 'A', icon: Bike },
    { component: InputField, props: { name: "modificacionesConsumo", question: "14. ¿Modificaciones que alteren consumo?", placeholder: "Ninguna" }, icon: Bike },
    { component: RadioGroup, props: { name: "combustibleTipo", question: "15. ¿Combustible que usa?", options: [{ label: "Magna", value: "A" }, { label: "Premium", value: "B" }, { label: "Otro", value: "C" }] }, icon: Bike },
    { component: InputField, props: { name: "autonomia", question: "16. ¿Autonomía real por tanque? (opcional, en km)", type: "number", placeholder: "Ej: 350" }, icon: Bike },
    { component: CheckboxGroup, props: { name: "hospedajePreferido", question: "17. ¿Hospedaje preferido?", options: [{ label: "Hoteles", value: "A" }, { label: "Hostales", value: "B" }, { label: "Camping", value: "C" }, { label: "Airbnb", value: "D" }, { label: "Moteles", value: "E" }, { label: "Todos", value: "F" }] }, icon: DollarSign },
    { component: RadioGroup, props: { name: "alimentacion", question: "18. ¿Alimentación?", options: [{ label: "Cocinar", value: "A" }, { label: "Fondas", value: "B" }, { label: "Restaurantes", value: "C" }, { label: "Mixto", value: "D" }] }, icon: DollarSign },
    { component: RadioGroup, props: { name: "dormirRemoto", question: "19. ¿Dormir en lugares remotos?", options: [{ label: "Solo si es seguro", value: "A" }, { label: "Sin problema", value: "B" }, { label: "Prefiero evitarlo", value: "C" }] }, icon: DollarSign },
    { component: RadioGroup, props: { name: "estacionamiento", question: "20. ¿Estacionamiento necesario?", options: [{ label: "Techado", value: "A" }, { label: "Vigilado", value: "B" }, { label: "Indiferente", value: "C" }] }, icon: DollarSign },
    { component: InputField, props: { name: "presupuestoTotal", question: "21. ¿Presupuesto total?", type: "number", placeholder: "25000" }, icon: DollarSign },
    { component: InputField, props: { name: "moneda", question: "Indica la moneda", placeholder: "MXN" }, icon: DollarSign },
    { component: RadioGroup, props: { name: "desglosePresupuesto", question: "22. ¿Desglose deseado?", options: [{ label: "Por día", value: "A" }, { label: "Por país", value: "B" }, { label: "Todo el viaje", value: "C" }] }, icon: DollarSign },
    { component: CheckboxGroup, props: { name: "gastosIncluir", question: "23. ¿Gastos a incluir?", options: [{ label: "Peajes", value: "A" }, { label: "Seguros", value: "B" }, { label: "Mantenimiento", value: "C" }, { label: "Alimentación", value: "D" }, { label: "Entradas turísticas", value: "E" }, { label: "Trámites fronterizos", value: "F" }, { label: "Todo", value: "G" }] }, icon: DollarSign },
    { component: InputField, props: { name: "margenImprevistos", question: "24. ¿Margen para imprevistos? (% opcional)", type: "number", placeholder: "15" }, icon: DollarSign },
    { component: RadioGroup, props: { name: "pasaporteVigente", question: "25. ¿Pasaporte vigente?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, condition: (data) => data.viajeNacional === 'B', icon: FileText },
    { component: RadioGroup, props: { name: "licenciaValida", question: "26. ¿Licencia válida/internacional?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, condition: (data) => data.viajeNacional === 'B', icon: FileText },
    { component: RadioGroup, props: { name: "infoVisaTIP", question: "27. ¿Requieres info de visa o TIP de la moto?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, condition: (data) => data.viajeNacional === 'B', icon: FileText },
    { component: RadioGroup, props: { name: "hacerTramites", question: "28. ¿Dispuesto a hacer trámites previos?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, condition: (data) => data.viajeNacional === 'B', icon: FileText },
    { component: RadioGroup, props: { name: "puntosMantenimiento", question: "29. ¿Agregar puntos de mantenimiento en ruta?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, icon: Settings },
    { component: RadioGroup, props: { name: "incluirSitiosTuristicos", question: "30. ¿Incluir sitios turísticos/naturales destacados?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, icon: Settings },
    { component: RadioGroup, props: { name: "paradasCombustible", question: "31. ¿Necesitas paradas de combustible estratégicas?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, icon: Settings },
    { component: RadioGroup, props: { name: "viajaCon", question: "32. ¿Viajas solo o con acompañante?", options: [{ label: "Solo", value: "A" }, { label: "Con acompañante", value: "B" }] }, icon: Package },
    { component: CheckboxGroup, props: { name: "tipoEquipaje", question: "33. ¿Tipo de equipaje principal?", options: [{ label: "Alforjas", value: "A" }, { label: "Maletas rígidas", value: "B" }, { label: "Mochila", value: "C" }, { label: "Mixto", value: "D" }] }, icon: Package },
    { component: InputField, props: { name: "pesoEquipaje", question: "34. ¿Peso aproximado del equipaje? (kg, opcional)", type: "number", placeholder: "25" }, icon: Package },
    { component: CheckboxGroup, props: { name: "appsNavegacion", question: "35. ¿App(s) de navegación?", options: [{ label: "Google Maps", value: "A" }, { label: "iOverlander", value: "B" }, { label: "OsmAnd", value: "C" }, { label: "Garmin", value: "D" }, { label: "Otra", value: "E" }] }, icon: Wifi },
    { component: RadioGroup, props: { name: "navegacionOffline", question: "36. ¿Requieres navegación offline?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, icon: Wifi },
    { component: RadioGroup, props: { name: "infoConectividad", question: "37. ¿Requieres Información sobre conectividad movil?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, icon: Wifi },
    { component: RadioGroup, props: { name: "objetivoViaje", question: "38. ¿Objetivo principal?", options: [{ label: "Aventura", value: "A" }, { label: "Documental", value: "B" }, { label: "Turismo", value: "C" }, { label: "Introspección", value: "D" }, { label: "Creación de contenido", value: "E" }, { label: "Otro", value: "F" }] }, icon: Crosshair },
    { component: RadioGroup, props: { name: "publicaraRedes", question: "39. ¿Publicarás en redes/blog/YouTube?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, condition: (data) => data.objetivoViaje === 'E', icon: Crosshair },
    { component: RadioGroup, props: { name: "diasGrabar", question: "40. ¿Necesitas días extra solo para grabar/editar?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, condition: (data) => data.objetivoViaje === 'E', icon: Crosshair },
    { component: RadioGroup, props: { name: "condicionMedica", question: "41. ¿Condición médica a considerar?", options: [{ label: "Asma", value: "A" }, { label: "Hipertensión", value: "B" }, { label: "Alergias", value: "C" }, { label: "Otra", value: "D" }, { label: "Ninguna", value: "E" }] }, icon: Heart },
    { component: RadioGroup, props: { name: "infoVacunas", question: "42. ¿Incluir info sobre vacunas/requisitos sanitarios?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, condition: (data) => data.viajeNacional === 'B', icon: Heart },
    { component: RadioGroup, props: { name: "evitarAltitudes", question: "43. ¿Evitar altitudes/extremos o zonas sin servicios médicos?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, icon: Heart },
    { component: RadioGroup, props: { name: "detalleRuta", question: "44. ¿Ruta detallada por?", options: [{ label: "Día", value: "A" }, { label: "Tramo", value: "B" }, { label: "País", value: "C" }, { label: "Todo el viaje", value: "D" }] }, icon: Settings },
    { component: RadioGroup, props: { name: "incluirRecomendaciones", question: "45. ¿Incluir recomendaciones de tránsito, seguridad y hospedaje?", options: [{ label: "Sí", value: "A" }, { label: "No", value: "B" }] }, icon: Settings },
    { component: InputField, props: { name: "idiomaResultado", question: "46. ¿Idioma del resultado?", placeholder: "Español" }, icon: Settings },
    { component: RadioGroup, props: { name: "incluirGastosCiudad", question: "47. ¿Incluir gastos en ciudad de salida/llegada?", options: [{ label: "Ambos", value: "A" }, { label: "Solo salida", value: "B" }, { label: "Solo llegada", value: "C" }, { label: "Excluir ambos", value: "D" }] }, icon: Settings },
  ], [formData.rendimientoConocido, formData.viajeNacional, formData.objetivoViaje]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => !q.condition || q.condition(formData));
  }, [questions, formData]);

  const CurrentQuestion = filteredQuestions[questionIndex];
  const CurrentComponent = CurrentQuestion?.component;

  const nextQuestion = () => {
    if (questionIndex < filteredQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const prevQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };
  
  const buildFinalPrompt = () => {
      const userAnswers = Object.entries(formData).map(([key, value]) => {
          const formattedValue = Array.isArray(value) ? value.join(', ') : String(value);
          return `- ${key}: ${formattedValue}`;
      }).join('\n');

      const prompt = `
      Eres un asistente experto en planificación de viajes en moto, extremadamente meticuloso y preciso. Tu única misión es generar un itinerario de viaje detallado y 100% realista que cumpla con las restricciones del usuario sin excepción.

      **REGLA DE ORO (NO NEGOCIABLE):** La restricción más importante es el tiempo de conducción diario. El plan DEBE respetar el rango de horas especificado por el usuario.

      **ALGORITMO OBLIGATORIO DE PLANIFICACIÓN DE RUTA:**
      1.  **CÁLCULO INICIAL:** Primero, determina el tiempo total de conducción en horas para toda la ruta desde ${formData.ciudadSalida} hasta ${formData.destinoFinal}.
      2.  **DEFINICIÓN DEL RITMO:** Calcula el ritmo de viaje ideal dividiendo el tiempo total de conducción entre el número de días de viaje (${formData.diasViaje}). Este será tu objetivo de horas diarias.
      3.  **SEGMENTACIÓN BASADA EN TIEMPO:** Tu tarea principal es segmentar la ruta en tramos diarios. Para cada día, partiendo del origen del día anterior, debes encontrar una ciudad de pernocta que cumpla con dos condiciones OBLIGATORIAS:
          a.  El tiempo de conducción para llegar a ella debe ser lo más cercano posible a tu ritmo de viaje ideal calculado en el paso 2.
          b.  Ese tiempo de conducción DEBE estar **ESTRICTAMENTE DENTRO** del rango mínimo de **${formData.horasMinPorDia || '4'} horas** y el máximo de **${formData.horasMaxPorDia || '8'} horas** que el usuario especificó.
      4.  **VALIDACIÓN FINAL:** Antes de generar la respuesta, revisa el plan completo. Si CUALQUIER día de viaje tiene un tiempo de conducción fuera del rango mínimo/máximo, el plan es INVÁLIDO y debes ajustarlo hasta que todos los días cumplan la regla. No puedes entregar un plan que viole esta condición.
      5.  **CÁLCULO DE DISTANCIA:** Solo después de haber definido las paradas basadas en el tiempo, calcula la distancia exacta de cada tramo diario usando Google Maps. El total de kilómetros será la suma de estos tramos.

      **OTRAS INSTRUCCIONES:**
      * **Costos:** Calcula costos realistas para combustible, peajes (categoría MOTO), hospedaje y comida.
      * **Hospedaje:** Ofrece >= 2 opciones por parada con estacionamiento seguro. Si el usuario elige "Moteles" u "Hostales", filtra por opciones de bajo costo (máx. 500 MXN o equivalente).
      * **Seguridad:** Investiga activamente peligros en la ruta (noticias, foros) e inclúyelos en las recomendaciones diarias.
      * **Investigación:** Todos los datos deben ser verificados en internet. No uses datos ficticios.

      **RESPUESTAS DEL USUARIO (BASE PARA EL PLAN):**
      ${userAnswers}

      **ENTREGA FINAL OBLIGATORIA:**
      Genera ÚNICAMENTE el código HTML completo para el itinerario. No agregues ninguna explicación. El HTML debe ser autoconclusivo y seguir la plantilla y estilos proporcionados.

      **PLANTILLA HTML:**
      <!DOCTYPE html>
      <html lang="es">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Itinerario de Viaje en Moto</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; background-color: #f4f7f6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: auto; background-color: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; }
        h1, h2 { color: #1a237e; border-bottom: 2px solid #3f51b5; padding-bottom: 10px; margin: 0; }
        h1 { font-size: 2em; text-align: center; padding: 20px; background-color: #3f51b5; color: #fff; }
        h1 span { font-size: 0.7em; font-weight: 300; display: block; }
        .card { padding: 25px; border-bottom: 1px solid #e0e0e0; }
        .card:last-child { border-bottom: none; }
        .flex { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px; }
        .flex div { background-color: #f5f5f5; padding: 10px; border-radius: 8px; }
        .label { font-weight: 600; color: #3f51b5; display: block; margin-bottom: 5px; }
        p { margin-top: 15px; }
        ul { list-style-type: '🏍️ '; padding-left: 20px; }
        li { margin-bottom: 8px; }
        footer { text-align: center; padding: 15px; font-size: 0.8em; color: #777; background-color: #f0f0f0; }
        .precauciones ul { list-style-type: '⚠️ '; }
      </style>
      </head>
      <body>
      <div class="container">
        <h1>Itinerario de Viaje en Moto<br><span>{Fechas del viaje}</span></h1>
        <!-- Repite esta tarjeta por cada día -->
        <div class="card">
            <h2>Día X – {FECHA}</h2>
            <div class="flex">
                <div><span class="label">Ruta:</span> {Origen} → {Destino}</div>
                <div><span class="label">Carreteras:</span> {Ej: MEX-180D, MEX-150}</div>
                <div><span class="label">Distancia:</span> {___} km</div>
                <div><span class="label">Tiempo estimado:</span> {h} h {m} min</div>
                <div><span class="label">Gasolina:</span> \${___} {MONEDA}</div>
                <div><span class="label">Peajes:</span> \${___} {MONEDA}</div>
                <div><span class="label">Alimentación (est.):</span> \${___} {MONEDA}</div>
                <div><span class="label">Hospedaje (est.):</span> \${___} {MONEDA}</div>
                <div style="background-color: #e8eaf6; font-weight: bold;"><span class="label">Subtotal del día:</span> \${___} {MONEDA}</div>
            </div>
            <p class="label">Hospedajes Sugeridos:</p>
            <ul><li>{Nombre Hotel/Hostal 1} – {Dirección} – \${Precio_Aprox} {MONEDA}</li><li>{Nombre Hotel/Hostal 2} – {Dirección} – \${Precio_Aprox} {MONEDA}</li></ul>
            <p class="label">Puntos de Interés / Actividades:</p>
            <ul><li>{Actividad 1}</li><li>{Actividad 2}</li></ul>
            <div class="precauciones">
                <p class="label">Precauciones y Peligros en Ruta:</p>
                <ul><li>{Advertencia de seguridad 1}</li><li>{Advertencia de seguridad 2}</li></ul>
            </div>
        </div>
        <!-- Fin de tarjeta diaria -->
        <div class="card">
            <h2>Resumen Final del Viaje</h2>
            <div class="flex">
                <div><span class="label">Kilómetros totales:</span> {___} km</div>
                <div><span class="label">Combustible total (est.):</span> {___} L / \${___} {MONEDA}</div>
                <div><span class="label">Peajes totales (est.):</span> \${___} {MONEDA}</div>
                <div><span class="label">Alimentación total (est.):</span> \${___} {MONEDA}</div>
                <div><span class="label">Hospedaje total (est.):</span> \${___} {MONEDA}</div>
                <div style="background-color: #c5cae9; font-weight: bold;"><span class="label">Gasto General Estimado:</span> \${___} {MONEDA}</div>
                <div style="background-color: #dcedc8; font-weight: bold;"><span class="label">Presupuesto:</span> \$${formData.presupuestoTotal} {MONEDA}</div>
                <div style="background-color: #ffcdd2; font-weight: bold;"><span class="label">Sobrante / Déficit:</span> \${___} {MONEDA}</div>
            </div>
             <p class="label">Ruta completa de carreteras:</p>
             <p>{Ej: MEX-57D → MEX-80D → ...}</p>
        </div>
        <footer>Precios, tiempos y condiciones de ruta estimados a la fecha de generación. Verifica siempre antes de viajar.</footer>
      </div>
      </body>
      </html>
      `;
      return prompt;
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setResult('');
    const finalPrompt = buildFinalPrompt();
    
    try {
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: finalPrompt }] });
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyCIhpOvu86eeyaaYU30OtRMvqAZpVXsHRQ";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                throw new Error(`Error de la API (${response.status}): ${response.statusText}`);
            }
            const message = errorData?.error?.message || response.statusText;
            throw new Error(`Error de la API (${response.status}): ${message}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0 &&
            data.candidates[0].content && data.candidates[0].content.parts &&
            data.candidates[0].content.parts.length > 0) {
            let text = data.candidates[0].content.parts[0].text;
            const htmlStartIndex = text.indexOf('<!DOCTYPE html>');
            if (htmlStartIndex !== -1) {
                text = text.substring(htmlStartIndex);
            }
            setResult(text);
        } else {
            const errorMessage = data?.promptFeedback?.blockReason
              ? `Contenido bloqueado por la política de seguridad: ${data.promptFeedback.blockReason}`
              : "No se recibió contenido válido de la IA. La respuesta podría estar vacía, mal formada o haber sido bloqueada.";
            throw new Error(errorMessage);
        }

    } catch (e) {
        console.error(e);
        setError(`Hubo un error al generar el itinerario: ${e.message}. Por favor, inténtalo de nuevo.`);
    } finally {
        setIsLoading(false);
        setStep(1);
    }
  };

  const downloadHTML = () => {
    const blob = new Blob([result], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'itinerario_moto.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Tu planificador personal está trabajando...</h2>
        <p className="text-lg text-center max-w-md">La IA está investigando precios, rutas, condiciones de seguridad y preparando tu itinerario. Esto puede tardar un momento.</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="p-4 bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Itinerario Generado</h2>
            <div className="flex gap-4">
                 <button onClick={() => { setResult(''); setError(''); setQuestionIndex(0); setStep(0); }} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Crear Nuevo
                </button>
                {result && <button onClick={downloadHTML} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Download className="w-5 h-5" />
                    Descargar HTML
                </button>}
            </div>
        </div>
        {error && <div className="m-4 text-red-700 bg-red-100 p-4 rounded-lg"><strong>Error:</strong> {error}</div>}
        {result ? <div className="w-full h-screen">
          <iframe srcDoc={result} className="w-full h-full border-none" title="Itinerario de Viaje" />
        </div> : null}
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-500">
        <div className="flex items-center gap-4 mb-6">
          {CurrentQuestion && <IconWrapper icon={CurrentQuestion.icon} />}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Planificador de Viaje en Moto</h1>
        </div>
        
        <ProgressBar currentStep={questionIndex} totalSteps={filteredQuestions.length} />
        
        {CurrentComponent && (
          <div className="transition-opacity duration-300">
            <CurrentComponent
              {...CurrentQuestion.props}
              value={formData[CurrentQuestion.props.name]}
              values={Array.isArray(formData[CurrentQuestion.props.name]) ? formData[CurrentQuestion.props.name] : []}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={questionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior
          </button>
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            {questionIndex === filteredQuestions.length - 1 ? 'Generar Itinerario' : 'Siguiente'}
            {questionIndex === filteredQuestions.length - 1 ? <Bot className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5 transform rotate-180" />}
          </button>
        </div>
      </div>
      <footer className="text-center mt-8 text-gray-500 dark:text-gray-400">
        Creado con IA a partir de tu prompt.
      </footer>
    </div>
  );
}
