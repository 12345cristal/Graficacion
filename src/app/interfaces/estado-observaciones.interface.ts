// modelos/estado-observaciones.interface.ts

import { Observacion } from './observacion.interface';

export interface EstadoObservaciones {
  modalCrearAbierto: boolean;
  modalEditarAbierto: boolean;
  observacionSeleccionada: Observacion | null;
}
