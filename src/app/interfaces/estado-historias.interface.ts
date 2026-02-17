// modelos/estado-historias.interface.ts

import { HistoriaUsuario } from './historia-usuario.interface';

export interface EstadoHistorias {
  modalCrearAbierto: boolean;
  modalEditarAbierto: boolean;
  historiaSeleccionada: HistoriaUsuario | null;
}
