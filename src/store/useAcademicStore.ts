import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Materia } from '@/types';
import { PLAN_ESTUDIOS_INICIAL } from '@/data/plan-de-estudio';

interface AcademicState {
  materias: Materia[];

  actualizarMateria: (id: number, cambios: Partial<Materia>) => void;

  obtenerEstadoVisual: (id: number) => 'verde' | 'naranja' | 'gris' | 'azul';

  getPromedioPonderado: () => number;

  getApprovalMethodStats: () => {
    Promocion: number;
    Final: number;
    Libre: number
  };

  getProgresoEstadistico: () => {
    total: number;
    aprobadas: number;
    cursando: number;
    regularizadas: number;
    pendientes: number
  };

  getEstadisticasAnuales: (year: number) => {
    total: number;
    aprobadas: number;
    promedio: number | null;
  };
}

export const useAcademicStore = create<AcademicState>()(
  persist(
    (set, get) => ({
      materias: PLAN_ESTUDIOS_INICIAL,

      actualizarMateria: (id, cambios) => {
        set((state) => ({
          materias: state.materias.map((m) => {
            if (m.id !== id) return m;

            const nuevaMateria = { ...m, ...cambios };
            if (cambios.estado && cambios.estado !== 'aprobada') {
              if (cambios.estado == 'regularizada') {
                nuevaMateria.formaAprobacion = null;
                return nuevaMateria;
              }
              nuevaMateria.formaAprobacion = null;
              nuevaMateria.nota = null;
            }

            return nuevaMateria;
          }),
        }));
      },

      obtenerEstadoVisual: (id) => {
        const state = get();
        const materia = state.materias.find((m) => m.id === id);
        if (!materia) return 'gris';

        if (materia.estado === 'aprobada') return 'verde';

        if (materia.estado === 'cursando') return 'azul';

        if (materia.estado === 'pendiente') {
          const correlativas = materia.correlativas;

          if (correlativas.length === 0) return 'naranja';

          const correlativasAprobadas = correlativas.every((corrId) => {
            const corrMateria = state.materias.find((m) => m.id === corrId);
            return corrMateria?.estado === 'aprobada';
          });

          if (correlativasAprobadas) return 'naranja';
        }

        return 'gris';
      },

      getPromedioPonderado: () => {
        const state = get();
        const materiasAprobadas = state.materias.filter(
          (m) => m.estado === 'aprobada' && m.nota !== null
        );

        if (materiasAprobadas.length === 0) return 0;

        const sumaNotasCreditos = materiasAprobadas.reduce(
          (sum, m) => sum + (m.nota! * m.cargaHoraria),
          0
        );
        const sumaCreditos = materiasAprobadas.reduce(
          (sum, m) => sum + m.cargaHoraria,
          0
        );

        return sumaCreditos > 0 ? sumaNotasCreditos / sumaCreditos : 0;
      },

      getApprovalMethodStats: () => {
        const state = get();
        const materiasAprobadas = state.materias.filter(
          (m) => m.estado === 'aprobada' && m.formaAprobacion
        );

        return {
          Promocion: materiasAprobadas.filter((m) => m.formaAprobacion === 'Promocion').length,
          Final: materiasAprobadas.filter((m) => m.formaAprobacion === 'Final').length,
          Libre: materiasAprobadas.filter((m) => m.formaAprobacion === 'Libre').length,
        };
      },

      getProgresoEstadistico: () => {
        const state = get();
        return {
          total: state.materias.length,
          aprobadas: state.materias.filter((m) => m.estado === 'aprobada').length,
          cursando: state.materias.filter((m) => m.estado === 'cursando').length,
          regularizadas: state.materias.filter((m) => m.estado === 'regularizada').length,
          pendientes: state.materias.filter((m) => m.estado === 'pendiente').length,
        };
      },

      getEstadisticasAnuales: (year: number) => {
        const state = get();
        const materiasDelAnio = state.materias.filter((m) => m.anio === year);
        const aprobadasDelAnio = materiasDelAnio.filter(
          (m) => m.estado === 'aprobada' && m.nota !== null
        );

        let promedio: number | null = null;
        if (aprobadasDelAnio.length > 0) {
          const sumaNotasCreditos = aprobadasDelAnio.reduce(
            (sum, m) => sum + (m.nota! * m.cargaHoraria),
            0
          );
          const sumaCreditos = aprobadasDelAnio.reduce(
            (sum, m) => sum + m.cargaHoraria,
            0
          );
          promedio = sumaCreditos > 0 ? sumaNotasCreditos / sumaCreditos : null;
        }

        return {
          total: materiasDelAnio.length,
          aprobadas: aprobadasDelAnio.length,
          promedio,
        };
      },
    }),
    {
      name: 'academic-storage', // Clave del localstorage
    }
  )
);