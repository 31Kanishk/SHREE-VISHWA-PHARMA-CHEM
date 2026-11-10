/**
 * SHREE VISHWA PHARMA CHEM - Inventory & Stock Management Web Application
 * Tech Stack: HTML5, Tailwind CSS, Lucide Icons, Vanilla JavaScript
 * Units: Stock in kilograms (kg)
 * Data Retention: Monthly dispatches with automatic 2-month auto-purge
 * Persistence: Browser LocalStorage
 */

// ========================================================
// 1. DEFAULT DATA SEED & STORAGE KEYS
// ========================================================
const STORAGE_KEYS = {
  ITEMS: 'svpchem_inventory_v3',
  SALES: 'svpchem_sales_v3',
  SETTINGS: 'svpchem_settings_v3',
  WAREHOUSES: 'svpchem_warehouses_v1',
  AUTH: 'svpchem_auth_session'
};

const DEFAULT_SETTINGS = {
  pin: '1234',
  theme: 'dark'
};

// Initial default warehouses (fully editable, renameable, and extensible)
const INITIAL_WAREHOUSES = [
  'Warehouse A - Acidulants & Organic Acids',
  'Warehouse B - Liquid Chemicals & Polyols',
  'Warehouse C - Sweeteners & Additives',
  'Warehouse D - Vitamins & Active Ingredients (APIs)',
  'Warehouse E - Central Storage',
  'Warehouse F - Cold Storage Facility'
];

// 2 Months in milliseconds (60 days * 24h * 60m * 60s * 1000ms)
const RETENTION_WINDOW_MS = 60 * 24 * 60 * 60 * 1000;

// Official product line for SHREE VISHWA PHARMA CHEM with Makes
const INITIAL_SAMPLE_ITEMS = [
  // 1) Citric Acid Mono (Make: Weifang, Union, Lemon Star, MDI IP)
  {
    id: 'item-101',
    name: 'Citric Acid Mono - Make: Weifang',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantity: 500,
    minThreshold: 100,
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: 'item-102',
    name: 'Citric Acid Mono - Make: Union',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantity: 350,
    minThreshold: 75,
    updatedAt: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: 'item-103',
    name: 'Citric Acid Mono - Make: Lemon Star',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantity: 250,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: 'item-104',
    name: 'Citric Acid Mono - Make: MDI IP',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantity: 200,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 16 * 3600000).toISOString()
  },

  // 2) Citric Acid Anhydrous (Make: Weifang, Union, RZBC, Lemon Star)
  {
    id: 'item-105',
    name: 'Citric Acid Anhydrous - Make: Weifang',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantity: 600,
    minThreshold: 100,
    updatedAt: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: 'item-106',
    name: 'Citric Acid Anhydrous - Make: Union',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantity: 400,
    minThreshold: 75,
    updatedAt: new Date(Date.now() - 10 * 3600000).toISOString()
  },
  {
    id: 'item-107',
    name: 'Citric Acid Anhydrous - Make: RZBC',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantity: 300,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    id: 'item-108',
    name: 'Citric Acid Anhydrous - Make: Lemon Star',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantity: 250,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 18 * 3600000).toISOString()
  },

  // 3) Glycerine (Make: Godrej CP, VVF CP, Adani CP, Apical, PT DUA KODA)
  {
    id: 'item-109',
    name: 'Glycerine - Make: Godrej CP',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantity: 750,
    minThreshold: 150,
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'item-110',
    name: 'Glycerine - Make: VVF CP',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantity: 500,
    minThreshold: 100,
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'item-111',
    name: 'Glycerine - Make: Adani CP',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantity: 450,
    minThreshold: 100,
    updatedAt: new Date(Date.now() - 9 * 3600000).toISOString()
  },
  {
    id: 'item-112',
    name: 'Glycerine - Make: Apical',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantity: 0,
    minThreshold: 100,
    updatedAt: new Date(Date.now() - 48 * 3600000).toISOString()
  },
  {
    id: 'item-113',
    name: 'Glycerine - Make: PT DUA KODA',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantity: 250,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 20 * 3600000).toISOString()
  },

  // 4) Phosphoric Acid (Make: GACL Food, Green Mountain, Hiforic, Shine)
  {
    id: 'item-114',
    name: 'Phosphoric Acid - Make: GACL Food',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantity: 400,
    minThreshold: 80,
    updatedAt: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 'item-115',
    name: 'Phosphoric Acid - Make: Green Mountain',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantity: 300,
    minThreshold: 60,
    updatedAt: new Date(Date.now() - 7 * 3600000).toISOString()
  },
  {
    id: 'item-116',
    name: 'Phosphoric Acid - Make: Hiforic',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantity: 200,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 11 * 3600000).toISOString()
  },
  {
    id: 'item-117',
    name: 'Phosphoric Acid - Make: Shine',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantity: 150,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 15 * 3600000).toISOString()
  },

  // 5) Sodium Saccharine (Make: Swati Drum, Supreme IP/BR, Blue Jet Non IP, Thailand Powder, Habai China)
  {
    id: 'item-118',
    name: 'Sodium Saccharine - Make: Swati Drum',
    warehouse: 'Warehouse C - Sweeteners & Additives',
    quantity: 300,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: 'item-119',
    name: 'Sodium Saccharine - Make: Supreme IP/BR',
    warehouse: 'Warehouse C - Sweeteners & Additives',
    quantity: 250,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: 'item-120',
    name: 'Sodium Saccharine - Make: Blue Jet Non IP',
    warehouse: 'Warehouse C - Sweeteners & Additives',
    quantity: 40,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: 'item-121',
    name: 'Sodium Saccharine - Make: Thailand Powder',
    warehouse: 'Warehouse C - Sweeteners & Additives',
    quantity: 150,
    minThreshold: 40,
    updatedAt: new Date(Date.now() - 16 * 3600000).toISOString()
  },
  {
    id: 'item-122',
    name: 'Sodium Saccharine - Make: Habai China',
    warehouse: 'Warehouse C - Sweeteners & Additives',
    quantity: 200,
    minThreshold: 50,
    updatedAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },

  // 6) Ascorbic Acid (Make: CSMC, Shandong Luwei)
  {
    id: 'item-123',
    name: 'Ascorbic Acid - Make: CSMC',
    warehouse: 'Warehouse D - Vitamins & Active Ingredients (APIs)',
    quantity: 180,
    minThreshold: 40,
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'item-124',
    name: 'Ascorbic Acid - Make: Shandong Luwei',
    warehouse: 'Warehouse D - Vitamins & Active Ingredients (APIs)',
    quantity: 220,
    minThreshold: 40,
    updatedAt: new Date(Date.now() - 9 * 3600000).toISOString()
  }
];

// Sample dispatches strictly within the 2-month window
const INITIAL_SAMPLE_SALES = [
  // Today's Dispatches (November 2026)
  {
    id: 'dispatch-201',
    itemId: 'item-101',
    itemName: 'Citric Acid Mono - Make: Weifang',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantitySold: 50,
    saleDate: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'dispatch-202',
    itemId: 'item-109',
    itemName: 'Glycerine - Make: Godrej CP',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantitySold: 100,
    saleDate: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: 'dispatch-203',
    itemId: 'item-118',
    itemName: 'Sodium Saccharine - Make: Swati Drum',
    warehouse: 'Warehouse C - Sweeteners & Additives',
    quantitySold: 25,
    saleDate: new Date(Date.now() - 10 * 3600000).toISOString()
  },
  {
    id: 'dispatch-204',
    itemId: 'item-114',
    itemName: 'Phosphoric Acid - Make: GACL Food',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantitySold: 40,
    saleDate: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  // Yesterday's Dispatches
  {
    id: 'dispatch-205',
    itemId: 'item-105',
    itemName: 'Citric Acid Anhydrous - Make: Weifang',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantitySold: 75,
    saleDate: new Date(Date.now() - 26 * 3600000).toISOString()
  },
  {
    id: 'dispatch-206',
    itemId: 'item-123',
    itemName: 'Ascorbic Acid - Make: CSMC',
    warehouse: 'Warehouse D - Vitamins & Active Ingredients (APIs)',
    quantitySold: 20,
    saleDate: new Date(Date.now() - 32 * 3600000).toISOString()
  },
  // Earlier in Current Month (November)
  {
    id: 'dispatch-207',
    itemId: 'item-110',
    itemName: 'Glycerine - Make: VVF CP',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantitySold: 50,
    saleDate: new Date(Date.now() - 4 * 24 * 3600000).toISOString()
  },
  {
    id: 'dispatch-208',
    itemId: 'item-103',
    itemName: 'Citric Acid Mono - Make: Lemon Star',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantitySold: 50,
    saleDate: new Date(Date.now() - 7 * 24 * 3600000).toISOString()
  },
  {
    id: 'dispatch-209',
    itemId: 'item-119',
    itemName: 'Sodium Saccharine - Make: Supreme IP/BR',
    warehouse: 'Warehouse C - Sweeteners & Additives',
    quantitySold: 30,
    saleDate: new Date(Date.now() - 9 * 24 * 3600000).toISOString()
  },
  // Last Month (October - well within 60-day auto-purge window)
  {
    id: 'dispatch-210',
    itemId: 'item-111',
    itemName: 'Glycerine - Make: Adani CP',
    warehouse: 'Warehouse B - Liquid Chemicals & Polyols',
    quantitySold: 120,
    saleDate: new Date(Date.now() - 25 * 24 * 3600000).toISOString()
  },
  {
    id: 'dispatch-211',
    itemId: 'item-107',
    itemName: 'Citric Acid Anhydrous - Make: RZBC',
    warehouse: 'Warehouse A - Acidulants & Organic Acids',
    quantitySold: 80,
    saleDate: new Date(Date.now() - 35 * 24 * 3600000).toISOString()
  },
  {
    id: 'dispatch-212',
    itemId: 'item-124',
    itemName: 'Ascorbic Acid - Make: Shandong Luwei',
    warehouse: 'Warehouse D - Vitamins & Active Ingredients (APIs)',
    quantitySold: 45,
    saleDate: new Date(Date.now() - 42 * 24 * 3600000).toISOString()
  }
];

// ========================================================
// 2. STATE MANAGER
// ========================================================
class InventoryApp {
  constructor() {
    this.items = this.loadItems();
    this.sales = this.loadSales();
    this.warehouses = this.loadWarehouses();
    this.settings = this.loadSettings();
    this.isAdminAuthenticated = false;
    this.currentView = 'public'; // 'public' | 'admin'
    this.publicViewMode = 'table'; // 'table' | 'grid'
    this.publicStatusFilter = 'ALL';
    this.publicWarehouseFilter = 'ALL';
    this.publicSearchQuery = '';

    this.adminSearchQuery = '';
    this.adminWarehouseFilter = 'ALL';
    this.adminTab = 'stock'; // 'stock' | 'sales'
    
    this.itemToDelete = null;

    // Dispatched Products Month Selection State (Month & Year)
    const today = new Date();
    this.salesSelectedMonth = today.getMonth(); // 0-11
    this.salesSelectedMonthYear = today.getFullYear();

    this.initDOM();
    this.bindEvents();
    this.applyTheme(this.settings.theme);

    // Run automated 2-month data retention purge
    this.cleanupOldSales();

    this.render();
  }

  // --- Local Storage Helpers ---
  loadItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map(item => ({
          ...item,
          warehouse: item.warehouse || item.category || 'Warehouse A - Acidulants & Organic Acids'
        }));
      }
    } catch (e) {
      console.error('Failed to parse inventory items from localStorage:', e);
    }
    // Seed default items
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_SAMPLE_ITEMS));
    return [...INITIAL_SAMPLE_ITEMS];
  }

  saveItems() {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(this.items));
  }

  loadSales() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SALES);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map(sale => ({
          ...sale,
          warehouse: sale.warehouse || sale.category || 'Warehouse A - Acidulants & Organic Acids'
        }));
      }
    } catch (e) {
      console.error('Failed to parse sales records from localStorage:', e);
    }
    // Seed default sales
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SAMPLE_SALES));
    return [...INITIAL_SAMPLE_SALES];
  }

  saveSales() {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(this.sales));
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
  }

  // --- Warehouse Management Persistence ---
  loadWarehouses() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WAREHOUSES);
      let list = [];
      if (stored) {
        list = JSON.parse(stored);
      } else {
        list = [...INITIAL_WAREHOUSES];
      }
      // Guarantee any warehouse in existing items or dispatches is preserved
      const itemWarehouses = (this.items || []).map(i => i.warehouse).filter(Boolean);
      const salesWarehouses = (this.sales || []).map(s => s.warehouse).filter(Boolean);
      const combined = Array.from(new Set([...list, ...itemWarehouses, ...salesWarehouses]))
        .map(w => w.trim())
        .filter(Boolean);
      return combined.length > 0 ? combined : [...INITIAL_WAREHOUSES];
    } catch (e) {
      console.error('Failed to load warehouses from localStorage:', e);
      return [...INITIAL_WAREHOUSES];
    }
  }

  saveWarehouses() {
    localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(this.warehouses));
  }

  // --- Automatic 2-Month Data Retention Policy ---
  cleanupOldSales() {
    const now = Date.now();
    const originalCount = this.sales.length;

    // Purge records older than 2 months (60 days)
    this.sales = this.sales.filter(sale => {
      if (!sale.saleDate) return false;
      const saleTime = new Date(sale.saleDate).getTime();
      return (now - saleTime) <= RETENTION_WINDOW_MS;
    });

    if (this.sales.length < originalCount) {
      this.saveSales();
      console.log(`[Auto-Purge] Cleaned up ${originalCount - this.sales.length} dispatches older than 2 months.`);
    }
  }

  getItemStatus(item) {
    const qty = Number(item.quantity);
    const min = Number(item.minThreshold);
    if (qty <= 0) return 'OUT_OF_STOCK';
    if (qty <= min) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  getStatusBadgeHTML(item) {
    const status = this.getItemStatus(item);
    if (status === 'IN_STOCK') {
      return `
        <span class="badge-in-stock">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          In Stock (${item.quantity} kg)
        </span>
      `;
    } else if (status === 'LOW_STOCK') {
      return `
        <span class="badge-low-stock">
          <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
          Low Stock (${item.quantity} kg left)
        </span>
      `;
    } else {
      return `
        <span class="badge-out-of-stock">
          <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
          Out of Stock (0 kg)
        </span>
      `;
    }
  }

  // Helper to format Product Name & Make elegantly
  formatProductNameHTML(fullName) {
    if (!fullName) return '';
    const match = fullName.match(/^(.*?)\s*[-–]\s*Make:\s*(.*)$/i) || fullName.match(/^(.*?)\s*\(Make:\s*(.*?)\)$/i);
    if (match) {
      const chemical = match[1].trim();
      const make = match[2].trim();
      return `
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-semibold text-slate-100">${this.escapeHTML(chemical)}</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25 tracking-wide">
            Make: ${this.escapeHTML(make)}
          </span>
        </div>
      `;
    }
    return `<span class="font-semibold text-slate-100">${this.escapeHTML(fullName)}</span>`;
  }

  // ========================================================
  // 3. DOM ELEMENT REFERENCES
  // ========================================================
  initDOM() {
    // Navigation
    this.navPublicBtn = document.getElementById('navPublicBtn');
    this.navAdminBtn = document.getElementById('navAdminBtn');
    this.adminLockIcon = document.getElementById('adminLockIcon');
    this.adminActiveBadge = document.getElementById('adminActiveBadge');
    this.adminLogoutBtn = document.getElementById('adminLogoutBtn');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');

    // Views
    this.publicView = document.getElementById('publicView');
    this.adminView = document.getElementById('adminView');

    // Public Viewer Elements
    this.publicSearchInput = document.getElementById('publicSearchInput');
    this.clearPublicSearch = document.getElementById('clearPublicSearch');
    this.publicWarehouseFilterEl = document.getElementById('publicWarehouseFilter');
    this.publicViewTableBtn = document.getElementById('publicViewTableBtn');
    this.publicViewGridBtn = document.getElementById('publicViewGridBtn');
    this.publicTableViewContainer = document.getElementById('publicTableViewContainer');
    this.publicGridViewContainer = document.getElementById('publicGridViewContainer');
    this.publicTableBody = document.getElementById('publicTableBody');
    this.publicEmptyState = document.getElementById('publicEmptyState');
    this.resetPublicFiltersBtn = document.getElementById('resetPublicFiltersBtn');

    // Public Counts
    this.countPublicAll = document.getElementById('countPublicAll');
    this.countPublicInStock = document.getElementById('countPublicInStock');
    this.countPublicLowStock = document.getElementById('countPublicLowStock');
    this.countPublicOut = document.getElementById('countPublicOut');
    this.statusChips = document.querySelectorAll('.status-chip');

    // Admin Dashboard Elements
    this.metricTotalItems = document.getElementById('metricTotalItems');
    this.metricWarehouseCount = document.getElementById('metricWarehouseCount');
    this.metricTotalUnits = document.getElementById('metricTotalUnits');
    this.metricInStockCount = document.getElementById('metricInStockCount');
    this.metricLowStockAlerts = document.getElementById('metricLowStockAlerts');
    this.metricOutOfStockCount = document.getElementById('metricOutOfStockCount');

    this.adminSearchInput = document.getElementById('adminSearchInput');
    this.adminWarehouseFilterEl = document.getElementById('adminWarehouseFilter');
    this.adminTableBody = document.getElementById('adminTableBody');
    this.adminEmptyState = document.getElementById('adminEmptyState');
    this.openAddItemModalBtn = document.getElementById('openAddItemModalBtn');
    this.exportCsvBtn = document.getElementById('exportCsvBtn');
    this.adminSettingsBtn = document.getElementById('adminSettingsBtn');
    this.emptyStateAddBtn = document.getElementById('emptyStateAddBtn');

    // Admin Sub-Navigation (Stock vs Dispatches)
    this.adminTabStockBtn = document.getElementById('adminTabStockBtn');
    this.adminTabSalesBtn = document.getElementById('adminTabSalesBtn');
    this.salesBadgeCount = document.getElementById('salesBadgeCount');
    this.adminStockSection = document.getElementById('adminStockSection');
    this.adminSalesSection = document.getElementById('adminSalesSection');

    // Dispatches Month Filter (Month Only)
    this.salesMonthSelect = document.getElementById('salesMonthSelect');
    this.salesMonthYearSelect = document.getElementById('salesMonthYearSelect');
    this.exportSalesCsvBtn = document.getElementById('exportSalesCsvBtn');

    // Set initial month/year select values
    if (this.salesMonthSelect) this.salesMonthSelect.value = this.salesSelectedMonth;
    if (this.salesMonthYearSelect) this.salesMonthYearSelect.value = this.salesSelectedMonthYear;

    // Dispatches Summary KPIs & Table
    this.salesSummaryUnits = document.getElementById('salesSummaryUnits');
    this.salesSummaryOrders = document.getElementById('salesSummaryOrders');
    this.salesSummaryTopProduct = document.getElementById('salesSummaryTopProduct');
    this.salesSummaryTopCount = document.getElementById('salesSummaryTopCount');
    this.salesPeriodLabel = document.getElementById('salesPeriodLabel');
    this.salesTableBody = document.getElementById('salesTableBody');
    this.salesEmptyState = document.getElementById('salesEmptyState');

    // Record Dispatch Modal Elements (No date picker required)
    this.saleModal = document.getElementById('saleModal');
    this.openRecordSaleModalBtn = document.getElementById('openRecordSaleModalBtn');
    this.closeSaleModalBtn = document.getElementById('closeSaleModalBtn');
    this.cancelSaleBtn = document.getElementById('cancelSaleBtn');
    this.recordSaleForm = document.getElementById('recordSaleForm');
    this.saleProductSelect = document.getElementById('saleProductSelect');
    this.saleQuantityInput = document.getElementById('saleQuantityInput');
    this.saleAvailableStockText = document.getElementById('saleAvailableStockText');

    // PIN Authentication Modal
    this.pinModal = document.getElementById('pinModal');
    this.pinInput = document.getElementById('pinInput');
    this.pinErrorMessage = document.getElementById('pinErrorMessage');
    this.submitPinBtn = document.getElementById('submitPinBtn');
    this.cancelPinBtn = document.getElementById('cancelPinBtn');
    this.togglePinVisibilityBtn = document.getElementById('togglePinVisibilityBtn');

    // Add / Edit Item Modal
    this.itemModal = document.getElementById('itemModal');
    this.itemModalTitle = document.getElementById('itemModalTitle');
    this.itemForm = document.getElementById('itemForm');
    this.itemId = document.getElementById('itemId');
    this.itemName = document.getElementById('itemName');
    this.itemWarehouse = document.getElementById('itemWarehouse');
    this.itemQuantity = document.getElementById('itemQuantity');
    this.itemMinThreshold = document.getElementById('itemMinThreshold');
    this.closeItemModalBtn = document.getElementById('closeItemModalBtn');
    this.cancelItemFormBtn = document.getElementById('cancelItemFormBtn');

    // Delete Modal
    this.deleteModal = document.getElementById('deleteModal');
    this.deleteItemName = document.getElementById('deleteItemName');
    this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    // Warehouse Management Modal Elements
    this.metricManageWarehousesBtn = document.getElementById('metricManageWarehousesBtn');
    this.manageWarehousesBtn = document.getElementById('manageWarehousesBtn');
    this.itemModalManageWhBtn = document.getElementById('itemModalManageWhBtn');
    this.warehouseModal = document.getElementById('warehouseModal');
    this.closeWarehouseModalBtn = document.getElementById('closeWarehouseModalBtn');
    this.doneWarehouseModalBtn = document.getElementById('doneWarehouseModalBtn');
    this.addWarehouseForm = document.getElementById('addWarehouseForm');
    this.newWarehouseInput = document.getElementById('newWarehouseInput');
    this.warehouseListContainer = document.getElementById('warehouseListContainer');
    this.warehouseModalCount = document.getElementById('warehouseModalCount');
    this.warehouseDatalist = document.getElementById('warehouseList');

    // Settings Modal
    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
    this.newPinInput = document.getElementById('newPinInput');
    this.saveNewPinBtn = document.getElementById('saveNewPinBtn');
    this.exportJsonBackupBtn = document.getElementById('exportJsonBackupBtn');
    this.resetSampleDataBtn = document.getElementById('resetSampleDataBtn');
    this.clearAllDataBtn = document.getElementById('clearAllDataBtn');

    this.toastContainer = document.getElementById('toastContainer');
  }

  // ========================================================
  // 4. EVENT BINDINGS
  // ========================================================
  bindEvents() {
    // Top Nav Switcher
    this.navPublicBtn.addEventListener('click', () => this.switchView('public'));
    this.navAdminBtn.addEventListener('click', () => {
      if (this.isAdminAuthenticated) {
        this.switchView('admin');
      } else {
        this.openPinModal();
      }
    });

    this.adminLogoutBtn.addEventListener('click', () => this.logoutAdmin());

    // Theme Toggle
    this.themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      this.applyTheme(newTheme);
      this.settings.theme = newTheme;
      this.saveSettings();
      this.showToast(`Switched to ${newTheme} mode`, 'info');
    });

    // Public Search & Filters
    this.publicSearchInput.addEventListener('input', (e) => {
      this.publicSearchQuery = e.target.value.trim().toLowerCase();
      this.clearPublicSearch.classList.toggle('hidden', !this.publicSearchQuery);
      this.renderPublicView();
    });

    this.clearPublicSearch.addEventListener('click', () => {
      this.publicSearchInput.value = '';
      this.publicSearchQuery = '';
      this.clearPublicSearch.classList.add('hidden');
      this.renderPublicView();
    });

    this.publicWarehouseFilterEl.addEventListener('change', (e) => {
      this.publicWarehouseFilter = e.target.value;
      this.renderPublicView();
    });

    // Status Filter Chips
    this.statusChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.statusChips.forEach(c => {
          c.classList.remove('active', 'bg-brand-600', 'text-white');
          c.classList.add('bg-slate-800/80', 'text-slate-300');
        });
        chip.classList.add('active', 'bg-brand-600', 'text-white');
        chip.classList.remove('bg-slate-800/80', 'text-slate-300');
        this.publicStatusFilter = chip.getAttribute('data-status');
        this.renderPublicView();
      });
    });

    // View Mode Toggle (Table / Grid)
    this.publicViewTableBtn.addEventListener('click', () => {
      this.publicViewMode = 'table';
      this.publicViewTableBtn.classList.add('text-slate-200', 'bg-slate-800');
      this.publicViewTableBtn.classList.remove('text-slate-400');
      this.publicViewGridBtn.classList.remove('text-slate-200', 'bg-slate-800');
      this.publicViewGridBtn.classList.add('text-slate-400');
      this.publicTableViewContainer.classList.remove('hidden');
      this.publicGridViewContainer.classList.add('hidden');
      this.renderPublicView();
    });

    this.publicViewGridBtn.addEventListener('click', () => {
      this.publicViewMode = 'grid';
      this.publicViewGridBtn.classList.add('text-slate-200', 'bg-slate-800');
      this.publicViewGridBtn.classList.remove('text-slate-400');
      this.publicViewTableBtn.classList.remove('text-slate-200', 'bg-slate-800');
      this.publicViewTableBtn.classList.add('text-slate-400');
      this.publicTableViewContainer.classList.add('hidden');
      this.publicGridViewContainer.classList.remove('hidden');
      this.renderPublicView();
    });

    this.resetPublicFiltersBtn.addEventListener('click', () => {
      this.publicSearchInput.value = '';
      this.publicSearchQuery = '';
      this.clearPublicSearch.classList.add('hidden');
      this.publicWarehouseFilter = 'ALL';
      this.publicWarehouseFilterEl.value = 'ALL';
      this.publicStatusFilter = 'ALL';
      this.statusChips[0].click();
      this.renderPublicView();
    });

    // Admin Search & Filter
    this.adminSearchInput.addEventListener('input', (e) => {
      this.adminSearchQuery = e.target.value.trim().toLowerCase();
      this.renderAdminView();
    });

    this.adminWarehouseFilterEl.addEventListener('change', (e) => {
      this.adminWarehouseFilter = e.target.value;
      this.renderAdminView();
    });

    // Admin CRUD & Modals
    this.openAddItemModalBtn.addEventListener('click', () => this.openItemModal());
    this.emptyStateAddBtn.addEventListener('click', () => this.openItemModal());
    this.closeItemModalBtn.addEventListener('click', () => this.closeItemModal());
    this.cancelItemFormBtn.addEventListener('click', () => this.closeItemModal());
    this.itemForm.addEventListener('submit', (e) => this.handleSaveItem(e));

    // Delete Confirmation
    this.confirmDeleteBtn.addEventListener('click', () => this.handleConfirmDelete());
    this.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());

    // Export CSV
    this.exportCsvBtn.addEventListener('click', () => this.exportToCSV());

    // Warehouse Modal Event Handlers
    if (this.manageWarehousesBtn) {
      this.manageWarehousesBtn.addEventListener('click', () => this.openWarehouseModal());
    }
    if (this.metricManageWarehousesBtn) {
      this.metricManageWarehousesBtn.addEventListener('click', () => this.openWarehouseModal());
    }
    if (this.itemModalManageWhBtn) {
      this.itemModalManageWhBtn.addEventListener('click', () => this.openWarehouseModal());
    }
    if (this.closeWarehouseModalBtn) {
      this.closeWarehouseModalBtn.addEventListener('click', () => this.closeWarehouseModal());
    }
    if (this.doneWarehouseModalBtn) {
      this.doneWarehouseModalBtn.addEventListener('click', () => this.closeWarehouseModal());
    }
    if (this.addWarehouseForm) {
      this.addWarehouseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = this.newWarehouseInput.value.trim();
        if (name) {
          this.addWarehouse(name);
          this.newWarehouseInput.value = '';
        }
      });
    }

    // Admin Settings Modal
    this.adminSettingsBtn.addEventListener('click', () => this.openSettingsModal());
    this.closeSettingsModalBtn.addEventListener('click', () => this.closeSettingsModal());
    this.saveNewPinBtn.addEventListener('click', () => this.handleChangePin());
    this.exportJsonBackupBtn.addEventListener('click', () => this.exportJsonBackup());
    this.resetSampleDataBtn.addEventListener('click', () => this.resetSampleData());
    this.clearAllDataBtn.addEventListener('click', () => this.clearAllData());

    // PIN Modal Events
    this.submitPinBtn.addEventListener('click', () => this.handlePinSubmit());
    this.cancelPinBtn.addEventListener('click', () => this.closePinModal());
    this.pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handlePinSubmit();
      }
    });

    this.togglePinVisibilityBtn.addEventListener('click', () => {
      const isPwd = this.pinInput.type === 'password';
      this.pinInput.type = isPwd ? 'text' : 'password';
      this.togglePinVisibilityBtn.innerHTML = isPwd 
        ? '<i data-lucide="eye-off" class="w-4 h-4"></i>' 
        : '<i data-lucide="eye" class="w-4 h-4"></i>';
      lucide.createIcons();
    });

    // Keypad clicks for PIN
    document.querySelectorAll('.keypad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        const action = btn.getAttribute('data-action');
        if (key) {
          if (this.pinInput.value.length < 8) {
            this.pinInput.value += key;
          }
        } else if (action === 'clear') {
          this.pinInput.value = '';
        } else if (action === 'backspace') {
          this.pinInput.value = this.pinInput.value.slice(0, -1);
        }
        this.pinErrorMessage.classList.add('hidden');
      });
    });

    // Close modals on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closePinModal();
        this.closeItemModal();
        this.closeDeleteModal();
        this.closeWarehouseModal();
        this.closeSettingsModal();
        this.closeRecordSaleModal();
      }
    });

    // Admin Sub-Tab Switcher (Stock vs Dispatches)
    this.adminTabStockBtn.addEventListener('click', () => this.switchAdminTab('stock'));
    this.adminTabSalesBtn.addEventListener('click', () => this.switchAdminTab('sales'));

    // Month Selector Changes (Month Only Section)
    this.salesMonthSelect.addEventListener('change', (e) => {
      this.salesSelectedMonth = parseInt(e.target.value, 10);
      this.renderSalesView();
    });

    this.salesMonthYearSelect.addEventListener('change', (e) => {
      this.salesSelectedMonthYear = parseInt(e.target.value, 10);
      this.renderSalesView();
    });

    // Export Monthly Dispatches CSV
    this.exportSalesCsvBtn.addEventListener('click', () => this.exportSalesToCSV());

    // Record Product Dispatch Modal
    this.openRecordSaleModalBtn.addEventListener('click', () => this.openRecordSaleModal());
    this.closeSaleModalBtn.addEventListener('click', () => this.closeRecordSaleModal());
    this.cancelSaleBtn.addEventListener('click', () => this.closeRecordSaleModal());
    this.saleProductSelect.addEventListener('change', (e) => this.handleSaleProductChange(e.target.value));
    this.recordSaleForm.addEventListener('submit', (e) => this.handleRecordSale(e));
  }

  // ========================================================
  // 5. THEME & VIEW NAVIGATION
  // ========================================================
  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    lucide.createIcons();
  }

  switchView(viewName) {
    this.currentView = viewName;
    if (viewName === 'public') {
      this.publicView.classList.remove('hidden');
      this.adminView.classList.add('hidden');

      this.navPublicBtn.classList.add('bg-brand-600', 'text-white', 'shadow-sm');
      this.navPublicBtn.classList.remove('text-slate-400');

      this.navAdminBtn.classList.remove('bg-brand-600', 'text-white', 'shadow-sm');
      this.navAdminBtn.classList.add('text-slate-400');
      this.renderPublicView();
    } else if (viewName === 'admin') {
      this.publicView.classList.add('hidden');
      this.adminView.classList.remove('hidden');

      this.navAdminBtn.classList.add('bg-brand-600', 'text-white', 'shadow-sm');
      this.navAdminBtn.classList.remove('text-slate-400');

      this.navPublicBtn.classList.remove('bg-brand-600', 'text-white', 'shadow-sm');
      this.navPublicBtn.classList.add('text-slate-400');
      this.renderAdminView();
    }
    lucide.createIcons();
  }

  // ========================================================
  // 6. AUTHENTICATION (SECURE OWNER PIN)
  // ========================================================
  openPinModal() {
    this.pinInput.value = '';
    this.pinErrorMessage.classList.add('hidden');
    this.pinModal.classList.remove('hidden');
    setTimeout(() => this.pinInput.focus(), 100);
    lucide.createIcons();
  }

  closePinModal() {
    this.pinModal.classList.add('hidden');
    this.pinInput.value = '';
    this.pinErrorMessage.classList.add('hidden');
  }

  handlePinSubmit() {
    const enteredPin = this.pinInput.value.trim();
    const correctPin = this.settings.pin || '1234';

    if (enteredPin === correctPin) {
      this.pinErrorMessage.classList.add('hidden');
      this.unlockAdminSession();
      this.showToast('Admin session unlocked successfully', 'success');
    } else {
      this.pinErrorMessage.classList.remove('hidden');
      this.pinInput.classList.add('border-rose-500', 'animate-shake');
      setTimeout(() => {
        this.pinInput.classList.remove('border-rose-500', 'animate-shake');
      }, 500);
    }
  }

  unlockAdminSession() {
    this.isAdminAuthenticated = true;
    this.closePinModal();
    
    this.adminLockIcon.setAttribute('data-lucide', 'unlock');
    this.adminActiveBadge.classList.remove('hidden');
    this.adminLogoutBtn.classList.remove('hidden');

    this.switchView('admin');
  }

  logoutAdmin() {
    this.isAdminAuthenticated = false;
    this.adminLockIcon.setAttribute('data-lucide', 'lock');
    this.adminActiveBadge.classList.add('hidden');
    this.adminLogoutBtn.classList.add('hidden');
    this.switchView('public');
    this.showToast('Admin session locked', 'info');
  }

  handleChangePin() {
    const newPin = this.newPinInput.value.trim();
    if (!newPin || newPin.length < 4) {
      this.showToast('PIN must be at least 4 digits', 'error');
      return;
    }
    this.settings.pin = newPin;
    this.saveSettings();
    this.newPinInput.value = '';
    this.closeSettingsModal();
    this.showToast('Security PIN updated successfully!', 'success');
  }

  // ========================================================
  // 7. PUBLIC CATALOG RENDERING & FILTERING
  // ========================================================
  getFilteredPublicItems() {
    return this.items.filter(item => {
      // Search filter
      const matchesSearch = !this.publicSearchQuery ||
        item.name.toLowerCase().includes(this.publicSearchQuery) ||
        item.warehouse.toLowerCase().includes(this.publicSearchQuery);

      // Warehouse filter
      const matchesWarehouse = (this.publicWarehouseFilter === 'ALL') || 
        (item.warehouse.toLowerCase() === this.publicWarehouseFilter.toLowerCase());

      // Status filter
      const status = this.getItemStatus(item);
      const matchesStatus = (this.publicStatusFilter === 'ALL') || (status === this.publicStatusFilter);

      return matchesSearch && matchesWarehouse && matchesStatus;
    });
  }

  updateWarehouseDropdowns() {
    const list = [...this.warehouses];
    // Include any warehouse currently in items or sales that may not yet be in list
    (this.items || []).forEach(i => {
      if (i.warehouse && !list.some(w => w.toLowerCase() === i.warehouse.trim().toLowerCase())) {
        list.push(i.warehouse.trim());
      }
    });
    (this.sales || []).forEach(s => {
      if (s.warehouse && !list.some(w => w.toLowerCase() === s.warehouse.trim().toLowerCase())) {
        list.push(s.warehouse.trim());
      }
    });

    // Update Public Filter
    if (this.publicWarehouseFilterEl) {
      const currentPublic = this.publicWarehouseFilterEl.value;
      this.publicWarehouseFilterEl.innerHTML = '<option value="ALL">All Warehouses</option>';
      list.forEach(wh => {
        const opt = document.createElement('option');
        opt.value = wh;
        opt.textContent = wh;
        this.publicWarehouseFilterEl.appendChild(opt);
      });
      this.publicWarehouseFilterEl.value = list.includes(currentPublic) ? currentPublic : 'ALL';
    }

    // Update Admin Filter
    if (this.adminWarehouseFilterEl) {
      const currentAdmin = this.adminWarehouseFilterEl.value;
      this.adminWarehouseFilterEl.innerHTML = '<option value="ALL">All Warehouses</option>';
      list.forEach(wh => {
        const opt = document.createElement('option');
        opt.value = wh;
        opt.textContent = wh;
        this.adminWarehouseFilterEl.appendChild(opt);
      });
      this.adminWarehouseFilterEl.value = list.includes(currentAdmin) ? currentAdmin : 'ALL';
    }

    // Update Datalist in Add/Edit modal
    if (this.warehouseDatalist) {
      this.warehouseDatalist.innerHTML = list.map(wh => `<option value="${this.escapeHTML(wh)}"></option>`).join('');
    }
  }

  updatePublicCounts() {
    const allCount = this.items.length;
    const inStock = this.items.filter(i => this.getItemStatus(i) === 'IN_STOCK').length;
    const lowStock = this.items.filter(i => this.getItemStatus(i) === 'LOW_STOCK').length;
    const outStock = this.items.filter(i => this.getItemStatus(i) === 'OUT_OF_STOCK').length;

    this.countPublicAll.textContent = allCount;
    this.countPublicInStock.textContent = inStock;
    this.countPublicLowStock.textContent = lowStock;
    this.countPublicOut.textContent = outStock;
  }

  renderPublicView() {
    this.updatePublicCounts();
    const filtered = this.getFilteredPublicItems();

    if (filtered.length === 0) {
      this.publicTableViewContainer.classList.add('hidden');
      this.publicGridViewContainer.classList.add('hidden');
      this.publicEmptyState.classList.remove('hidden');
      lucide.createIcons();
      return;
    }

    this.publicEmptyState.classList.add('hidden');

    if (this.publicViewMode === 'table') {
      this.publicTableViewContainer.classList.remove('hidden');
      this.publicGridViewContainer.classList.add('hidden');
      this.renderPublicTable(filtered);
    } else {
      this.publicTableViewContainer.classList.add('hidden');
      this.publicGridViewContainer.classList.remove('hidden');
      this.renderPublicGrid(filtered);
    }
    lucide.createIcons();
  }

  renderPublicTable(items) {
    this.publicTableBody.innerHTML = items.map(item => {
      return `
        <tr class="hover:bg-slate-800/40 transition-colors">
          <td class="py-4 px-4 sm:px-6">
            ${this.formatProductNameHTML(item.name)}
          </td>
          <td class="py-4 px-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
              ${this.escapeHTML(item.warehouse)}
            </span>
          </td>
          <td class="py-4 px-4 sm:px-6 text-center">
            ${this.getStatusBadgeHTML(item)}
          </td>
        </tr>
      `;
    }).join('');
  }

  renderPublicGrid(items) {
    this.publicGridViewContainer.innerHTML = items.map(item => {
      return `
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 hover:shadow-lg transition-all group">
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-2">
              <span class="text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 truncate max-w-[170px]" title="${this.escapeHTML(item.warehouse)}">
                ${this.escapeHTML(item.warehouse)}
              </span>
              ${this.getStatusBadgeHTML(item)}
            </div>
            <div class="pt-1">
              ${this.formatProductNameHTML(item.name)}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Alert: ≤ ${item.minThreshold} kg</span>
            <span class="font-mono font-bold text-slate-200 text-sm">${item.quantity} kg</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // ========================================================
  // 8. ADMIN DASHBOARD RENDERING & OPERATIONS
  // ========================================================
  renderAdminView() {
    this.renderAdminMetrics();
    if (this.salesBadgeCount) {
      this.salesBadgeCount.textContent = this.sales.length;
    }

    if (this.adminTab === 'sales') {
      this.renderSalesView();
    } else {
      const filtered = this.getFilteredAdminItems();
      if (filtered.length === 0) {
        this.adminTableBody.innerHTML = '';
        this.adminEmptyState.classList.remove('hidden');
      } else {
        this.adminEmptyState.classList.add('hidden');
        this.renderAdminTable(filtered);
      }
    }
    lucide.createIcons();
  }

  getFilteredAdminItems() {
    return this.items.filter(item => {
      const matchesSearch = !this.adminSearchQuery ||
        item.name.toLowerCase().includes(this.adminSearchQuery) ||
        item.warehouse.toLowerCase().includes(this.adminSearchQuery);

      const matchesWarehouse = (this.adminWarehouseFilter === 'ALL') ||
        (item.warehouse.toLowerCase() === this.adminWarehouseFilter.toLowerCase());

      return matchesSearch && matchesWarehouse;
    });
  }

  renderAdminMetrics() {
    const totalItems = this.items.length;
    const warehouses = this.warehouses.length;
    const totalUnitsKg = this.items.reduce((sum, item) => sum + Number(item.quantity), 0);
    const inStockCount = this.items.filter(i => this.getItemStatus(i) === 'IN_STOCK').length;
    const lowStockCount = this.items.filter(i => this.getItemStatus(i) === 'LOW_STOCK').length;
    const outOfStockCount = this.items.filter(i => this.getItemStatus(i) === 'OUT_OF_STOCK').length;

    this.metricTotalItems.textContent = totalItems.toLocaleString();
    this.metricWarehouseCount.textContent = warehouses;
    this.metricTotalUnits.textContent = totalUnitsKg.toLocaleString();
    this.metricInStockCount.textContent = inStockCount;
    this.metricLowStockAlerts.textContent = lowStockCount;
    this.metricOutOfStockCount.textContent = outOfStockCount;
  }

  renderAdminTable(items) {
    this.adminTableBody.innerHTML = items.map(item => {
      return `
        <tr class="hover:bg-slate-800/40 transition-colors">
          <!-- Chemical / Product Name -->
          <td class="py-4 px-4 sm:px-6">
            ${this.formatProductNameHTML(item.name)}
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[11px] text-slate-500 font-mono">Min alert threshold: ${item.minThreshold} kg</span>
            </div>
          </td>

          <!-- Warehouse (Click to quick-change/reassign) -->
          <td class="py-4 px-4">
            <button 
              type="button"
              onclick="window.app.promptChangeItemWarehouse('${item.id}')"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 transition-all cursor-pointer group text-left"
              title="Click to change or reassign warehouse for this item"
            >
              <i data-lucide="building-2" class="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 shrink-0"></i>
              <span class="max-w-[150px] truncate">${this.escapeHTML(item.warehouse)}</span>
              <i data-lucide="edit-2" class="w-2.5 h-2.5 text-slate-500 group-hover:text-amber-300 shrink-0 opacity-70 group-hover:opacity-100"></i>
            </button>
          </td>

          <!-- Status Badge -->
          <td class="py-4 px-4 text-center">
            ${this.getStatusBadgeHTML(item)}
          </td>

          <!-- Stock Quick Adjustment (in kg: +1, -1, direct edit) -->
          <td class="py-4 px-4">
            <div class="flex items-center justify-center gap-1.5">
              <button 
                onclick="window.app.quickAdjustStock('${item.id}', -1)" 
                class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors ${item.quantity <= 0 ? 'opacity-40 cursor-not-allowed' : ''}" 
                title="Decrease stock by 1 kg"
                ${item.quantity <= 0 ? 'disabled' : ''}
              >
                <i data-lucide="minus" class="w-3.5 h-3.5"></i>
              </button>

              <button 
                onclick="window.app.promptDirectStockEdit('${item.id}')"
                class="px-2.5 py-1 min-w-[3.5rem] text-center font-mono font-bold text-sm rounded-lg bg-slate-950/80 border border-slate-800 hover:border-brand-500 text-slate-100 hover:bg-slate-900 transition-all"
                title="Click to directly edit stock in kg"
              >
                ${item.quantity} kg
              </button>

              <button 
                onclick="window.app.quickAdjustStock('${item.id}', 1)" 
                class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors" 
                title="Increase stock by 1 kg"
              >
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </td>

          <!-- Actions: Dispatch, Edit & Delete -->
          <td class="py-4 px-4 sm:px-6">
            <div class="flex items-center justify-center gap-1.5">
              <button 
                onclick="window.app.openRecordSaleModal('${item.id}')" 
                class="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors" 
                title="Record dispatch for this chemical"
              >
                <i data-lucide="package-minus" class="w-4 h-4"></i>
              </button>
              <button 
                onclick="window.app.openEditItemModal('${item.id}')" 
                class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-brand-400 transition-colors border border-slate-700" 
                title="Edit chemical details"
              >
                <i data-lucide="pencil" class="w-4 h-4"></i>
              </button>
              <button 
                onclick="window.app.openDeleteModal('${item.id}')" 
                class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors" 
                title="Delete product"
              >
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ========================================================
  // 8.5 DISPATCHED PRODUCTS REPORT (MONTH ONLY + 2-MONTH AUTO-PURGE)
  // ========================================================
  switchAdminTab(tabName) {
    this.adminTab = tabName;
    if (tabName === 'stock') {
      this.adminStockSection.classList.remove('hidden');
      this.adminSalesSection.classList.add('hidden');

      this.adminTabStockBtn.className = 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-brand-600 text-white shadow-sm';
      this.adminTabSalesBtn.className = 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-slate-400 hover:text-white';
      this.renderAdminView();
    } else if (tabName === 'sales') {
      this.adminStockSection.classList.add('hidden');
      this.adminSalesSection.classList.remove('hidden');

      this.adminTabSalesBtn.className = 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-brand-600 text-white shadow-sm';
      this.adminTabStockBtn.className = 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-slate-400 hover:text-white';
      
      // Auto-purge any stale records whenever opening the tab
      this.cleanupOldSales();
      this.renderSalesView();
    }
    lucide.createIcons();
  }

  getFilteredSales() {
    return this.sales.filter(sale => {
      if (!sale.saleDate) return false;
      const saleDateObj = new Date(sale.saleDate);
      return saleDateObj.getFullYear() === this.salesSelectedMonthYear &&
             saleDateObj.getMonth() === this.salesSelectedMonth;
    }).sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
  }

  renderSalesView() {
    // Purge records older than 2 months
    this.cleanupOldSales();

    if (this.salesBadgeCount) {
      this.salesBadgeCount.textContent = this.sales.length;
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Update Period Description Label
    if (this.salesPeriodLabel) {
      this.salesPeriodLabel.textContent = `For Month: ${monthNames[this.salesSelectedMonth]} ${this.salesSelectedMonthYear}`;
    }

    const filtered = this.getFilteredSales();

    // Summary Analytics
    const totalUnitsSold = filtered.reduce((sum, s) => sum + Number(s.quantitySold || 0), 0);
    const totalOrders = filtered.length;

    // Find Top Dispatched Product in this month
    const productCounts = {};
    filtered.forEach(s => {
      productCounts[s.itemName] = (productCounts[s.itemName] || 0) + Number(s.quantitySold || 0);
    });

    let topProduct = 'None';
    let topCount = 0;
    for (const [name, count] of Object.entries(productCounts)) {
      if (count > topCount) {
        topProduct = name;
        topCount = count;
      }
    }

    if (this.salesSummaryUnits) this.salesSummaryUnits.textContent = totalUnitsSold.toLocaleString();
    if (this.salesSummaryOrders) this.salesSummaryOrders.textContent = totalOrders.toLocaleString();
    if (this.salesSummaryTopProduct) this.salesSummaryTopProduct.textContent = topProduct;
    if (this.salesSummaryTopCount) this.salesSummaryTopCount.textContent = topCount > 0 ? `${topCount} kg dispatched` : '0 kg';

    // Render Table Body (No date column; Chemical & Make, Warehouse, Quantity in kg, Action)
    if (filtered.length === 0) {
      this.salesTableBody.innerHTML = '';
      this.salesEmptyState.classList.remove('hidden');
    } else {
      this.salesEmptyState.classList.add('hidden');
      this.salesTableBody.innerHTML = filtered.map(sale => {
        return `
          <tr class="hover:bg-slate-800/40 transition-colors">
            <!-- Chemical / Product -->
            <td class="py-4 px-4 sm:px-6">
              ${this.formatProductNameHTML(sale.itemName)}
            </td>

            <!-- Warehouse -->
            <td class="py-4 px-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                ${this.escapeHTML(sale.warehouse)}
              </span>
            </td>

            <!-- Quantity Dispatched in kg -->
            <td class="py-4 px-4 text-center">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                ${sale.quantitySold} kg
              </span>
            </td>

            <!-- Action -->
            <td class="py-4 px-4 sm:px-6 text-center">
              <button 
                onclick="window.app.deleteSaleRecord('${sale.id}')"
                class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                title="Delete this dispatch record & restore stock"
              >
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
    lucide.createIcons();
  }

  // Record Dispatch Modal & Logic (No date input needed)
  openRecordSaleModal(preSelectedItemId = null) {
    if (this.items.length === 0) {
      this.showToast('Please add products to your inventory first!', 'error');
      return;
    }

    // Populate Product Dropdown
    this.saleProductSelect.innerHTML = this.items.map(item => {
      return `<option value="${item.id}" ${item.id === preSelectedItemId ? 'selected' : ''}>
        ${this.escapeHTML(item.name)} (${item.quantity} kg in stock)
      </option>`;
    }).join('');

    const targetId = preSelectedItemId || this.saleProductSelect.value || (this.items[0] && this.items[0].id);
    if (targetId) {
      this.saleProductSelect.value = targetId;
      this.handleSaleProductChange(targetId);
    }

    this.saleQuantityInput.value = 25;
    this.saleModal.classList.remove('hidden');
    lucide.createIcons();
  }

  closeRecordSaleModal() {
    this.saleModal.classList.add('hidden');
    this.recordSaleForm.reset();
  }

  handleSaleProductChange(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      this.saleAvailableStockText.textContent = `Available in stock: ${item.quantity} kg`;
      this.saleQuantityInput.max = item.quantity;
      if (item.quantity <= 0) {
        this.saleAvailableStockText.textContent = 'Out of Stock! (0 kg available)';
        this.saleAvailableStockText.classList.add('text-rose-400');
        this.saleAvailableStockText.classList.remove('text-slate-400');
      } else {
        this.saleAvailableStockText.classList.remove('text-rose-400');
        this.saleAvailableStockText.classList.add('text-slate-400');
      }
    }
  }

  handleRecordSale(e) {
    e.preventDefault();
    const itemId = this.saleProductSelect.value;
    const quantitySold = parseFloat(this.saleQuantityInput.value);

    const item = this.items.find(i => i.id === itemId);
    if (!item) {
      this.showToast('Selected product not found', 'error');
      return;
    }

    if (isNaN(quantitySold) || quantitySold <= 0) {
      this.showToast('Please enter a valid quantity in kg (at least 0.1)', 'error');
      return;
    }

    if (quantitySold > item.quantity) {
      this.showToast(`Cannot dispatch ${quantitySold} kg! Only ${item.quantity} kg available in stock.`, 'error');
      return;
    }

    // Deduct stock from inventory
    item.quantity = Math.round((item.quantity - quantitySold) * 100) / 100;
    item.updatedAt = new Date().toISOString();

    // Create Dispatch record (automatically stamped with current timestamp)
    const newSale = {
      id: 'dispatch-' + Date.now(),
      itemId: item.id,
      itemName: item.name,
      warehouse: item.warehouse,
      quantitySold: quantitySold,
      saleDate: new Date().toISOString()
    };

    this.sales.unshift(newSale);
    this.cleanupOldSales(); // Run auto-purge policy
    this.saveItems();
    this.saveSales();

    this.closeRecordSaleModal();
    this.render();
    this.showToast(`Logged dispatch: ${quantitySold} kg of "${item.name}" (Stock updated)`, 'success');
  }

  deleteSaleRecord(saleId) {
    const sale = this.sales.find(s => s.id === saleId);
    if (!sale) return;

    if (confirm(`Remove this dispatch record for "${sale.itemName}" (${sale.quantitySold} kg)?\n\nStock will be automatically refunded back to inventory.`)) {
      // Restore inventory stock
      const item = this.items.find(i => i.id === sale.itemId);
      if (item) {
        item.quantity = Math.round((item.quantity + Number(sale.quantitySold)) * 100) / 100;
        item.updatedAt = new Date().toISOString();
        this.saveItems();
      }

      this.sales = this.sales.filter(s => s.id !== saleId);
      this.saveSales();
      this.render();
      this.showToast(`Dispatch removed & ${sale.quantitySold} kg restored to inventory`, 'info');
    }
  }

  exportSalesToCSV() {
    const filtered = this.getFilteredSales();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthName = monthNames[this.salesSelectedMonth];

    if (filtered.length === 0) {
      this.showToast(`No dispatch records to export for ${currentMonthName} ${this.salesSelectedMonthYear}!`, 'error');
      return;
    }

    const headers = ['Chemical / Product Name', 'Warehouse', 'Quantity Dispatched (kg)'];
    const rows = filtered.map(sale => {
      return [
        `"${sale.itemName.replace(/"/g, '""')}"`,
        `"${sale.warehouse.replace(/"/g, '""')}"`,
        sale.quantitySold
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SHREE_VISHWA_PHARMA_CHEM_Dispatches_${currentMonthName}_${this.salesSelectedMonthYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast(`Monthly dispatches report exported to CSV successfully!`, 'success');
  }

  // Quick Stock Adjustment (in kg)
  quickAdjustStock(itemId, delta) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    const newQty = Math.max(0, Math.round((Number(item.quantity) + delta) * 100) / 100);
    item.quantity = newQty;
    item.updatedAt = new Date().toISOString();
    this.saveItems();
    this.render();

    const changeText = delta > 0 ? `+${delta} kg` : `${delta} kg`;
    this.showToast(`Updated "${item.name}": ${changeText} (${item.quantity} kg in stock)`, 'success');
  }

  promptDirectStockEdit(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    const currentQty = item.quantity;
    const input = prompt(`Enter new stock quantity in kg for "${item.name}":`, currentQty);
    if (input === null) return;

    const parsed = parseFloat(input.trim());
    if (isNaN(parsed) || parsed < 0) {
      this.showToast('Please enter a valid positive number in kg or 0', 'error');
      return;
    }

    item.quantity = Math.round(parsed * 100) / 100;
    item.updatedAt = new Date().toISOString();
    this.saveItems();
    this.render();
    this.showToast(`Stock for "${item.name}" set to ${item.quantity} kg`, 'success');
  }

  // ========================================================
  // 8.8 WAREHOUSE MANAGEMENT & EDITING
  // ========================================================
  openWarehouseModal() {
    if (!this.warehouseModal) return;
    this.warehouseModal.classList.remove('hidden');
    this.renderWarehouseModal();
    if (this.newWarehouseInput) {
      setTimeout(() => this.newWarehouseInput.focus(), 80);
    }
    lucide.createIcons();
  }

  closeWarehouseModal() {
    if (!this.warehouseModal) return;
    this.warehouseModal.classList.add('hidden');
    if (this.newWarehouseInput) {
      this.newWarehouseInput.value = '';
    }
  }

  renderWarehouseModal() {
    if (!this.warehouseListContainer) return;
    if (this.warehouseModalCount) {
      this.warehouseModalCount.textContent = this.warehouses.length;
    }

    if (this.warehouses.length === 0) {
      this.warehouseListContainer.innerHTML = `
        <div class="text-center py-8 text-slate-500 text-sm">
          <i data-lucide="building-2" class="w-8 h-8 mx-auto mb-2 text-slate-600"></i>
          <p>No warehouses found. Add one above.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    this.warehouseListContainer.innerHTML = this.warehouses.map((wh, idx) => {
      const assigned = this.items.filter(i => (i.warehouse || '').trim().toLowerCase() === wh.trim().toLowerCase());
      const totalKg = assigned.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
      return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 transition-all gap-3 group">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
              <i data-lucide="building-2" class="w-4 h-4"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-slate-200 truncate" title="${this.escapeHTML(wh)}">
                ${this.escapeHTML(wh)}
              </div>
              <div class="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span><strong class="text-slate-300 font-medium">${assigned.length}</strong> product lines</span>
                <span>•</span>
                <span class="font-mono text-amber-400/90">${totalKg.toLocaleString()} kg in stock</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <button 
              type="button"
              onclick="window.app.promptRenameWarehouse(${idx})"
              class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Rename warehouse"
            >
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              <span>Rename</span>
            </button>
            <button 
              type="button"
              onclick="window.app.deleteWarehouse(${idx})"
              class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
              title="Delete warehouse"
            >
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons();
  }

  addWarehouse(name) {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      this.showToast('Please enter a warehouse name', 'error');
      return;
    }

    if (this.warehouses.some(w => w.toLowerCase() === trimmed.toLowerCase())) {
      this.showToast(`Warehouse "${trimmed}" already exists`, 'error');
      return;
    }

    this.warehouses.push(trimmed);
    this.saveWarehouses();
    this.render();
    this.renderWarehouseModal();
    this.showToast(`Added warehouse "${trimmed}"`, 'success');
  }

  promptRenameWarehouse(idx) {
    const oldName = this.warehouses[idx];
    if (!oldName) return;

    const assigned = this.items.filter(i => (i.warehouse || '').trim().toLowerCase() === oldName.trim().toLowerCase());
    const promptMsg = `Rename Warehouse:\n"${oldName}"\n\n(${assigned.length} inventory products & past dispatches will be updated automatically)\n\nEnter new warehouse name:`;
    const newName = prompt(promptMsg, oldName);
    if (newName === null) return;

    this.renameWarehouse(oldName, newName);
  }

  renameWarehouse(oldName, newName) {
    const trimmed = (newName || '').trim();
    if (!trimmed) {
      this.showToast('Warehouse name cannot be empty', 'error');
      return;
    }

    if (trimmed.toLowerCase() === oldName.trim().toLowerCase()) {
      if (trimmed === oldName) return;
    } else {
      if (this.warehouses.some(w => w.toLowerCase() === trimmed.toLowerCase())) {
        this.showToast(`A warehouse named "${trimmed}" already exists`, 'error');
        return;
      }
    }

    // 1. Update warehouse array
    const whIdx = this.warehouses.findIndex(w => w.trim().toLowerCase() === oldName.trim().toLowerCase());
    if (whIdx !== -1) {
      this.warehouses[whIdx] = trimmed;
    } else {
      this.warehouses.push(trimmed);
    }

    // 2. Cascade rename across all items
    let itemsUpdated = 0;
    this.items.forEach(item => {
      if ((item.warehouse || '').trim().toLowerCase() === oldName.trim().toLowerCase()) {
        item.warehouse = trimmed;
        item.updatedAt = new Date().toISOString();
        itemsUpdated++;
      }
    });

    // 3. Cascade rename across all sales dispatches
    let dispatchesUpdated = 0;
    this.sales.forEach(sale => {
      if ((sale.warehouse || '').trim().toLowerCase() === oldName.trim().toLowerCase()) {
        sale.warehouse = trimmed;
        dispatchesUpdated++;
      }
    });

    // 4. Update filters if matched
    if (this.publicWarehouseFilter.toLowerCase() === oldName.toLowerCase()) {
      this.publicWarehouseFilter = trimmed;
    }
    if (this.adminWarehouseFilter.toLowerCase() === oldName.toLowerCase()) {
      this.adminWarehouseFilter = trimmed;
    }

    // 5. Save state
    this.saveWarehouses();
    this.saveItems();
    this.saveSales();

    // 6. Refresh UI
    this.render();
    this.renderWarehouseModal();

    this.showToast(`Warehouse renamed to "${trimmed}" (${itemsUpdated} stock lines updated)`, 'success');
  }

  deleteWarehouse(idx) {
    const whName = this.warehouses[idx];
    if (!whName) return;

    if (this.warehouses.length <= 1) {
      this.showToast('You must keep at least one warehouse in the system', 'error');
      return;
    }

    const assigned = this.items.filter(i => (i.warehouse || '').trim().toLowerCase() === whName.trim().toLowerCase());
    const remaining = this.warehouses.filter((_, i) => i !== idx);
    const targetWarehouse = remaining[0];

    if (assigned.length > 0) {
      const confirmMove = confirm(
        `Warehouse "${whName}" currently has ${assigned.length} product(s) assigned.\n\n` +
        `Click OK to move all ${assigned.length} item(s) to "${targetWarehouse}", or Cancel to abort.`
      );
      if (!confirmMove) return;

      assigned.forEach(item => {
        item.warehouse = targetWarehouse;
        item.updatedAt = new Date().toISOString();
      });
      this.saveItems();

      this.sales.forEach(sale => {
        if ((sale.warehouse || '').trim().toLowerCase() === whName.trim().toLowerCase()) {
          sale.warehouse = targetWarehouse;
        }
      });
      this.saveSales();
    } else {
      if (!confirm(`Are you sure you want to delete warehouse "${whName}"?`)) {
        return;
      }
    }

    this.warehouses.splice(idx, 1);
    this.saveWarehouses();

    if (this.publicWarehouseFilter.toLowerCase() === whName.toLowerCase()) {
      this.publicWarehouseFilter = 'ALL';
    }
    if (this.adminWarehouseFilter.toLowerCase() === whName.toLowerCase()) {
      this.adminWarehouseFilter = 'ALL';
    }

    this.render();
    this.renderWarehouseModal();
    this.showToast(`Warehouse "${whName}" deleted`, 'info');
  }

  promptChangeItemWarehouse(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    const currentWh = item.warehouse;
    const optionsText = this.warehouses.map((w, i) => `${i + 1}. ${w}`).join('\n');
    const promptText = `Reassign warehouse for:\n"${item.name}"\n\nCurrent: ${currentWh}\n\nAvailable warehouses:\n${optionsText}\n\nEnter warehouse number (1-${this.warehouses.length}) or type custom warehouse name:`;

    const choice = prompt(promptText, currentWh);
    if (choice === null) return;

    const trimmed = choice.trim();
    if (!trimmed) return;

    let targetWarehouse = trimmed;
    const num = parseInt(trimmed, 10);
    if (!isNaN(num) && num >= 1 && num <= this.warehouses.length) {
      targetWarehouse = this.warehouses[num - 1];
    } else {
      // Auto-register custom warehouse if not present
      if (!this.warehouses.some(w => w.toLowerCase() === targetWarehouse.toLowerCase())) {
        this.warehouses.push(targetWarehouse);
        this.saveWarehouses();
      }
    }

    item.warehouse = targetWarehouse;
    item.updatedAt = new Date().toISOString();
    this.saveItems();
    this.render();
    this.showToast(`Moved "${item.name}" to "${targetWarehouse}"`, 'success');
  }

  // ========================================================
  // 9. ITEM MODAL (ADD & EDIT)
  // ========================================================
  openItemModal(item = null) {
    this.itemForm.reset();
    if (item) {
      this.itemModalTitle.textContent = 'Edit Chemical / Product';
      this.itemId.value = item.id;
      this.itemName.value = item.name;
      this.itemWarehouse.value = item.warehouse;
      this.itemQuantity.value = item.quantity;
      this.itemMinThreshold.value = item.minThreshold;
    } else {
      this.itemModalTitle.textContent = 'Add New Chemical / Product';
      this.itemId.value = '';
      this.itemMinThreshold.value = '50';
    }

    this.itemModal.classList.remove('hidden');
    setTimeout(() => this.itemName.focus(), 100);
    lucide.createIcons();
  }

  openEditItemModal(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      this.openItemModal(item);
    }
  }

  closeItemModal() {
    this.itemModal.classList.add('hidden');
    this.itemForm.reset();
  }

  handleSaveItem(e) {
    e.preventDefault();

    const id = this.itemId.value;
    const name = this.itemName.value.trim();
    const warehouse = this.itemWarehouse.value.trim();
    const quantity = parseFloat(this.itemQuantity.value);
    const minThreshold = parseFloat(this.itemMinThreshold.value);

    if (!name || !warehouse || isNaN(quantity)) {
      this.showToast('Please fill out all required fields with valid values', 'error');
      return;
    }

    const cleanQty = Math.max(0, Math.round(quantity * 100) / 100);
    const cleanMin = Math.max(1, Math.round((minThreshold || 50) * 100) / 100);

    // Auto-register warehouse in managed list if not already present
    if (warehouse && !this.warehouses.some(w => w.toLowerCase() === warehouse.toLowerCase())) {
      this.warehouses.push(warehouse);
      this.saveWarehouses();
    }

    if (id) {
      // Update existing
      const index = this.items.findIndex(i => i.id === id);
      if (index !== -1) {
        this.items[index] = {
          ...this.items[index],
          name,
          warehouse,
          quantity: cleanQty,
          minThreshold: cleanMin,
          updatedAt: new Date().toISOString()
        };
        this.showToast(`Updated "${name}" successfully`, 'success');
      }
    } else {
      // Add new
      const newItem = {
        id: 'item-' + Date.now(),
        name,
        warehouse,
        quantity: cleanQty,
        minThreshold: cleanMin,
        updatedAt: new Date().toISOString()
      };
      this.items.unshift(newItem);
      this.showToast(`Added "${name}" to inventory`, 'success');
    }

    this.saveItems();
    this.closeItemModal();
    this.render();
  }

  // ========================================================
  // 10. DELETE CONFIRMATION
  // ========================================================
  openDeleteModal(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    this.itemToDelete = item;
    this.deleteItemName.textContent = `"${item.name}"`;
    this.deleteModal.classList.remove('hidden');
    lucide.createIcons();
  }

  closeDeleteModal() {
    this.deleteModal.classList.add('hidden');
    this.itemToDelete = null;
  }

  handleConfirmDelete() {
    if (!this.itemToDelete) return;
    const name = this.itemToDelete.name;
    this.items = this.items.filter(i => i.id !== this.itemToDelete.id);
    this.saveItems();
    this.closeDeleteModal();
    this.render();
    this.showToast(`Product "${name}" was deleted`, 'info');
  }

  // ========================================================
  // 11. CSV EXPORT & BACKUP
  // ========================================================
  exportToCSV() {
    if (this.items.length === 0) {
      this.showToast('No items to export!', 'error');
      return;
    }

    const headers = ['Chemical / Product Name', 'Warehouse', 'Stock Left (kg)', 'Alert Threshold (kg)', 'Status'];
    const rows = this.items.map(item => {
      const status = this.getItemStatus(item);
      return [
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.warehouse.replace(/"/g, '""')}"`,
        item.quantity,
        item.minThreshold,
        `"${status}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SHREE_VISHWA_PHARMA_CHEM_Stock_Report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast('Stock report exported to CSV successfully!', 'success');
  }

  // ========================================================
  // 12. SETTINGS & DATA RESTORE
  // ========================================================
  openSettingsModal() {
    this.settingsModal.classList.remove('hidden');
    lucide.createIcons();
  }

  closeSettingsModal() {
    this.settingsModal.classList.add('hidden');
  }

  exportJsonBackup() {
    const data = {
      items: this.items,
      sales: this.sales,
      warehouses: this.warehouses,
      settings: this.settings,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SHREE_VISHWA_PHARMA_CHEM_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.showToast('JSON backup downloaded', 'success');
  }

  resetSampleData() {
    if (confirm('Are you sure you want to restore the default sample inventory? Your custom items will be replaced with demo products.')) {
      this.items = [...INITIAL_SAMPLE_ITEMS];
      this.sales = [...INITIAL_SAMPLE_SALES];
      this.warehouses = [...INITIAL_WAREHOUSES];
      this.saveItems();
      this.saveSales();
      this.saveWarehouses();
      this.closeSettingsModal();
      this.render();
      this.showToast('Official product catalog restored successfully', 'success');
    }
  }

  clearAllData() {
    if (confirm('WARNING: This will clear all items from your inventory. Proceed with fresh inventory?')) {
      this.items = [];
      this.sales = [];
      this.saveItems();
      this.saveSales();
      this.closeSettingsModal();
      this.render();
      this.showToast('All items cleared. Inventory is now empty.', 'info');
    }
  }

  // ========================================================
  // 13. TOAST SYSTEM & UTILITIES
  // ========================================================
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-enter pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border';

    let icon = 'info';
    if (type === 'success') {
      toast.classList.add('bg-emerald-950/90', 'border-emerald-700/60', 'text-emerald-200');
      icon = 'check-circle';
    } else if (type === 'error') {
      toast.classList.add('bg-rose-950/90', 'border-rose-700/60', 'text-rose-200');
      icon = 'alert-octagon';
    } else {
      toast.classList.add('bg-slate-900/95', 'border-slate-700', 'text-slate-100');
      icon = 'info';
    }

    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i>
      <span>${this.escapeHTML(message)}</span>
    `;

    this.toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Full Render Trigger
  render() {
    this.updateWarehouseDropdowns();
    this.renderPublicView();
    if (this.isAdminAuthenticated) {
      this.renderAdminView();
    }
    lucide.createIcons();
  }
}

// ========================================================
// 14. INITIALIZATION
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  window.app = new InventoryApp();
});
