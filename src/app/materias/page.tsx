"use client";
import { useState } from "react";
import { useAcademicStore } from "@/store/useAcademicStore";
import { EstadoMateria, FormaAprobacion } from "@/types";

export default function MateriasPage() {
  const { materias, actualizarMateria } = useAcademicStore();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filteredMaterias = selectedYear
    ? materias.filter(materia => materia.anio === selectedYear)
    : materias;

  return (
    <div className="p-8 max-w-6xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-300">Programa de la Carrera</h1>
        <p className="text-slate-500 mt-2">Gestiona el estado de tus materias, notas y formas de aprobación.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedYear(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedYear === null
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-400'
            : 'bg-gray-700 text-slate-300 hover:bg-gray-600 border border-slate-500'
            }`}
        >
          Todos
        </button>
        {[1, 2, 3, 4, 5].map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedYear === year
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-400'
              : 'bg-gray-700 text-slate-300 hover:bg-gray-600 border border-slate-500'
              }`}
          >
            {year}° Año
          </button>
        ))}
      </div>

      <div className="bg-gray-800 border border-slate-400 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 border-b border-slate-400 text-xs uppercase tracking-wider text-slate-200 font-semibold">

                <th className="p-4">Materia</th>
                <th className="p-4 w-40">Estado</th>
                <th className="p-4 w-24">Nota</th>
                <th className="p-4 w-40">Forma Aprob.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500">
              {filteredMaterias.map((materia) => {
                const isAprobada = materia.estado === 'aprobada';
                const isRegular = materia.estado === 'regularizada';

                return (
                  <tr key={materia.id} className="hover:bg-gray-700 transition-colors duration-150">
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{materia.nombre}</div>
                      <div className="text-xs text-slate-400 mt-0.5">ID: {materia.id}</div>
                    </td>

                    <td className="p-4">
                      <select
                        value={materia.estado}
                        onChange={(e) =>
                          actualizarMateria(materia.id, {
                            estado: e.target.value as EstadoMateria,
                          })
                        }
                        className={`w-full p-2 rounded-lg text-sm font-medium border-0 ring-1 ring-inset cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-800 bg-slate-900
                          ${materia.estado === 'aprobada' ?
                            'bg-emerald-900/30 text-emerald-300 ring-emerald-600/20' :
                            materia.estado === 'cursando' ? 'bg-blue-900/30 text-blue-200 ring-blue-700/10' :
                              materia.estado === 'regularizada' ? 'bg-purple-900/30 text-purple-200 ring-purple-700/10' :
                                'bg-slate-100 text-slate-600 ring-slate-500/10'
                          }`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="cursando">Cursando</option>
                        <option value="regularizada">Regularizada</option>
                        <option value="aprobada">Aprobada</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <input
                        type="number"
                        min={
                          isAprobada
                            ? (materia.formaAprobacion === 'Promocion' ? "7" : "4")
                            : isRegular ? "4" : "1"
                        }
                        max={
                          isAprobada
                            ? (materia.formaAprobacion === 'Promocion' ? "10" : "8")
                            : isRegular ? "6" : "10"
                        }
                        disabled={!isAprobada && !isRegular}
                        value={materia.nota || ''}
                        onChange={(e) => {
                          const valorInput = e.target.value;

                          if (valorInput === '') {
                            actualizarMateria(materia.id, { nota: null });
                            return;
                          }

                          const numero = parseFloat(valorInput);

                          // Define rangos según el estado y forma de aprobación
                          let minNota = 0;
                          let maxNota = 10;

                          if (isAprobada) {
                            if (materia.formaAprobacion === 'Promocion') {
                              minNota = 7;
                              maxNota = 10;
                            } else if (materia.formaAprobacion === 'Final' || materia.formaAprobacion === 'Libre') {
                              minNota = 4;
                              maxNota = 8;
                            } else {
                              // Si está aprobada pero aún no tiene forma de aprobación seleccionada
                              minNota = 4;
                              maxNota = 10;
                            }
                          } else if (isRegular) {
                            minNota = 4;
                            maxNota = 6;
                          }

                          if (!isNaN(numero) && numero >= minNota && numero <= maxNota) {
                            actualizarMateria(materia.id, { nota: numero });
                          }
                        }}
                        className="w-full p-2 text-center rounded-lg border border-slate-400 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-800 disabled:text-slate-300 transition-all"
                        placeholder="-"
                      />
                    </td>

                    <td className="p-4">
                      <select
                        disabled={!isAprobada}
                        value={materia.formaAprobacion || ''}
                        onChange={(e) =>
                          actualizarMateria(materia.id, {
                            formaAprobacion: e.target.value as FormaAprobacion,
                          })
                        }
                        className={`w-full p-2 rounded-lg border text-sm transition-all
                            focus:outline-none focus:ring-2 focus:ring-indigo-500
                        ${!isAprobada
                            ? 'bg-slate-800 text-slate-400 border-slate-600 cursor-not-allowed'
                            : materia.formaAprobacion === 'Promocion'
                              ? 'bg-slate-900 text-emerald-300 border-emerald-600/30'
                              : materia.formaAprobacion === 'Libre'
                                ? 'bg-slate-900 text-blue-300 border-blue-600/30'
                                : materia.formaAprobacion === 'Final'
                                  ? 'bg-slate-900 text-purple-300 border-purple-600/30'
                                  : 'bg-slate-900 text-slate-200 border-slate-600'
                          }
                        `}
                      >
                        <option value="pendiente">Seleccionar...</option>
                        <option value="Promocion">Promoción</option>
                        <option value="Final">Final</option>
                        <option value="Libre">Libre</option>
                      </select>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}