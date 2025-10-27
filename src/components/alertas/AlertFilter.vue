<!-- src/components/alertas/AlertFilter.vue -->
<template>
  <form class="filtro-form" @submit.prevent="emitirFiltros">
    <h5>Filtros</h5>


    <div  class="mb-3">

        <!-- Código Alerta -->
        <div class="mb-3" v-if="isVisible('codalerta')">
          <label class="form-label">Código Alerta</label>
          <select v-model="filtros.codalerta" class="form-select">
            <option
              v-for="codigo in (tipos.codalerta || [])"
              :key="codigo"
              :value="codigo"
            >
              {{ codigo }}
            </option>
          </select>
        </div>


        <!-- Nombre -->
        <div class="mb-3" v-if="isVisible('nombre')">
          <label class="form-label">Nombre</label>

          <select
            v-if="tipos.nombre && tipos.nombre.length > 0"
            v-model="filtros.nombre"
            class="form-select"
          >
            <option
              v-for="opt in tipos.nombre"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>

          <input
            v-else
            v-model="filtros.nombre"
            type="text"
            class="form-control"
            placeholder="Ingrese nombre manualmente"
          />
        </div>


        <!-- Sentencia -->
        <div class="mb-3" v-if="isVisible('sentenciaId')">
          <label class="form-label">Sentencia ID</label>

          <select
            v-if="tipos.sentenciaId && tipos.sentenciaId.length > 0"
            v-model="filtros.sentenciaId"
            class="form-select"
          >
            <option
              v-for="opt in tipos.sentenciaId"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>

          <input
            v-else
            v-model="filtros.sentenciaId"
            type="number"
            class="form-control"
            placeholder="Ingrese ID manualmente"
          />
        </div>



        <!-- Inicio Evento -->
        <div class="mb-3" v-if="isVisible('inicioevento')">
          <label class="form-label">Inicio Evento</label>
          <input v-model="filtros.inicioevento" type="datetime-local" class="form-control" />
        </div>

          <!-- Identificación Alerta -->
          <div class="mb-3" v-if="isVisible('identificacionalerta')">
            <label class="form-label">Identificación Alerta</label>

            <select
              v-if="tipos.identificacionalerta && tipos.identificacionalerta.length > 0"
              v-model="filtros.identificacionalerta"
              class="form-select"
            >
              <option
                v-for="opt in tipos.identificacionalerta"
                :key="opt"
                :value="opt"
              >
                {{ opt }}
              </option>
            </select>

            <input
              v-else
              v-model="filtros.identificacionalerta"
              type="text"
              class="form-control"
              placeholder="Ingrese identificación manualmente"
            />
          </div>


        <!-- Activo -->
        <div class="mb-3" v-if="isVisible('nombreActivo')">
          <label class="form-label">Nombre Activo</label>
          <select v-model="filtros.nombreActivo" class="form-select">
            <option v-for="activo in activos" :key="activo" :value="activo">
              {{ activo }}
            </option>
          </select>
        </div>

        <!-- Proceso -->
        <div class="mb-3" v-if="isVisible('proceso')">
          <label class="form-label">Proceso</label>
          <select v-model="filtros.proceso" class="form-select">
            <option v-for="proceso in procesos" :key="proceso" :value="proceso">
              {{ proceso }}
            </option>
          </select>
        </div>

        <!-- Latencia -->
        <div class="mb-3" v-if="isVisible('latencia')">
          <label class="form-label">Latencia (ms)</label>

          <select
            v-if="tipos.latencia && tipos.latencia.length > 0"
            v-model="filtros.latencia"
            class="form-select"
          >
            <option
              v-for="opt in tipos.latencia"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>

          <input
            v-else
            v-model="filtros.latencia"
            type="number"
            step="0.01"
            class="form-control"
            placeholder="Ingrese valor manualmente"
          />
        </div>

        <!-- Tipo Servicio -->
        <div class="mb-3" v-if="isVisible('tipoServicio')">
          <label class="form-label">Tipo Servicio</label>

          <select
            v-if="tipos.tipoServicio && tipos.tipoServicio.length > 0"
            v-model="filtros.tipoServicio"
            class="form-select"
          >
            <option
              v-for="opt in tipos.tipoServicio"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>

          <input
            v-else
            v-model="filtros.tipoServicio"
            type="text"
            class="form-control"
            placeholder="Ingrese tipo manualmente"
          />
        </div>

        <!-- CI -->
        <div class="mb-3" v-if="isVisible('CI')">
          <label class="form-label">CI</label>

          <select
            v-if="tipos.CI && tipos.CI.length > 0"
            v-model="filtros.CI"
            class="form-select"
          >
            <option value="">Seleccionar</option>
            <option
              v-for="opt in tipos.CI"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>

          <input
            v-else
            v-model="filtros.CI"
            type="text"
            class="form-control"
            placeholder="Ingrese CI manualmente"
          />
        </div>

        <!-- Subtipo Servicio -->
        <div class="mb-3" v-if="isVisible('Subtiposervicio')">
          <label class="form-label">Subtipo Servicio</label>

          <select
            v-if="tipos.Subtiposervicio && tipos.Subtiposervicio.length > 0"
            v-model="filtros.Subtiposervicio"
            class="form-select"
          >
            <option
              v-for="opt in tipos.Subtiposervicio"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>

          <input
            v-else
            v-model="filtros.Subtiposervicio"
            type="text"
            class="form-control"
            placeholder="Ingrese subtipo manualmente"
          />
        </div>

        <!-- Jitter -->
        <div class="mb-3" v-if="isVisible('jitter')">
          <label class="form-label">Jitter</label>

          <select
            v-if="tipos.jitter && tipos.jitter.length > 0"
            v-model="filtros.jitter"
            class="form-select"
          >
            <option
              v-for="opt in tipos.jitter"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>

          <input
            v-else
            v-model="filtros.jitter"
            type="number"
            step="0.01"
            class="form-control"
            placeholder="Ingrese valor manualmente"
          />
        </div>

        <!-- Disponibilidad -->
        <div class="mb-3" v-if="isVisible('disponibilidad')">
          <label class="form-label">Disponibilidad (%)</label>

          <select
            v-if="tipos.disponibilidad && tipos.disponibilidad.length > 0"
            v-model="filtros.disponibilidad"
            class="form-select"
          >
            <option
              v-for="opt in tipos.disponibilidad"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>

          <input
            v-else
            v-model="filtros.disponibilidad"
            type="number"
            step="0.01"
            class="form-control"
            placeholder="Ingrese valor manualmente"
          />
        </div>


<!-- Packet Lost -->
<div class="mb-3" v-if="isVisible('packetlost')">
  <label class="form-label">Packet Lost (%)</label>

  <select
    v-if="tipos.packetlost && tipos.packetlost.length > 0"
    v-model="filtros.packetlost"
    class="form-select"
  >
    <option v-for="opt in tipos.packetlost" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.packetlost"
    type="number"
    step="0.01"
    class="form-control"
    placeholder="Ingrese valor manualmente"
  />
</div>

<!-- RSSI -->
<div class="mb-3" v-if="isVisible('rssi')">
  <label class="form-label">RSSI</label>

  <select
    v-if="tipos.rssi && tipos.rssi.length > 0"
    v-model="filtros.rssi"
    class="form-select"
  >
    <option v-for="opt in tipos.rssi" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.rssi"
    type="number"
    step="0.01"
    class="form-control"
    placeholder="Ingrese valor manualmente"
  />
</div>

<!-- NSR -->
<div class="mb-3" v-if="isVisible('nsr')">
  <label class="form-label">NSR</label>

  <select
    v-if="tipos.nsr && tipos.nsr.length > 0"
    v-model="filtros.nsr"
    class="form-select"
  >
    <option v-for="opt in tipos.nsr" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.nsr"
    type="number"
    step="0.01"
    class="form-control"
    placeholder="Ingrese valor manualmente"
  />
</div>

<!-- PLM -->
<div class="mb-3" v-if="isVisible('PLM')">
  <label class="form-label">PLM</label>

  <select
    v-if="tipos.PLM && tipos.PLM.length > 0"
    v-model="filtros.PLM"
    class="form-select"
  >
    <option v-for="opt in tipos.PLM" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.PLM"
    type="text"
    class="form-control"
    placeholder="Ingrese PLM manualmente"
  />
</div>

<!-- Tipo ExWa -->
<div class="mb-3" v-if="isVisible('tipoExWa')">
  <label class="form-label">Tipo ExWa</label>

  <select
    v-if="tipos.tipoExWa && tipos.tipoExWa.length > 0"
    v-model="filtros.tipoExWa"
    class="form-select"
  >
    <option v-for="opt in tipos.tipoExWa" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.tipoExWa"
    type="text"
    class="form-control"
    placeholder="Ingrese tipo manualmente"
  />
</div>

<!-- Código Evento -->
<div class="mb-3" v-if="isVisible('codigoEvento')">
  <label class="form-label">Código Evento</label>

  <select
    v-if="tipos.codigoEvento && tipos.codigoEvento.length > 0"
    v-model="filtros.codigoEvento"
    class="form-select"
  >
    <option v-for="opt in tipos.codigoEvento" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.codigoEvento"
    type="text"
    class="form-control"
    placeholder="Ingrese código manualmente"
  />
</div>

<!-- Descripción Evento -->
<div class="mb-3" v-if="isVisible('descripcionevento')">
  <label class="form-label">Descripción Evento</label>

  <select
    v-if="tipos.descripcionevento && tipos.descripcionevento.length > 0"
    v-model="filtros.descripcionevento"
    class="form-select"
  >
    <option
      v-for="opt in tipos.descripcionevento"
      :key="opt"
      :value="opt"
    >
      {{ opt }}
    </option>
  </select>

  <textarea
    v-else
    v-model="filtros.descripcionevento"
    class="form-control"
    placeholder="Ingrese descripción manualmente"
  ></textarea>
</div>

<!-- Origen -->
<div class="mb-3" v-if="isVisible('Origen')">
  <label class="form-label">Origen</label>

  <select
    v-if="tipos.Origen && tipos.Origen.length > 0"
    v-model="filtros.Origen"
    class="form-select"
  >
    <option v-for="opt in tipos.Origen" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.Origen"
    type="text"
    class="form-control"
    placeholder="Ingrese origen manualmente"
  />
</div>

<!-- Tipo Documento -->
<div class="mb-3" v-if="isVisible('tipodocumento')">
  <label class="form-label">Tipo Documento</label>

  <select
    v-if="tipos.tipodocumento && tipos.tipodocumento.length > 0"
    v-model="filtros.tipodocumento"
    class="form-select"
  >
    <option
      v-for="opt in tipos.tipodocumento"
      :key="opt"
      :value="opt"
    >
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.tipodocumento"
    type="text"
    class="form-control"
    placeholder="Ingrese tipo documento manualmente"
  />
</div>

<!-- Estado -->
<div class="mb-3" v-if="isVisible('estado')">
  <label class="form-label">Estado</label>

  <select
    v-if="tipos.estado && tipos.estado.length > 0"
    v-model="filtros.estado"
    class="form-select"
  >
    <option v-for="opt in tipos.estado" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.estado"
    type="text"
    class="form-control"
    placeholder="Ingrese estado manualmente"
  />
</div>

<!-- Resumen -->
<div class="mb-3" v-if="isVisible('resumen')">
  <label class="form-label">Resumen</label>

  <select
    v-if="tipos.resumen && tipos.resumen.length > 0"
    v-model="filtros.resumen"
    class="form-select"
  >
    <option v-for="opt in tipos.resumen" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <textarea
    v-else
    v-model="filtros.resumen"
    class="form-control"
    placeholder="Ingrese resumen manualmente"
  ></textarea>
</div>

<!-- Título -->
<div class="mb-3" v-if="isVisible('titulo')">
  <label class="form-label">Título</label>

  <select
    v-if="tipos.titulo && tipos.titulo.length > 0"
    v-model="filtros.titulo"
    class="form-select"
  >
    <option v-for="opt in tipos.titulo" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.titulo"
    type="text"
    class="form-control"
    placeholder="Ingrese título manualmente"
  />
</div>

<!-- Número -->
<div class="mb-3" v-if="isVisible('numero')">
  <label class="form-label">Número</label>

  <select
    v-if="tipos.numero && tipos.numero.length > 0"
    v-model="filtros.numero"
    class="form-select"
  >
    <option v-for="opt in tipos.numero" :key="opt" :value="opt">{{ opt }}</option>
  </select>

  <input
    v-else
    v-model="filtros.numero"
    type="text"
    class="form-control"
    placeholder="Ingrese número manualmente"
  />
</div>


        <!-- Fecha Estado -->
        <div class="mb-3" v-if="isVisible('fechaestado')">
          <label class="form-label">Fecha Estado</label>
          <input v-model="filtros.fechaestado" type="datetime-local" class="form-control" />
        </div>

<!-- Razón Estado -->
<div class="mb-3" v-if="isVisible('razonestado')">
  <label class="form-label">Razón Estado</label>

  <select
    v-if="tipos.razonestado && tipos.razonestado.length > 0"
    v-model="filtros.razonestado"
    class="form-select"
  >
    <option v-for="opt in tipos.razonestado" :key="opt" :value="opt">
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.razonestado"
    type="text"
    class="form-control"
    placeholder="Ingrese razón manualmente"
  />
</div>

<!-- GPS X -->
<div class="mb-3" v-if="isVisible('gpsx')">
  <label class="form-label">GPS X</label>

  <select
    v-if="tipos.gpsx && tipos.gpsx.length > 0"
    v-model="filtros.gpsx"
    class="form-select"
  >
    <option v-for="opt in tipos.gpsx" :key="opt" :value="opt">
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.gpsx"
    type="number"
    step="0.01"
    class="form-control"
    placeholder="Ingrese coordenada manualmente"
  />
</div>

<!-- GPS Y -->
<div class="mb-3" v-if="isVisible('gpsy')">
  <label class="form-label">GPS Y</label>

  <select
    v-if="tipos.gpsy && tipos.gpsy.length > 0"
    v-model="filtros.gpsy"
    class="form-select"
  >
    <option v-for="opt in tipos.gpsy" :key="opt" :value="opt">
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.gpsy"
    type="number"
    step="0.01"
    class="form-control"
    placeholder="Ingrese coordenada manualmente"
  />
</div>

<!-- GPS Z -->
<div class="mb-3" v-if="isVisible('gpsz')">
  <label class="form-label">GPS Z</label>

  <select
    v-if="tipos.gpsz && tipos.gpsz.length > 0"
    v-model="filtros.gpsz"
    class="form-select"
  >
    <option v-for="opt in tipos.gpsz" :key="opt" :value="opt">
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.gpsz"
    type="number"
    step="0.01"
    class="form-control"
    placeholder="Ingrese coordenada manualmente"
  />
</div>

<!-- GPS H -->
<div class="mb-3" v-if="isVisible('gpsh')">
  <label class="form-label">GPS H</label>

  <select
    v-if="tipos.gpsh && tipos.gpsh.length > 0"
    v-model="filtros.gpsh"
    class="form-select"
  >
    <option v-for="opt in tipos.gpsh" :key="opt" :value="opt">
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.gpsh"
    type="number"
    step="0.01"
    class="form-control"
    placeholder="Ingrese coordenada manualmente"
  />
</div>

<!-- Radio -->
<div class="mb-3" v-if="isVisible('radio')">
  <label class="form-label">Radio</label>

  <select
    v-if="tipos.radio && tipos.radio.length > 0"
    v-model="filtros.radio"
    class="form-select"
  >
    <option v-for="opt in tipos.radio" :key="opt" :value="opt">
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.radio"
    type="text"
    class="form-control"
    placeholder="Ingrese radio manualmente"
  />
</div>


<!-- Severidad -->
<div class="mb-3" v-if="isVisible('severidad')">
  <label class="form-label">Severidad</label>

  <select
    v-if="tipos.severidad && tipos.severidad.length > 0"
    v-model="filtros.severidad"
    class="form-select"
  >
    <option
      v-for="opt in tipos.severidad"
      :key="opt"
      :value="opt"
    >
      {{ opt }}
    </option>
  </select>

  <select
    v-else
    v-model="filtros.severidad"
    class="form-select"
  >
    <option value="Baja">Baja</option>
    <option value="Media">Media</option>
    <option value="Alta">Alta</option>
    <option value="Crítica">Crítica</option>
  </select>
</div>


<!-- Usuario -->
<div class="mb-3" v-if="isVisible('userid')">
  <label class="form-label">Usuario</label>

  <select
    v-if="tipos.userid && tipos.userid.length > 0"
    v-model="filtros.userid"
    class="form-select"
  >
    <option
      v-for="opt in tipos.userid"
      :key="opt"
      :value="opt"
    >
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.userid"
    type="text"
    class="form-control"
    placeholder="Ingrese usuario manualmente"
  />
</div>

<!-- Comentario -->
<div class="mb-3" v-if="isVisible('comentario')">
  <label class="form-label">Comentario</label>

  <select
    v-if="tipos.comentario && tipos.comentario.length > 0"
    v-model="filtros.comentario"
    class="form-select"
  >
    <option
      v-for="opt in tipos.comentario"
      :key="opt"
      :value="opt"
    >
      {{ opt }}
    </option>
  </select>

  <textarea
    v-else
    v-model="filtros.comentario"
    class="form-control"
    placeholder="Ingrese comentario manualmente"
  ></textarea>
</div>

<!-- Valida -->
<div class="mb-3" v-if="isVisible('valida')">
  <label class="form-label">Valida</label>
  <div class="form-check">
    <input
      v-model="filtros.valida"
      type="checkbox"
      class="form-check-input"
      id="validaCheck"
    />
    <label class="form-check-label" for="validaCheck">
      ¿Validada?
    </label>
  </div>
</div>

<!-- OT -->
<div class="mb-3" v-if="isVisible('OT')">
  <label class="form-label">OT</label>

  <select
    v-if="tipos.OT && tipos.OT.length > 0"
    v-model="filtros.OT"
    class="form-select"
  >
    <option
      v-for="opt in tipos.OT"
      :key="opt"
      :value="opt"
    >
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.OT"
    type="text"
    class="form-control"
    placeholder="Ingrese OT manualmente"
  />
</div>

<!-- Ticket -->
<div class="mb-3" v-if="isVisible('ticket')">
  <label class="form-label">Ticket</label>

  <select
    v-if="tipos.ticket && tipos.ticket.length > 0"
    v-model="filtros.ticket"
    class="form-select"
  >
    <option
      v-for="opt in tipos.ticket"
      :key="opt"
      :value="opt"
    >
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.ticket"
    type="text"
    class="form-control"
    placeholder="Ingrese ticket manualmente"
  />
</div>


        <!-- Fecha Reconocimiento -->
        <div class="mb-3" v-if="isVisible('fecha_reconocimiento')">
          <label class="form-label">Fecha Reconocimiento</label>
          <input v-model="filtros.fechaReconocimiento" type="datetime-local" class="form-control" />
        </div>

        <!-- Grupo Local -->
        <div class="mb-3" v-if="isVisible('grupo_local')">
          <label class="form-label">Grupo Local</label>
          <input v-model="filtros.grupoLocal" type="text" class="form-control" />
        </div>

<!-- Predicción -->
<div class="mb-3" v-if="isVisible('prediccion')">
  <label class="form-label">Predicción</label>

  <select
    v-if="tipos.prediccion && tipos.prediccion.length > 0"
    v-model="filtros.prediccion"
    class="form-select"
  >
    <option
      v-for="opt in tipos.prediccion"
      :key="opt"
      :value="opt"
    >
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.prediccion"
    type="text"
    class="form-control"
    placeholder="Ingrese predicción manualmente"
  />
</div>

<!-- Tiempo Reconocimiento -->
<div class="mb-3" v-if="isVisible('tiempo_reconocimiento')">
  <label class="form-label">Tiempo Reconocimiento (min)</label>

  <select
    v-if="tipos.tiempoReconocimiento && tipos.tiempoReconocimiento.length > 0"
    v-model="filtros.tiempoReconocimiento"
    class="form-select"
  >
    <option
      v-for="opt in tipos.tiempoReconocimiento"
      :key="opt"
      :value="opt"
    >
      {{ opt }}
    </option>
  </select>

  <input
    v-else
    v-model="filtros.tiempoReconocimiento"
    type="number"
    step="0.01"
    class="form-control"
    placeholder="Ingrese tiempo manualmente"
  />
</div>




    </div>


    <!-- 🔹 Fechas (solo se muestran si no está activo el checkbox) -->
    <div v-if="!filtros.alarmasActivas">
      <div class="mb-3">
        <label class="form-label">Fecha Inicio</label>
        <input v-model="filtros.fechaInicio" type="date" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Fecha Fin</label>
        <input v-model="filtros.fechaFin" type="date" class="form-control" />
      </div>
    </div>



    <div class="acciones">
      <button type="button" class="btn btn-secondary" @click="limpiar">Limpiar</button>
      <button type="submit" class="btn btn-primary">Buscar</button>
    </div>

    <!-- 🔹 Acciones -->
    <div class="acciones align-items-center">
      <!-- Checkbox Alarmas Activas -->
      <div class="form-check me-auto">
        <input
          v-model="filtros.alarmasActivas"
          type="checkbox"
          class="form-check-input"
          id="alarmasActivas"
        />
        <label class="form-check-label" for="alarmasActivas">
          Alertas Activas
        </label>
      </div>

    </div>
    
  </form>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import axios from "axios";


const mostrar = ref(true);  // ahora sí es reactivo

const emit = defineEmits(["filtrar"]);

const filtros = reactive({
  alarmasActivas: false,
  fechaInicio: "",
  fechaFin: "",
}); // 👈 todos los filtros dinámicos van acá


const procesos = ref([]);
const activos  = ref([]);

// array dinámico de campos visibles
const visibleFields = ref([]);
//función que busca un campo por nombre y devuelve su visible
const isVisible = (fieldName) => {
  const field = visibleFields.value.find(f => f.fieldName === fieldName)
  return field ? field.visible : false
}



const tipos = reactive({}); // aquí se guardan todas las listas devueltas por get-tipos

const loadData = async () => 
{
    const reqProcesos = axios.get("http://localhost:8080/api/alertas/get-procesos");
    const reqActivos  = axios.get("http://localhost:8080/api/alertas/get-activos");
    const reqTipos    = axios.get("http://localhost:8080/api/alertas/get-tipos");

    // ahora esperamos las TRES
    const [p1, p2, p3] = await Promise.allSettled([reqProcesos, reqActivos, reqTipos]);

    // Procesos
    if (p1.status === "fulfilled") 
    {
      procesos.value = p1.value?.data || [];
      
    } 
    else 
    {
      const msg = errMsg(p1.reason, "Error al obtener procesos");
      alert(`❌ ${msg}`);
      console.error("Error get-procesos:", p1.reason);
    }

    // Activos
    if (p2.status === "fulfilled") 
    {
      activos.value = p2.value?.data || [];
    } 
    else 
    {
      const msg = errMsg(p2.reason, "Error al obtener activos");
      alert(`❌ ${msg}`);
      console.error("Error get-activos:", p2.reason);
    }


      // 🔵 TIPOS (nuevo)
    if (p3.status === "fulfilled") 
    {
      const dataTipos = p3.value?.data || {};
      console.log("ESTOS SON LOS TIPOS :",dataTipos)
      // Mezcla todo lo que venga (procesos, nombreActivo, severidad, etc.)
      Object.assign(tipos, dataTipos);
    } 
    else 
    {
      const msg = errMsg(p3.reason, "Error al obtener tipos");
      alert(`❌ ${msg}`);
      console.error("Error get-tipos:", p3.reason);
    }


  try {
    const responseAllVisibleColumnsToFilter = await axios.get("http://localhost:8080/api/visible-fields-filter/get-all");
    const data = responseAllVisibleColumnsToFilter.data;

    // Transforma objeto plano en array {fieldName, visible}
    visibleFields.value = Object.entries(data).map(([key, value]) => ({
      fieldName: key,
      visible: value
    }));

  } catch (error) {
    console.error("Error cargando configuración de campos:", error);
  }

}


// Helper para extraer mensaje de error del backend/axios
const errMsg = (err, fallback) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  fallback ||
  "Error desconocido";

// Enviar filtros al padre (la vista) -> la vista los pasa a GoogleMap via :filtros
// Convierte datetime-local a ISO8601
// Helper que mantiene el formato que esperas
const toISO = (val) => {
  if (!val) return "";
  const d = new Date(val);
  // si viene tipo "2025-10-15" (solo fecha), devolvemos sin hora
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return val; // 👈 mantiene formato YYYY-MM-DD
  }
  // si viene datetime-local, convertimos a ISO completo
  return isNaN(d.getTime()) ? "" : d.toISOString();
};

// Emite solo los filtros que tienen valor
const emitirFiltros = () => {
  const filtrosLlenos = {};

  const camposFecha = [
    "inicioevento",
    "fechaestado",
    "fechaReconocimiento",
    "fechaInicio",
    "fechaFin",
  ];

  Object.entries(filtros).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) return;

    if (camposFecha.includes(key)) {
      // aplica el formato correcto (mantiene YYYY-MM-DD)
      filtrosLlenos[key] = toISO(value);
    } else {
      filtrosLlenos[key] = value;
    }
  });

  console.log("📤 Filtros enviados:", filtrosLlenos);
  emit("filtrar", filtrosLlenos);
};


// Limpia todos los campos visibles
const limpiar = () => {
  //Object.keys(filtros).forEach(key => filtros[key] = "");


    // Guarda las fechas antes de limpiar
  const fechaInicioTemp = filtros.fechaInicio;
  const fechaFinTemp = filtros.fechaFin;

  // Limpia todos los campos excepto los que queremos mantener
  Object.keys(filtros).forEach(key => {
    if (key !== "fechaInicio" && key !== "fechaFin" && key !== "alarmasActivas") {
      filtros[key] = "";
    }
  });

  // Restaura los valores de fecha
  filtros.fechaInicio = fechaInicioTemp;
  filtros.fechaFin = fechaFinTemp;

  emitirFiltros();

};

onMounted(async () => {
  loadData();

});



// 🔹 Reacciona cuando se activa/desactiva el checkbox "Alertas Activas"
watch(
  () => filtros.alarmasActivas,
  (nuevoValor) => {
    // Si se activa, limpiamos fechas para evitar conflicto
    if (nuevoValor) {
      filtros.fechaInicio = "";
      filtros.fechaFin = "";
    }

    // Emitimos inmediatamente los filtros actualizados
    emitirFiltros();
  }
);

</script>

<style scoped>
.filtro-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.acciones {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}
.btn {
  cursor: pointer;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
