// Code Block Copy Functionality
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('.code-block-code');

    if (code) {
        const text = code.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            const originalHtml = button.innerHTML;
            button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied!
      `;
            button.style.color = '#10b981';

            setTimeout(() => {
                button.innerHTML = originalHtml;
                button.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}
