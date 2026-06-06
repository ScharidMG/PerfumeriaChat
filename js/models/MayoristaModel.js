// ══════════════════════════════════════════════
//  js/models/MayoristaModel.js
//  Responsabilidad: datos de Imágenes Mayorista
//  - Obtiene IDs desde SheetsAPI
//  - Construye las URLs de Google Drive
//  - Prepara la secuencia de imágenes para
//    el chat lista para que el controlador
//    solo la ejecute
// ══════════════════════════════════════════════

import { SheetsAPI } from '../services/SheetsAPI.js';

let _cache = null;

export const MayoristaModel = {

  // Devuelve array de URLs de imágenes
  async getImagenes() {
    if (_cache) return _cache;
    const rows = await SheetsAPI.readGviz('mayorista');
    if (!rows || rows.length < 2) {
      _cache = [];
      return _cache;
    }
    _cache = rows
      .slice(1)
      .map(r => (r[0] || '').trim())
      .filter(id => id)
      .map(id => `https://lh3.googleusercontent.com/d/${id}`);
    return _cache;
  },

  // Devuelve la secuencia de mensajes de imágenes
  // lista para botSaySequence()
  async getImageSequence() {
    const imagenes = await this.getImagenes();
    if (imagenes.length === 0) return [];
    return imagenes.map(url => ({
      text:    url,
      delay:   600,
      isImage: true
    }));
  },

  invalidate() {
    _cache = null;
  }
};