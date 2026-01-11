// Theme Toggle
(function () {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved preference or default to dark
    const savedTheme = localStorage.getItem('docgenie-theme');
    if (savedTheme) {
        html.classList.toggle('dark', savedTheme === 'dark');
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.setItem('docgenie-theme', html.classList.contains('dark') ? 'dark' : 'light');
        });
    }
})();
