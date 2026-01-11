// Client-side Search
(function () {
    let searchIndex = null;
    const searchInput = document.getElementById('search-input');
    const searchModal = document.getElementById('search-modal');
    const searchModalInput = document.getElementById('search-modal-input');
    const searchResults = document.getElementById('search-results');

    // Load search index
    async function loadSearchIndex() {
        if (searchIndex) return searchIndex;
        try {
            const response = await fetch('/search-index.json');
            searchIndex = await response.json();
            return searchIndex;
        } catch (e) {
            console.error('Failed to load search index:', e);
            return [];
        }
    }

    // Initialize Fuse.js (loaded via CDN in production or bundled)
    // For this lightweight version, we'll implement a weighted search if Fuse isn't available,
    // or use Fuse if the user adds it. To keep it 0-dependency for the generator, 
    // we will implement a robust weighted scoring system that mimics Fuse.js basic behavior.

    // NOTE: Optimized for small–medium docs (<500 pages)
    const MAX_INDEX_SIZE = 500;

    function weightedSearch(query, items) {
        if (items.length > MAX_INDEX_SIZE) {
            console.warn(`Search index exceeds optimized size (${items.length} > ${MAX_INDEX_SIZE}). Performance may degrade.`);
        }

        const lowerQuery = query.toLowerCase();
        const terms = lowerQuery.split(/\s+/).filter(t => t.length > 0);

        return items
            .map(item => {
                let score = 0;
                const title = item.title.toLowerCase();
                const headings = item.headings ? item.headings.join(' ').toLowerCase() : '';
                const excerpt = item.excerpt ? item.excerpt.toLowerCase() : '';

                // Exact title match (Highest)
                if (title === lowerQuery) score += 100;
                // Title starts with query
                else if (title.startsWith(lowerQuery)) score += 50;
                // Title contains query
                else if (title.includes(lowerQuery)) score += 20;

                // Check each term
                terms.forEach(term => {
                    if (title.includes(term)) score += 10;
                    if (headings.includes(term)) score += 5;
                    if (excerpt.includes(term)) score += 1;
                });

                return { item, score };
            })
            .filter(r => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(r => r.item)
            .slice(0, 10);
    }

    // Search function
    function search(query) {
        if (!searchIndex || !query.trim()) return [];
        return weightedSearch(query, searchIndex);
    }

    // ... (rest of the file remains similar, just replaced the search logic)

    // Render results
    function renderResults(results) {
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            return;
        }

        searchResults.innerHTML = results.map(item => `
      <a href="${item.url}" class="search-result-item">
        <div class="search-result-title">${item.title}</div>
        <div class="search-result-excerpt">${item.excerpt || ''}</div>
      </a>
    `).join('');
    }

    // Open modal
    function openModal() {
        if (searchModal) {
            searchModal.classList.add('active');
            loadSearchIndex();
            if (searchModalInput) {
                searchModalInput.focus();
                searchModalInput.value = '';
            }
            if (searchResults) {
                searchResults.innerHTML = '';
            }
        }
    }

    // Close modal
    function closeModal() {
        if (searchModal) {
            searchModal.classList.remove('active');
        }
    }

    // Keyboard shortcut: / to open search
    document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            if (e.key === 'Escape') {
                closeModal();
            }
            return;
        }

        if (e.key === '/') {
            e.preventDefault();
            openModal();
        }

        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Click on search input opens modal
    if (searchInput) {
        searchInput.addEventListener('focus', (e) => {
            e.target.blur();
            openModal();
        });
    }

    // Click outside modal closes it
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                closeModal();
            }
        });
    }

    // Search as you type
    if (searchModalInput) {
        searchModalInput.addEventListener('input', async (e) => {
            await loadSearchIndex();
            const results = search(e.target.value);
            renderResults(results);
        });
    }
})();
