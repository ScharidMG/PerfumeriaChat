// ══════════════════════════════════════════════
//  js/views/AdminView.js
//  Responsabilidad: manipulación del DOM
//  del panel admin. Solo renderiza, nunca decide.
//  - Tablas CRUD
//  - Modal genérico
//  - Toast de notificaciones
//  - Login / Logout
//  - Tabs
// ══════════════════════════════════════════════

export const AdminView = {

  // ── LOGIN ──────────────────────────────────
  showLoginError(msg) {
    document.getElementById('login-error').textContent = msg;
  },

  showAdminScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-screen').classList.add('visible');
  },

  reloadPage() {
    location.reload();
  },

  // ── TABS ───────────────────────────────────
  switchTab(section) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-tab="${section}"]`).classList.add('active');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`sec-${section}`).classList.add('active');
  },

  // ── TOAST ──────────────────────────────────
  showToast(msg, type = 'ok') {
    const t = document.getElementById('toast');
    t.textContent = (type === 'ok' ? '✓ ' : '✕ ') + msg;
    t.className = `show ${type}`;
    setTimeout(() => { t.className = ''; }, 3000);
  },

  // ── LOADING EN TABLA ───────────────────────
  showTableLoading(tbodyId, cols) {
    document.getElementById(tbodyId).innerHTML = `
      <tr class="loading-row">
        <td colspan="${cols}"><div class="spinner"></div></td>
      </tr>`;
  },

  showTableEmpty(tbodyId, cols, msg) {
    document.getElementById(tbodyId).innerHTML = `
      <tr>
        <td colspan="${cols}" class="empty-state">${msg}</td>
      </tr>`;
  },

  // ── TABLAS ─────────────────────────────────
  renderFAQ(data, onEdit, onDelete) {
    const tb = document.getElementById('faq-tbody');
    if (!data.length) {
      this.showTableEmpty('faq-tbody', 4, 'No hay preguntas aún. Agrega la primera.');
      return;
    }
    tb.innerHTML = data.map((r, i) => `
      <tr>
        <td style="color:var(--text-sub);width:36px">${i + 1}</td>
        <td style="max-width:200px;word-break:break-word">${this._esc(r['Pregunta'])}</td>
        <td style="max-width:260px;word-break:break-word;color:var(--text-sub)">${this._esc(r['Respuesta'])}</td>
        <td>
          <div class="td-actions">
            <button class="btn btn-ghost btn-sm" data-row="${r._row}" data-action="edit">Editar</button>
            <button class="btn btn-red btn-sm"   data-row="${r._row}" data-action="delete">Eliminar</button>
          </div>
        </td>
      </tr>`).join('');
    this._bindTableActions(tb, onEdit, onDelete);
  },

  renderPagos(data, onEdit, onDelete) {
    const tb = document.getElementById('pagos-tbody');
    if (!data.length) {
      this.showTableEmpty('pagos-tbody', 4, 'No hay medios de pago. Agrega el primero.');
      return;
    }
    tb.innerHTML = data.map((r, i) => `
      <tr>
        <td style="color:var(--text-sub);width:36px">${i + 1}</td>
        <td style="font-weight:500">${this._esc(r['Medio'])}</td>
        <td style="color:var(--text-sub);max-width:280px;word-break:break-word">${this._esc(r['Detalle'])}</td>
        <td>
          <div class="td-actions">
            <button class="btn btn-ghost btn-sm" data-row="${r._row}" data-action="edit">Editar</button>
            <button class="btn btn-red btn-sm"   data-row="${r._row}" data-action="delete">Eliminar</button>
          </div>
        </td>
      </tr>`).join('');
    this._bindTableActions(tb, onEdit, onDelete);
  },

  renderPromos(data, onEdit, onDelete) {
    const tb = document.getElementById('promos-tbody');
    if (!data.length) {
      this.showTableEmpty('promos-tbody', 5, 'No hay promociones. Agrega la primera.');
      return;
    }
    tb.innerHTML = data.map((r, i) => `
      <tr>
        <td style="color:var(--text-sub);width:36px">${i + 1}</td>
        <td style="font-weight:500">${this._esc(r['TITULO'])}</td>
        <td style="color:var(--text-sub);max-width:200px;word-break:break-word">${this._esc(r['DESCRIPCION'])}</td>
        <td>${r['ID_IMAGEN']
          ? `<span class="badge-img">ID: ${this._esc(r['ID_IMAGEN']).substring(0, 12)}…</span>`
          : '<span style="color:var(--text-sub);font-size:12px">Sin imagen</span>'
        }</td>
        <td>
          <div class="td-actions">
            <button class="btn btn-ghost btn-sm" data-row="${r._row}" data-action="edit">Editar</button>
            <button class="btn btn-red btn-sm"   data-row="${r._row}" data-action="delete">Eliminar</button>
          </div>
        </td>
      </tr>`).join('');
    this._bindTableActions(tb, onEdit, onDelete);
  },

  renderMayorista(data, onEdit, onDelete) {
    const tb = document.getElementById('mayorista-tbody');
    if (!data.length) {
      this.showTableEmpty('mayorista-tbody', 4, 'No hay imágenes. Agrega la primera.');
      return;
    }
    tb.innerHTML = data.map((r, i) => {
      const id     = r['ID_IMAGEN_MAYORISTA'] || '';
      const imgUrl = id ? `https://lh3.googleusercontent.com/d/${id}` : '';
      return `
        <tr>
          <td style="color:var(--text-sub);width:36px">${i + 1}</td>
          <td style="font-family:monospace;font-size:12px;word-break:break-all">${this._esc(id)}</td>
          <td>${imgUrl
            ? `<img src="${imgUrl}"
                    style="width:60px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border)"
                    onerror="this.style.display='none'">`
            : ''
          }</td>
          <td>
            <div class="td-actions">
              <button class="btn btn-ghost btn-sm" data-row="${r._row}" data-action="edit">Editar</button>
              <button class="btn btn-red btn-sm"   data-row="${r._row}" data-action="delete">Eliminar</button>
            </div>
          </td>
        </tr>`;
    }).join('');
    this._bindTableActions(tb, onEdit, onDelete);
  },

  setConfigNumero(numero) {
    document.getElementById('config-numero').value = numero || '';
  },

  getConfigNumero() {
    return document.getElementById('config-numero').value.trim();
  },

  // ── MODAL ──────────────────────────────────
  // Configuraciones de cada sección
  _modalConfigs: {
    faq: {
      titleAdd:  'Agregar pregunta',
      titleEdit: 'Editar pregunta',
      fields: [
        { id: 'Pregunta',  label: 'PREGUNTA',  type: 'input',
          placeholder: 'Ej: ¿Hacen envíos a todo el país?' },
        { id: 'Respuesta', label: 'RESPUESTA', type: 'textarea',
          placeholder: 'Respuesta completa para el cliente…' }
      ],
      toRow: (f) => [f['Pregunta'], f['Respuesta']]
    },
    pagos: {
      titleAdd:  'Agregar medio de pago',
      titleEdit: 'Editar medio de pago',
      fields: [
        { id: 'Medio',   label: 'MEDIO',   type: 'input',
          placeholder: 'Ej: Nequi, Bancolombia, Efectivo…' },
        { id: 'Detalle', label: 'DETALLE', type: 'textarea',
          placeholder: 'Número de cuenta, instrucciones…' }
      ],
      toRow: (f) => [f['Medio'], f['Detalle']]
    },
    promos: {
      titleAdd:  'Agregar promoción',
      titleEdit: 'Editar promoción',
      fields: [
        { id: 'TITULO',      label: 'TÍTULO',      type: 'input',
          placeholder: 'Ej: 2x1 en perfumes orientales' },
        { id: 'DESCRIPCION', label: 'DESCRIPCIÓN', type: 'textarea',
          placeholder: 'Detalles de la promoción…' },
        { id: 'ID_IMAGEN',   label: 'ID DE IMAGEN (opcional)', type: 'input',
          placeholder: 'Ej: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs',
          hint: 'Drive → Compartir → Copiar enlace → ID entre /d/ y /view',
          optional: true }
      ],
      toRow: (f) => [f['TITULO'], f['DESCRIPCION'], f['ID_IMAGEN'] || '']
    },
    mayorista: {
      titleAdd:  'Agregar imagen mayorista',
      titleEdit: 'Editar imagen mayorista',
      fields: [
        { id: 'ID_IMAGEN_MAYORISTA', label: 'ID DE IMAGEN (Google Drive)',
          type: 'input',
          placeholder: 'Ej: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs',
          hint: 'Drive → Compartir → Copiar enlace → ID entre /d/ y /view' }
      ],
      toRow: (f) => [f['ID_IMAGEN_MAYORISTA']]
    }
  },

  openModal(section, rowData = null) {
    const cfg = this._modalConfigs[section];
    document.getElementById('modal-title').textContent =
      rowData ? cfg.titleEdit : cfg.titleAdd;
    document.getElementById('modal-body').innerHTML = cfg.fields.map(f => `
      <div class="form-group">
        <label class="form-label">${f.label}</label>
        ${f.type === 'textarea'
          ? `<textarea id="mf-${f.id}" class="form-textarea"
                       placeholder="${f.placeholder}">${rowData ? this._esc(rowData[f.id] || '') : ''}</textarea>`
          : `<input id="mf-${f.id}" class="form-input" type="text"
                    placeholder="${f.placeholder}"
                    value="${rowData ? this._esc(rowData[f.id] || '') : ''}">`
        }
        ${f.hint ? `<div class="form-hint">📌 ${f.hint}</div>` : ''}
      </div>`).join('');
    document.getElementById('modal-bg').classList.add('open');
    setTimeout(() => {
      const first = document.querySelector('#modal-body input, #modal-body textarea');
      if (first) first.focus();
    }, 100);
  },

  closeModal() {
    document.getElementById('modal-bg').classList.remove('open');
  },

  getModalFields(section) {
    const cfg    = this._modalConfigs[section];
    const fields = {};
    for (const f of cfg.fields) {
      const el = document.getElementById(`mf-${f.id}`);
      fields[f.id] = el ? el.value.trim() : '';
    }
    return { fields, toRow: cfg.toRow };
  },

  // Valida campos requeridos y devuelve
  // el primer error encontrado o null
  validateModalFields(section) {
    const cfg = this._modalConfigs[section];
    for (const f of cfg.fields) {
      if (f.optional) continue;
      const el = document.getElementById(`mf-${f.id}`);
      if (el && !el.value.trim()) {
        return `El campo "${f.label}" es requerido`;
      }
    }
    return null;
  },

  setSaveLoading(loading) {
    const btn = document.getElementById('modal-save-btn');
    btn.disabled  = loading;
    btn.innerHTML = loading ? '<div class="spinner"></div>' : 'Guardar';
  },

  // ── UTILIDADES INTERNAS ────────────────────
  _esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  // Delegación de eventos para botones de tabla
  // Evita onclick inline en cada fila
  _bindTableActions(tbody, onEdit, onDelete) {
    tbody.onclick = (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const rowNum = parseInt(btn.dataset.row);
      if (btn.dataset.action === 'edit')   onEdit(rowNum);
      if (btn.dataset.action === 'delete') onDelete(rowNum);
    };
  }
};