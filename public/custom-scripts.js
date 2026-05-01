// frontend\public\custom-scripts.js
// ==========================================
// SIDEBAR NAVIGATION FUNCTIONS
// ==========================================
function toggleSidebar() {
    const sidebar = $('#mainSidebar');

    sidebar.toggleClass('collapsed');

    // Save state
    const isCollapsed = sidebar.hasClass('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);

    console.log('✅ Sidebar:', isCollapsed ? 'collapsed' : 'expanded');

    // Update tooltips
    setTimeout(updateTooltips, 300);
}

function toggleMobileSidebar() {
    $('#mainSidebar').toggleClass('mobile-open');
}

function switchModule(moduleName) {
    $('.module-container').removeClass('active');
    $(`#module-${moduleName}`).addClass('active');
    $('.sidebar-menu-item').removeClass('active');
    $(`#menu-${moduleName}`).addClass('active');
    $('#mainSidebar').removeClass('mobile-open');
    localStorage.setItem('currentModule', moduleName);
    if (typeof window.onModuleShown === 'function') {
        window.onModuleShown(moduleName);
    }
    console.log(`✅ Module: ${moduleName}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateTooltips() {
    const sidebar = $('#mainSidebar');
    if (sidebar.hasClass('collapsed')) {
        $('#menu-carbon').attr('data-tooltip', 'Analisis Stok Karbon');
        $('#menu-disaster').attr('data-tooltip', 'Pemetaan Bencana');
    } else {
        $('.sidebar-menu-item').removeAttr('data-tooltip');
    }
}

// Initialize
$(document).ready(function () {
    console.log('🚀 Initializing sidebar...');

    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === null || savedState === 'true') {
        $('#mainSidebar').addClass('collapsed');
    } else {
        $('#mainSidebar').removeClass('collapsed');
    }

    const currentModule = localStorage.getItem('currentModule') || 'carbon';
    switchModule(currentModule);
    updateTooltips();

    console.log('✅ Sidebar ready!');
});

// Close mobile sidebar on outside click
$(document).on('click', function (e) {
    const sidebar = $('#mainSidebar');
    const toggleBtn = $('.mobile-menu-toggle');
    if (sidebar.hasClass('mobile-open') &&
        !sidebar.is(e.target) &&
        sidebar.has(e.target).length === 0 &&
        !toggleBtn.is(e.target)) {
        sidebar.removeClass('mobile-open');
    }
});

// Global functions
window.toggleSidebar = toggleSidebar;
window.toggleMobileSidebar = toggleMobileSidebar;
window.switchModule = switchModule;

console.log('✅ custom-scripts.js loaded');
