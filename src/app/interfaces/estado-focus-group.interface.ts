// modelos/estado-focus-group.interface.ts

import { FocusGroup } from './focus-group.interface';

export interface EstadoFocusGroup {
  modalCrearAbierto: boolean;
  modalEditarAbierto: boolean;
  focusSeleccionado: FocusGroup | null;
}
