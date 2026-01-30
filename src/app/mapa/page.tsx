"use client";
import { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAcademicStore } from '@/store/useAcademicStore';

export default function MapaPage() {
  const { materias, obtenerEstadoVisual: getVisualState } = useAcademicStore();

  // Creacion de nodos y aristas
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Grupo de materias por año
    const materiasByYear: { [key: number]: typeof materias } = {};
    materias.forEach(materia => {
      if (!materiasByYear[materia.anio]) {
        materiasByYear[materia.anio] = [];
      }
      materiasByYear[materia.anio].push(materia);
    });

    const nodeSpacingX = 300;
    const nodeSpacingY = 120;
    const maxSubjectsPerColumn = 7;
    const startX = 0;

    let currentColumnIndex = 0;

    Object.entries(materiasByYear).forEach(([year, materiasInYear]) => {
      const yearNum = parseInt(year);

      const chunks: typeof materiasInYear[] = [];
      for (let i = 0; i < materiasInYear.length; i += maxSubjectsPerColumn) {
        chunks.push(materiasInYear.slice(i, i + maxSubjectsPerColumn));
      }

      chunks.forEach((chunk, chunkIndex) => {
        const xPosition = startX + currentColumnIndex * nodeSpacingX;

        const totalHeight = (chunk.length - 1) * nodeSpacingY;
        const startY = -totalHeight / 2;

        chunk.forEach((materia, index) => {
          const yPosition = startY + index * nodeSpacingY;
          const estadoVisual = getVisualState(materia.id);

          const colorMap = {
            verde: { bg: '#10b981', border: '#059669', text: '#ffffff' },
            azul: { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' },
            naranja: { bg: '#f59e0b', border: '#d97706', text: '#ffffff' },
            gris: { bg: '#64748b', border: '#475569', text: '#e2e8f0' },
          };

          const colors = colorMap[estadoVisual];

          nodes.push({
            id: materia.id.toString(),
            type: 'default',
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            position: { x: xPosition, y: yPosition },
            data: {
              label: (
                <div className="text-center">
                  <div className="font-semibold text-base">{materia.nombre}</div>
                  <div className="text-sm mt-1 opacity-80">
                    {materia.anio}° Año | {materia.cargaHoraria}hs
                  </div>
                  {materia.nota && (
                    <div className="text-md mt-1 font-bold">
                      Nota: {materia.nota}
                    </div>
                  )}
                </div>
              ),
            },
            style: {
              background: colors.bg,
              color: colors.text,
              border: `2px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '12px',
              width: 200,
              fontSize: '12px',
            },
          });

          materia.correlativas.forEach(correlativaId => {
            edges.push({
              id: `e-${correlativaId}-${materia.id}`,
              source: correlativaId.toString(),
              target: materia.id.toString(),
              type: 'straight',
              animated: false,
              style: { stroke: '#64748b', strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#64748b',
              },
            });
          });
        });

        currentColumnIndex++;
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [materias, getVisualState]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-screen bg-gray-900 relative">

      <div className="absolute top-0 left-0 right-0 z-10 bg-gray-800/95 border-b border-slate-400 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-300">Mapa de Correlatividades</h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualización interactiva de las dependencias entre materias
          </p>
        </div>
      </div>


      <div className="absolute bottom-4 left-4 z-10 hidden md:block bg-gray-800/95 border border-slate-400 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-300 mb-3">Leyenda</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: '#10b981' }}></div>
            <span className="text-base text-slate-300">Aprobada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: '#3b82f6' }}></div>
            <span className="text-base text-slate-300">Cursando</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: '#f59e0b' }}></div>
            <span className="text-base text-slate-300">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: '#64748b' }}></div>
            <span className="text-base text-slate-300">Bloqueada</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[100dvh] pt-20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 25, y: 220, zoom: 0.4 }}
        >
          <Background color="#475569" gap={16} />
          <Controls position="top-right" className="bg-gray-800 border border-slate-400 text-white" />
          <MiniMap
            position="bottom-right"
            className="bg-gray-800 border border-slate-400"
            nodeColor={(node) => {
              const style = node.style as { background?: string };
              return style?.background || '#64748b';
            }}
            maskColor="rgba(0, 0, 0, 0.6)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
