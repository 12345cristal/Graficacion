// modelos/historia-usuario.interface.ts

export interface HistoriaUsuario {
  id: string;
  rol: string;
  funcionalidad: string;
  beneficio: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  estado: 'Pendiente' | 'En Progreso' | 'Completada';
  criteriosAceptacion: string;
}
