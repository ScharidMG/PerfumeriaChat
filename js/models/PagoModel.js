// ══════════════════════════════════════════════
//  js/models/PagoModel.js
//  Responsabilidad: datos de Medios de Pago
//  - Obtiene datos desde SheetsAPI
//  - Transforma al formato que necesita el chat
//  - Mantiene caché para evitar peticiones extra
// ══════════════════════════════════════════════

import { SheetsAPI } from '../services/SheetsAPI.js';

let _cache = null;

export const PagoModel = {

  async getAll() {
    if (_cache) return _cache;
    const rows = await SheetsAPI.readGviz('pagos');
    if (!rows || rows.length < 2) {
      _cache = [];
      return _cache;
    }
    _cache = rows
      .slice(1)
      .map(r => ({
        medio:  (r[0] || '').trim(),
        detalle:(r[1] || '').trim()
      }))
      .filter(p => p.medio);
    return _cache;
  },

  // Formatea todos los pagos como texto listo
  // para mostrar en el chat, sin que el
  // controlador sepa cómo se estructura cada uno
  async getFormattedText() {
    const all = await this.getAll();
    if (all.length === 0) {
      return 'No hay medios de pago configurados.\nContacta a un asesor para más información.';
    }
    return all.map(p => `💳 ${p.medio}\n${p.detalle}`).join('\n\n');
  },

  invalidate() {
    _cache = null;
  }
};