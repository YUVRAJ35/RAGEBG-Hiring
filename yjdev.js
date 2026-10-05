/* ==========================================================================
   YJDEV STUDIOS × RAGE BG - COMMENTS & FEEDBACK STORAGE SYSTEM
   Persists comments, stars, and timestamps locally using localStorage.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'RAGEBG_WEBSITE_COMMENTS';

    // Default sample comments if localStorage is empty
    const defaultComments = [
        {
            id: 'cmt-1',
            name: 'DevCraft_Steve',
            rating: 5,
            message: 'RAGE BG built our Minecraft SMP landing page in 3 days! Clean code, responsive, and super fast load times.',
            timestamp: 'October 1, 2026'
        },
        {
            id: 'cmt-2',
            name: 'Alex_Gamer',
            rating: 5,
            message: 'Loved the UI style for our Youtube creator website. Highly recommended for creators!',
            timestamp: 'October 4, 2026'
        }
    ];

    // DOM Elements
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');
    const commentCountBadge = document.getElementById('commentCountBadge');

    // Load comments from localStorage or initialize defaults
    function getComments() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultComments));
            return defaultComments;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse comments from localStorage', e);
            return [];
        }
    }

    // Save comments array to localStorage
    function saveComments(comments) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    }

    // Render comments into UI
    function renderComments() {
        if (!commentsList) return;

        const comments = getComments();

        // Update count badge
        if (commentCountBadge) {
            commentCountBadge.textContent = `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`;
        }

        if (comments.length === 0) {
            commentsList.innerHTML = `
                <div class="empty-comments">
                    <p style="color: var(--text-muted); text-align: center; padding: 2rem 0;">
                        No comments or reviews yet. Be the first to leave one below!
                    </p>
                </div>
            `;
            return;
        }

        commentsList.innerHTML = comments.map(item => {
            const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
            return `
                <div class="comment-card" data-id="${item.id}">
                    <div class="comment-card-header">
                        <div class="comment-user">
                            <span class="avatar-icon">👤</span>
                            <div>
                                <h4 class="comment-author">${escapeHTML(item.name)}</h4>
                                <span class="comment-date">${escapeHTML(item.timestamp)}</span>
                            </div>
                        </div>
                        <div class="comment-rating" title="${item.rating} Stars">${stars}</div>
                    </div>
                    <p class="comment-body">${escapeHTML(item.message)}</p>
                    <button class="delete-comment-btn" data-id="${item.id}" title="Delete comment">✕ Delete</button>
                </div>
            `;
        }).join('');

        // Attach delete event listeners
        document.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commentId = e.currentTarget.getAttribute('data-id');
                deleteComment(commentId);
            });
        });
    }

    // Add a new comment
    function addComment(name, rating, message) {
        const comments = getComments();
        const newComment = {
            id: 'cmt-' + Date.now(),
            name: name,
            rating: parseInt(rating, 10) || 5,
            message: message,
            timestamp: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        comments.unshift(newComment); // Add to beginning
        saveComments(comments);
        renderComments();
    }

    // Delete a comment by ID
    function deleteComment(id) {
        let comments = getComments();
        comments = comments.filter(c => c.id !== id);
        saveComments(comments);
        renderComments();
    }

    // Utility: sanitize text to prevent HTML injection
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Handle Form Submit
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('commenterName');
            const ratingInput = document.getElementById('commenterRating');
            const messageInput = document.getElementById('commenterMessage');

            const name = nameInput.value.trim();
            const rating = ratingInput.value;
            const message = messageInput.value.trim();

            if (!name || !message) {
                return;
            }

            addComment(name, rating, message);

            // Reset form
            commentForm.reset();

            // Flash feedback notice
            const successNotice = document.getElementById('commentSuccessNotice');
            if (successNotice) {
                successNotice.style.display = 'block';
                setTimeout(() => {
                    successNotice.style.display = 'none';
                }, 3000);
            }
        });
    }

    // Initial render call
    renderComments();
});
