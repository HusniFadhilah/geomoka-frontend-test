/**
 * config-manager.js
 * Memuat konfigurasi dari DB via /api/admin/config/public,
 * menyimpannya di memory, dan mengekspos getter agar seluruh
 * halaman bisa pakai nilai yang sama.
 *
 * Cara pakai:
 *   await AppConfig.ready();           // panggil SEKALI di $(document).ready
 *   AppConfig.get('year.min')          // → 2015
 *   AppConfig.get('analysis.cloud_threshold') // → 10
 *   await AppConfig.updateRemote(key, value)  // tulis ke DB (butuh JWT)
 */

const AppConfig = (() => {
    let _store = {};
    let _token = null;   // JWT admin (opsional, hanya untuk write)
    let _baseUrl = null; // diisi dari window.API_BASE_URL

    // ─── Nilai default (fallback jika API tidak dapat dicapai) ────────────
    const DEFAULTS = {
        'year.min': 2015,
        'year.max': new Date().getFullYear(),
        'year.esri_min': 2017,
        'year.esri_max': 2023,
        'year.esa_threshold': 2021,
        'carbon.co2_factor': 3.67,
        'carbon.vis_min': 0,
        'carbon.vis_max': 200,
        'carbon.vis_palette': '440154,414487,2a788e,22a884,7ad151,fde725',
        'app.name': 'SAVEGEO',
        'app.version': '1.0.0',
    };

    /**
     * Ambil konfigurasi publik dari server.
     * Dipanggil otomatis oleh ready() — tidak perlu dipanggil manual.
     */
    async function _fetch() {
        const base = _baseUrl || window.API_BASE_URL || 'http://localhost:8086/api';
        try {
            const res = await fetch(`${base.replace(/\/api$/, '')}/api/admin/config/public`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            _store = { ...DEFAULTS, ...data };
            console.log(`[AppConfig] ✓ Loaded ${Object.keys(data).length} keys from server`);
        } catch (err) {
            console.warn('[AppConfig] Server unreachable, using defaults:', err.message);
            _store = { ...DEFAULTS };
        }
    }

    /**
     * Tunggu konfigurasi siap. Harus di-await sebelum get() dipanggil.
     * @param {string} [baseUrl] - API base URL (opsional, override window.API_BASE_URL)
     */
    async function ready(baseUrl) {
        if (baseUrl) _baseUrl = baseUrl;
        await _fetch();
    }

    /**
     * Ambil nilai config berdasarkan key.
     * @param {string} key
     * @param {*} [fallback] - Nilai default jika key tidak ada
     */
    function get(key, fallback = null) {
        return key in _store ? _store[key] : (DEFAULTS[key] ?? fallback);
    }

    /**
     * Ambil integer.
     */
    function getInt(key, fallback = 0) {
        const v = get(key, fallback);
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : fallback;
    }

    /**
     * Ambil float.
     */
    function getFloat(key, fallback = 0) {
        const v = get(key, fallback);
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : fallback;
    }

    /**
     * Ambil array dari string CSV (mis. palette warna).
     */
    function getArray(key, fallback = []) {
        const v = get(key);
        if (!v) return fallback;
        if (Array.isArray(v)) return v;
        return String(v).split(',').map(s => s.trim()).filter(Boolean);
    }

    /**
     * Set JWT token untuk operasi tulis (admin).
     */
    function setToken(jwt) {
        _token = jwt;
    }

    /**
     * Tulis satu atau banyak nilai ke DB via PUT /api/admin/config.
     * Memerlukan JWT token (login admin terlebih dahulu).
     *
     * @param {string|Object} keyOrMap - Key string atau object { key: value, ... }
     * @param {*} [value]              - Nilai jika keyOrMap adalah string
     * @returns {Promise<boolean>}
     */
    async function updateRemote(keyOrMap, value) {
        if (!_token) {
            console.error('[AppConfig] updateRemote requires admin JWT. Call setToken(jwt) first.');
            return false;
        }
        const base = _baseUrl || window.API_BASE_URL || 'http://localhost:8086/api';
        const url = `${base.replace(/\/api$/, '')}/api/admin/config`;

        let updates;
        if (typeof keyOrMap === 'string') {
            updates = [{ key: keyOrMap, value }];
            _store[keyOrMap] = value; // optimistic local update
        } else {
            updates = Object.entries(keyOrMap).map(([k, v]) => ({ key: k, value: v }));
            Object.assign(_store, keyOrMap);
        }

        try {
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${_token}`,
                },
                body: JSON.stringify({ updates }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Update failed');
            console.log(`[AppConfig] ✓ Updated ${data.updated?.length ?? 0} keys`);
            return true;
        } catch (err) {
            console.error('[AppConfig] updateRemote failed:', err.message);
            return false;
        }
    }

    /**
     * Reload paksa dari server (berguna setelah admin mengubah config).
     */
    async function reload() {
        await _fetch();
        applyToUI();
    }

    /**
     * Terapkan semua nilai yang sudah dimuat ke elemen UI yang terdaftar.
     * Dipanggil otomatis oleh ready() dan reload().
     */
    function applyToUI() {
        _uiBindings.forEach(([key, apply]) => {
            try { apply(get(key)); } catch (e) { /* elemen belum ada */ }
        });
    }

    // Daftar binding UI → diisi lewat bindUI()
    const _uiBindings = [];

    /**
     * Daftarkan elemen UI agar diperbarui otomatis saat config berubah.
     *
     * @param {string}   key    - Config key
     * @param {Function} apply  - Callback(value) yang memperbarui elemen
     *
     * @example
     * AppConfig.bindUI('year.min', v => $('#yearSlider').attr('min', v));
     */
    function bindUI(key, apply) {
        _uiBindings.push([key, apply]);
    }

    return { ready, get, getInt, getFloat, getArray, setToken, updateRemote, reload, bindUI, applyToUI };
})();

// Ekspos ke scope global agar bisa dipakai dari <script> inline
window.AppConfig = AppConfig;