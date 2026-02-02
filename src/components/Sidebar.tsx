"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, GitGraph, GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Plan de Estudios", icon: BookOpen, path: "/materias" },
  { name: "Metricas", icon: LayoutDashboard, path: "/metricas" },
  { name: "Mapa de Correlatividades", icon: GitGraph, path: "/mapa" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-slate-800 text-white rounded-lg lg:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>


      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <GraduationCap className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="font-bold text-xl leading-tight text-white">
              Gradual
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)} // Cerrar sidebar al hacer clic
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 text-xs text-slate-500 text-center border-t border-slate-800">
          v1.0.0 - @2026 Samuel Mendez
        </div>
      </aside>
    </>
  );
}