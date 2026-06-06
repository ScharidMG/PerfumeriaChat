// ══════════════════════════════════════════════
//  js/config.js
//  Constantes globales del proyecto
//  ⚠️ Único lugar donde cambiar URLs y claves
// ══════════════════════════════════════════════

// ── API ───────────────────────────────────────
export const API_URL = 'https://script.google.com/macros/s/AKfycbxCeTcwkqoNSmbo5ZzV6yrGLpQQQcFo_XPSXHgyVBGiui9VIH2Qtv25puhnVxFs-NeiCA/exec';

// ── Google Sheets (lectura directa sin API key) ──
export const SHEETS_ID = '1Em_rLq2qfIloRVBBhzS0PbGCp-nlpLBMLh5qZBWbkzg';
export const SHEET_GIDS = {
  faq:       '326911256',
  pagos:     '1467806632',
  promos:    '653912710',
  mayorista: '188485634',
  config:    '863906925'
};

// ── WhatsApp ──────────────────────────────────
export const WA_MSG_CLIENTE    = 'Hola, me interesa recibir asesoría de SAOCO PERFUMES.';
export const WA_MSG_MAYORISTA  = 'Hola, soy cliente MAYORISTA y me interesa recibir información sobre compras al por mayor en SAOCO PERFUMES.';

// ── LocalStorage keys ─────────────────────────
export const LS_STATE = 'saoco_state';
export const LS_MSGS  = 'saoco_messages';
export const LS_THEME = 'saoco_theme';

// ── Admin ─────────────────────────────────────
export const ADMIN_PASSWORD = 'adminperfum123';
export const LS_AUTH        = 'saoco_admin_auth';
