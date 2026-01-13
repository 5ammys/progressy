export type EstadoMateria = 'pendiente' | 'cursando' | 'regularizada' | 'aprobada';

export interface Materia {
  id: number;             
  nombre: string;         
  cargaHoraria: number;   
  anio: number;
  correlativas: number[]; 
  estado: EstadoMateria;  
  nota: number | null;    
  formaAprobacion: FormaAprobacion | null;
}

export interface MetricasCarrera {
  promedio: number;
  avancePorcentaje: number;
  materiasAprobadas: number;
  totalMaterias: number;
}

export type FormaAprobacion = "Promocion" | "Final" | "Libre";
