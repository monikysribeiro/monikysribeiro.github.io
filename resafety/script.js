function translatePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'en';

    // Traduz elementos com atributos `data-lang-pt` e `data-lang-en`
    document.querySelectorAll('[data-lang-pt]').forEach(element => {
        const text = lang === 'en' ?
            element.getAttribute('data-lang-en') :
            element.getAttribute('data-lang-pt');

        if (text) {
            // Usa innerHTML para elementos que precisam renderizar HTML como <br>
            if (
                element.classList.contains('description') ||
                element.classList.contains('video-title')
            ) {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }
    });

    // Ajusta links de navegação para incluir o parâmetro de idioma
    document.querySelectorAll("nav a").forEach(link => {
        const href = new URL(link.getAttribute('href'), window.location.href);
        href.searchParams.set("lang", lang);
        link.setAttribute('href', href.href);
    });
}

// Função para o toggle do menu em telas pequenas
function toggleMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
}

// Executa as funções quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    translatePage();
    toggleMenu();
});
