// ══════════════════════════════════════════════
//  js/controllers/AdminController.js
//  Responsabilidad: coordinar el panel admin
//  - Maneja login / logout
//  - Coordina CRUD de cada sección
//  - Consulta SheetsAPI via modelos
//  - Le dice a AdminView qué renderizar
// ══════════════════════════════════════════════

import { ADMIN_PASSWORD, LS_AUTH } from '../config.js';
import { SheetsAPI }   from '../services/SheetsAPI.js';
import { FAQModel }    from '../models/FAQModel.js';
import { PagoModel }   from '../models/PagoModel.js';
import { PromoModel }  from '../models/PromoModel.js';
import { MayoristaModel } from '../models/MayoristaModel.js';
import { ConfigModel } from '../models/ConfigModel.js';
import { AdminView }   from '../views/AdminView.js';

export const AdminController = {

  // Sección activa actualmente
  currentSection: 'faq',

  // Cache local de datos por sección
  // para que onEdit pueda encontrar la fila
  _data: {
    faq:       [],
    pagos:     [],
    promos:    [],
    mayorista: [],
    config:    []
  },

  // ── INIT ─────────────────────────────────
  init() {
    this._bindEvents();
    // Si ya hay sesión activa, mostrar admin
    if (sessionStorage.getItem(LS_AUTH) === '1') {
      AdminView.showAdminScreen();
      this.loadSection('faq');
    }
  },

  _bindEvents() {
    // Login
    document.getElementById('pwd-input')
      .addEventListener('keydown', e => {
        if (e.key === 'Enter') this.login();
      });
    document.getElementById('login-btn')
      .addEventListener('click', () => this.login());

    // Logout
    document.getElementById('logout-btn')
      .addEventListener('click', () => this.logout());

    // Tabs — delegación en el contenedor
    document.querySelector('.tabs')
      .addEventListener('click', e => {
        const btn = e.target.closest('[data-tab]');
        if (!btn) return;
        this.switchTab(btn.dataset.tab);
      });

    // Botones agregar por sección
    document.getElementById('add-faq-btn')
      .addEventListener('click', () => this.openModal('faq'));
    document.getElementById('add-pagos-btn')
      .addEventListener('click', () => this.openModal('pagos'));
    document.getElementById('add-promos-btn')
      .addEventListener('click', () => this.openModal('promos'));
    document.getElementById('add-mayorista-btn')
      .addEventListener('click', () => this.openModal('mayorista'));

    // Config
    document.getElementById('save-config-btn')
      .addEventListener('click', () => this.saveConfig());

    // Modal
    document.getElementById('modal-save-btn')
      .addEventListener('click', () => this.saveModal());
    document.getElementById('modal-cancel-btn')
      .addEventListener('click', () => AdminView.closeModal());
    document.getElementById('modal-bg')
      .addEventListener('click', e => {
        if (e.target === document.getElementById('modal-bg')) {
          AdminView.closeModal();
        }
      });
  },

  // ── LOGIN / LOGOUT ───────────────────────
  login() {
    const val = document.getElementById('pwd-input').value;
    if (val === ADMIN_PASSWORD) {
      sessionStorage.setItem(LS_AUTH, '1');
      AdminView.showAdminScreen();
      this.loadSection('faq');
    } else {
      AdminView.showLoginError('Contraseña incorrecta.');
    }
  },

  logout() {
    sessionStorage.removeItem(LS_AUTH);
    AdminView.reloadPage();
  },

  // ── TABS ─────────────────────────────────
  switchTab(section) {
    this.currentSection = section;
    AdminView.switchTab(section);
    this.loadSection(section);
  },

  // ── CARGA DE SECCIONES ───────────────────
  async loadSection(section) {
    if (section === 'faq')       await this._loadFAQ();
    if (section === 'pagos')     await this._loadPagos();
    if (section === 'promos')    await this._loadPromos();
    if (section === 'mayorista') await this._loadMayorista();
    if (section === 'config')    await this._loadConfig();
  },

  async _loadFAQ() {
    AdminView.showTableLoading('faq-tbody', 4);
    try {
      this._data.faq = await SheetsAPI.get('faq');
      AdminView.renderFAQ(
        this._data.faq,
        (rowNum) => this.openModal('faq', rowNum),
        (rowNum) => this.deleteRow('faq', rowNum)
      );
    } catch(e) {
      AdminView.showToast('Error cargando FAQ: ' + e.message, 'err');
    }
  },

  async _loadPagos() {
    AdminView.showTableLoading('pagos-tbody', 4);
    try {
      this._data.pagos = await SheetsAPI.get('pagos');
      AdminView.renderPagos(
        this._data.pagos,
        (rowNum) => this.openModal('pagos', rowNum),
        (rowNum) => this.deleteRow('pagos', rowNum)
      );
    } catch(e) {
      AdminView.showToast('Error cargando pagos: ' + e.message, 'err');
    }
  },

  async _loadPromos() {
    AdminView.showTableLoading('promos-tbody', 5);
    try {
      this._data.promos = await SheetsAPI.get('promos');
      AdminView.renderPromos(
        this._data.promos,
        (rowNum) => this.openModal('promos', rowNum),
        (rowNum) => this.deleteRow('promos', rowNum)
      );
    } catch(e) {
      AdminView.showToast('Error cargando promos: ' + e.message, 'err');
    }
  },

  async _loadMayorista() {
    AdminView.showTableLoading('mayorista-tbody', 4);
    try {
      this._data.mayorista = await SheetsAPI.get('mayorista');
      AdminView.renderMayorista(
        this._data.mayorista,
        (rowNum) => this.openModal('mayorista', rowNum),
        (rowNum) => this.deleteRow('mayorista', rowNum)
      );
    } catch(e) {
      AdminView.showToast('Error cargando mayorista: ' + e.message, 'err');
    }
  },

  async _loadConfig() {
    try {
      this._data.config = await SheetsAPI.get('config');
      const numero = this._data.config.length > 0
        ? (this._data.config[0]['NUMERO_ASESOR'] || '')
        : '';
      AdminView.setConfigNumero(numero);
    } catch(e) {
      AdminView.showToast('Error cargando config: ' + e.message, 'err');
    }
  },

  // ── MODAL ────────────────────────────────
  openModal(section, rowNum = null) {
    let rowData = null;
    if (rowNum !== null) {
      rowData = this._data[section].find(r => r._row === rowNum) || null;
    }
    // Guardamos contexto para saveModal
    this._modalContext = { section, rowData };
    AdminView.openModal(section, rowData);
  },

  async saveModal() {
    const { section, rowData } = this._modalContext;

    // Validar campos requeridos
    const error = AdminView.validateModalFields(section);
    if (error) { AdminView.showToast(error, 'err'); return; }

    AdminView.setSaveLoading(true);

    try {
      const { fields, toRow } = AdminView.getModalFields(section);
      if (rowData) {
        await SheetsAPI.update(section, rowData._row, toRow(fields));
        AdminView.showToast('Guardado correctamente');
      } else {
        await SheetsAPI.add(section, toRow(fields));
        AdminView.showToast('Agregado correctamente');
      }
      AdminView.closeModal();
      // Invalidar caché del modelo correspondiente
      this._invalidateModel(section);
      await this.loadSection(section);
    } catch(e) {
      AdminView.showToast('Error: ' + e.message, 'err');
    }

    AdminView.setSaveLoading(false);
  },

  // ── DELETE ───────────────────────────────
  async deleteRow(section, rowNum) {
    if (!confirm('¿Eliminar este registro?')) return;
    try {
      await SheetsAPI.delete(section, rowNum);
      AdminView.showToast('Eliminado correctamente');
      this._invalidateModel(section);
      await this.loadSection(section);
    } catch(e) {
      AdminView.showToast('Error: ' + e.message, 'err');
    }
  },

  // ── CONFIG ───────────────────────────────
  async saveConfig() {
    const numero = AdminView.getConfigNumero();
    if (!numero) { AdminView.showToast('Ingresa un número', 'err'); return; }
    try {
      if (this._data.config.length > 0) {
        await SheetsAPI.update('config', this._data.config[0]._row, [numero]);
      } else {
        await SheetsAPI.add('config', [numero]);
      }
      AdminView.showToast('Número guardado correctamente');
      ConfigModel.invalidate();
      await this._loadConfig();
    } catch(e) {
      AdminView.showToast('Error: ' + e.message, 'err');
    }
  },

  // ── UTILIDADES ───────────────────────────
  // Invalida el modelo correspondiente para
  // que el chat obtenga datos frescos
  _invalidateModel(section) {
    const map = {
      faq:       FAQModel,
      pagos:     PagoModel,
      promos:    PromoModel,
      mayorista: MayoristaModel,
      config:    ConfigModel
    };
    if (map[section]) map[section].invalidate();
  }
};