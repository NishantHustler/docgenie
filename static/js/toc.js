// Table of Contents Scroll Spy
(function () {
    const tocItems = document.querySelectorAll('.toc-item[data-heading]');
    if (tocItems.length === 0) return;

    // Get all headings that have TOC entries
    const headings = [];
    tocItems.forEach(item => {
        const headingId = item.getAttribute('data-heading');
        const heading = document.getElementById(headingId);
        if (heading) {
            headings.push({ id: headingId, element: heading, tocItem: item });
        }
    });

    if (headings.length === 0) return;

    // Intersection Observer for scroll spy
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active from all
                    tocItems.forEach(item => item.classList.remove('active'));

                    // Add active to current
                    const activeHeading = headings.find(h => h.element === entry.target);
                    if (activeHeading) {
                        activeHeading.tocItem.classList.add('active');
                    }
                }
            });
        },
        {
            rootMargin: '-80px 0px -80% 0px',
            threshold: 0
        }
    );

    // Observe all headings
    headings.forEach(h => observer.observe(h.element));

    // Set initial active state
    if (headings.length > 0) {
        tocItems.forEach(item => item.classList.remove('active'));
        headings[0].tocItem.classList.add('active');
    }
})();
