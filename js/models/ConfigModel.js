// ══════════════════════════════════════════════
//  js/models/ConfigModel.js
//  Responsabilidad: configuración del negocio
//  - Número de WhatsApp del asesor
//  - Construye las URLs de WhatsApp listas
//    para usar, sin que nadie más sepa
//    cómo se forma un enlace wa.me
// ══════════════════════════════════════════════

import { SheetsAPI } from '../services/SheetsAPI.js';
import { WA_MSG_CLIENTE, WA_MSG_MAYORISTA } from '../config.js';

let _cache = null;

export const ConfigModel = {

  // Devuelve el número limpio (solo dígitos)
  async getNumero() {
    if (_cache) return _cache;
    const rows = await SheetsAPI.readGviz('config');
    if (!rows || rows.length < 2) {
      _cache = '';
      return _cache;
    }
    // Fila 1 (índice 1) porque fila 0 son cabeceras
    const raw = (rows[1][0] || '').trim();
    _cache = raw.replace(/\D/g, '');
    return _cache;
  },

  // Construye la URL de WhatsApp con el mensaje
  // que corresponda según el tipo de contacto
  async getWhatsAppURL(tipo = 'cliente') {
    const numero  = await this.getNumero();
    const mensaje = tipo === 'mayorista'
      ? WA_MSG_MAYORISTA
      : WA_MSG_CLIENTE;
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  },

  // Devuelve ambos mensajes WA listos para
  // renderizar el botón en la vista
  async getClienteWA() {
    return {
      mensaje: WA_MSG_CLIENTE,
      url:     await this.getWhatsAppURL('cliente')
    };
  },

  async getMayoristaWA() {
    return {
      mensaje: WA_MSG_MAYORISTA,
      url:     await this.getWhatsAppURL('mayorista')
    };
  },

  invalidate() {
    _cache = null;
  }
};