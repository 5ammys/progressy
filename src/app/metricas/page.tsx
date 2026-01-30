"use client";
import { useAcademicStore } from "@/store/useAcademicStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function MetricasPage() {
  const {
    getPromedioPonderado,
    getApprovalMethodStats,
    getProgresoEstadistico: getProgressStats,
    getEstadisticasAnuales: getYearStats
  } = useAcademicStore();

  const promedioPonderado = getPromedioPonderado();
  const approvalStats = getApprovalMethodStats();
  const progressStats = getProgressStats();

  const pieData = [
    { name: 'Promoción', value: approvalStats.Promocion, color: '#10b981' },
    { name: 'Final', value: approvalStats.Final, color: '#a855f7' },
    { name: 'Libre', value: approvalStats.Libre, color: '#3b82f6' },
  ].filter(item => item.value > 0);

  const yearData = [1, 2, 3, 4, 5].map(year => {
    const stats = getYearStats(year);
    return {
      year: `${year}° Año`,
      total: stats.total,
      aprobadas: stats.aprobadas,
      promedio: stats.promedio,
    };
  }).filter(item => item.total > 0);

  const progressPercentage = progressStats.total > 0
    ? ((progressStats.aprobadas / progressStats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden p-4 md:p-8 md:max-w-7xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-300">Métricas Académicas</h1>
        <p className="text-slate-500 mt-2">Visualiza tu progreso y estadísticas de la carrera</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

        <div className="bg-gray-800 border border-slate-400 rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Promedio Ponderado
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-emerald-400">
              {promedioPonderado.toFixed(2)}
            </span>
            <span className="text-xl text-slate-500">/10</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Calculado con {progressStats.aprobadas} materias aprobadas
          </p>
        </div>

        <div className="bg-gray-800 border border-slate-400 rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Progreso General
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-indigo-400">
              {progressPercentage}%
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Aprobadas:</span>
              <span className="text-emerald-400 font-semibold">{progressStats.aprobadas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Cursando:</span>
              <span className="text-blue-400 font-semibold">{progressStats.cursando}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Regularizadas:</span>
              <span className="text-purple-400 font-semibold">{progressStats.regularizadas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pendientes:</span>
              <span className="text-slate-500 font-semibold">{progressStats.pendientes}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-slate-400 rounded-xl p-6 shadow-lg overflow-hidden min-w-0">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Total de Materias
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-slate-300">
              {progressStats.total}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {progressStats.aprobadas} de {progressStats.total} completadas
          </p>

          <div className="mt-4 bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-linear-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        <div className="bg-gray-800 border border-slate-400 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-300 mb-4">
            Formas de Aprobación
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    if (percent === undefined || name === undefined) return '';
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#cccccc',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#90ee32'
                  }}
                />
                <Legend
                  wrapperStyle={{ color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500">
              No hay materias aprobadas aún
            </div>
          )}
        </div>

        <div className="bg-gray-800 border border-slate-400 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-300 mb-4">
            Progreso por Año
          </h3>
          {yearData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="total" fill="#64748b" name="Total" />
                <Bar dataKey="aprobadas" fill="#10b981" name="Aprobadas" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500">
              No hay datos disponibles
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 border border-slate-400 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-400">
          <h3 className="text-lg font-semibold text-slate-300">
            Desglose Detallado por Año
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 border-b border-slate-400 text-xs uppercase tracking-wider text-slate-200 font-semibold">
                <th className="p-4">Año</th>
                <th className="p-4">Total Materias</th>
                <th className="p-4">Aprobadas</th>
                <th className="p-4">Progreso</th>
                <th className="p-4">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500">
              {[1, 2, 3, 4, 5].map((year) => {
                const stats = getYearStats(year);
                if (stats.total === 0) return null;

                const yearProgress = ((stats.aprobadas / stats.total) * 100).toFixed(0);

                return (
                  <tr key={year} className="hover:bg-gray-700 transition-colors duration-150">
                    <td className="p-4">
                      <span className="font-medium text-slate-200">{year}° Año</span>
                    </td>
                    <td className="p-4 text-slate-300">{stats.total}</td>
                    <td className="p-4 text-emerald-400 font-semibold">{stats.aprobadas}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden max-w-[120px]">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-500"
                            style={{ width: `${yearProgress}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-400 min-w-[45px]">{yearProgress}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {stats.promedio !== null ? (
                        <span className="text-indigo-400 font-semibold">
                          {stats.promedio.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
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
