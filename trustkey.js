// TrustKey: Basic client-side protection (not a real anti-DDoS)
(function() {
    // Clickjacking protection
    if (window.top !== window.self) {
        document.body.innerHTML = '<div style="color:#fff;background:#111;font-family:monospace;padding:2rem;text-align:center;font-size:1.5rem;">Přístup zamítnut: TrustKey chrání tento web.</div>';
        throw new Error('TrustKey: Frame embedding blocked');
    }

    // Basic reload/refresh rate limiting
    let lastReload = localStorage.getItem('trustkey_last_reload');
    let now = Date.now();
    if (lastReload && now - lastReload < 3000) {
        document.body.innerHTML = '<div style="color:#fff;background:#111;font-family:monospace;padding:2rem;text-align:center;font-size:1.5rem;">Příliš časté načítání stránky. Zkuste to za chvíli.<br>TrustKey ochrana aktivní.</div>';
        throw new Error('TrustKey: Too many reloads');
    }
    localStorage.setItem('trustkey_last_reload', now);

    // Basic anti-bot: block right click and some shortcuts
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    document.addEventListener('keydown', function(e) {
        // Block F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
            (e.ctrlKey && e.key.toLowerCase() === 'u') ||
            (e.ctrlKey && e.key.toLowerCase() === 's')
        ) {
            e.preventDefault();
            alert('TrustKey: Tato akce je blokována z bezpečnostních důvodů.');
        }
    });

    // Basic request rate limiting (per tab)
    let clickCount = 0;
    document.addEventListener('click', function() {
        clickCount++;
        if (clickCount > 30) {
            alert('TrustKey: Detekována podezřelá aktivita. Zpomalte prosím.');
            clickCount = 0;
        }
        setTimeout(() => { clickCount = Math.max(0, clickCount - 1); }, 2000);
    });
})(); 