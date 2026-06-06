// ══════════════════════════════════════════════
//  js/models/FAQModel.js
//  Responsabilidad: datos de Preguntas Frecuentes
//  - Obtiene datos desde SheetsAPI
//  - Transforma al formato que necesita el chat
//  - Mantiene caché para evitar peticiones extra
// ══════════════════════════════════════════════

import { SheetsAPI } from '../services/SheetsAPI.js';

// Estado interno del modelo
let _cache = null;

export const FAQModel = {

  // Obtiene todas las FAQs
  // Si ya las cargó antes, devuelve la caché
  async getAll() {
    if (_cache) return _cache;
    const rows = await SheetsAPI.readGviz('faq');
    if (!rows || rows.length < 2) {
      _cache = [];
      return _cache;
    }
    // Salta la fila 0 (cabeceras)
    _cache = rows
      .slice(1)
      .map(r => ({
        pregunta:  (r[0] || '').trim(),
        respuesta: (r[1] || '').trim()
      }))
      .filter(f => f.pregunta && f.respuesta);
    return _cache;
  },

  // Obtiene una FAQ por índice (base 0)
  async getByIndex(index) {
    const all = await this.getAll();
    return all[index] || null;
  },

  // Limpia la caché para forzar recarga
  // Se llama desde el admin después de un CRUD
  invalidate() {
    _cache = null;
  }
};