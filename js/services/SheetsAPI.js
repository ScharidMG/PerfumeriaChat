// ══════════════════════════════════════════════
//  js/services/SheetsAPI.js
//  Capa de comunicación con Google
//  - Lee via gviz/tq (sin API key) → para el chat
//  - Escribe via Apps Script → para el admin
// ══════════════════════════════════════════════

import { API_URL, SHEETS_ID, SHEET_GIDS } from '../config.js';

// ── LECTURA (gviz — sin API key, para el chat) ─
function gvizUrl(gid) {
  return `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:json&gid=${gid}`;
}

async function fetchGviz(sheetKey) {
  const gid = SHEET_GIDS[sheetKey];
  if (!gid) throw new Error(`Sheet desconocido: ${sheetKey}`);
  try {
    const res  = await fetch(gvizUrl(gid));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw  = await res.text();
    const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
    const data = JSON.parse(json);
    const rows = data.table.rows || [];
    return rows.map(row =>
      (row.c || []).map(cell => (cell && cell.v != null ? String(cell.v) : ''))
    );
  } catch(e) {
    console.warn(`gviz fetch failed [${sheetKey}]:`, e.message);
    return null;
  }
}

// ── ESCRITURA (Apps Script — para el admin) ───
async function apiFetch(sheetKey) {
  const res  = await fetch(`${API_URL}?sheet=${sheetKey}`);
  const json = await res.json();
  if (json.status !== 'ok') throw new Error(json.message || 'Error al cargar');
  return json.data;
}

async function apiPost(body) {
  const res  = await fetch(API_URL, {
    method: 'POST',
    body:   JSON.stringify(body)
  });
  const json = await res.json();
  if (json.status !== 'ok') throw new Error(json.message || 'Error al guardar');
  return json.data;
}

// ── EXPORTACIONES ─────────────────────────────
// El chat usa gviz (lectura rápida sin auth)
// El admin usa apiFetch/apiPost (lectura+escritura)
export const SheetsAPI = {
  // Para el chat
  readGviz: fetchGviz,

  // Para el admin
  get:    (sheet)       => apiFetch(sheet),
  add:    (sheet, row)  => apiPost({ action: 'add',    sheet, row }),
  update: (sheet, rowNum, row) => apiPost({ action: 'update', sheet, rowNum, row }),
  delete: (sheet, rowNum)      => apiPost({ action: 'delete', sheet, rowNum })
};