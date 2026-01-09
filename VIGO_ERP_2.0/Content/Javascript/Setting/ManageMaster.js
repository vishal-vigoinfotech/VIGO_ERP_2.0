$(document).ready(function () {
    // Scroll fade-in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    $('.fade-up').each(function () {
        observer.observe(this);
    });

    // Click feedback
    $('.module-item').on('click', function () {
        const title = $(this).find('.module-title').text().trim();
        const uniqueClass = $(this).attr('class').match(/mdm-module-\S+/)[0];
        console.log(`Navigation: ${title} → Use class: .${uniqueClass}`);

        $(this).addClass('pulse');
        setTimeout(() => $(this).removeClass('pulse'), 600);
    });

    // Pulse animation
    $('head').append(`
                <style>
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                    .pulse { animation: pulse 0.6s ease; }
                </style>
            `);
});