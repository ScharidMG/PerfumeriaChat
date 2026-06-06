// ══════════════════════════════════════════════
//  js/models/PromoModel.js
//  Responsabilidad: datos de Promociones
//  - Obtiene datos desde SheetsAPI
//  - Transforma al formato que necesita el chat
//  - Construye la secuencia de mensajes lista
//    para que el controlador solo la ejecute
// ══════════════════════════════════════════════

import { SheetsAPI } from '../services/SheetsAPI.js';

let _cache = null;

export const PromoModel = {

  async getAll() {
    if (_cache) return _cache;
    const rows = await SheetsAPI.readGviz('promos');
    if (!rows || rows.length < 2) {
      _cache = [];
      return _cache;
    }
    _cache = rows
      .slice(1)
      .map(r => ({
        titulo:      (r[0] || '').trim(),
        descripcion: (r[1] || '').trim(),
        imagen:      (r[2] || '').trim()
      }))
      .filter(p => p.titulo);
    return _cache;
  },

  // Devuelve la secuencia de mensajes lista para
  // botSaySequence(). El controlador no necesita
  // saber cómo se arma cada bloque de promo.
  async getMessageSequence() {
    const all = await this.getAll();
    if (all.length === 0) return null;

    const sequence = [];
    all.forEach(promo => {
      sequence.push({
        text:  `🎁 ${promo.titulo}`,
        delay: 600
      });
      if (promo.imagen) {
        sequence.push({
          text:    `https://lh3.googleusercontent.com/d/${promo.imagen}`,
          delay:   300,
          isImage: true
        });
      }
      sequence.push({
        text:  promo.descripcion,
        delay: 400
      });
    });
    return sequence;
  },

  invalidate() {
    _cache = null;
  }
};