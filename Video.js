document.addEventListener('DOMContentLoaded', () => {
    const cardsTrack = document.getElementById('cardsTrack');
    let videoCards = document.querySelectorAll('.video-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationDotsContainer = document.getElementById('paginationDots');

    let cardsPerPage = 3; // Default for larger screens
    let currentIndex = 0; // Current index in the original array

    // Function to calculate the full width of a card including its margins/gaps
    const getCardFullWidth = () => {
        if (videoCards.length === 0) return 0;
        const cardStyle = getComputedStyle(videoCards[0]);
        const cardWidth = videoCards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(cardsTrack).gap || '0'); // Get gap from cards-track
        return cardWidth + gap; // Card width plus the gap to the next card
    };

    // Function to update cards per page based on screen width
    const updateCardsPerPage = () => {
        if (window.innerWidth <= 768) { // Mobile
            cardsPerPage = 1;
        } else if (window.innerWidth <= 1200) { // Tablet/Smaller Desktop
            cardsPerPage = 2;
        } else { // Larger Desktop
            cardsPerPage = 3;
        }
        // Recalculate and re-render carousel components based on new cardsPerPage
        setupCarousel();
        createPaginationDots();
        updateCarousel(false); // Initial positioning without animation
    };

    // Function to create pagination dots
    const createPaginationDots = () => {
        paginationDotsContainer.innerHTML = ''; // Clear existing dots
        const realCards = Array.from(document.querySelectorAll('.video-card:not(.is-clone)'));
        const totalPages = Math.ceil(realCards.length / cardsPerPage);
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.page = i;
            dot.addEventListener('click', () => {
                // When clicking a dot, jump to the start of that 'page' of real cards
                currentIndex = (i * cardsPerPage) + cardsPerPage; // Add cardsPerPage offset for initial clones
                updateCarousel();
            });
            paginationDotsContainer.appendChild(dot);
        }
    };

    // Function to update carousel position and active dot
    const updateCarousel = (animated = true) => {
        const cardFullWidth = getCardFullWidth();
        
        // Calculate the translation based on the current index and cards per page
        // The `currentIndex` now refers to the index within the `videoCards` array
        // which includes clones. We want to display `cardsPerPage` cards at a time.
        // The offset calculation needs to be precise for multi-card display.
        const offset = currentIndex * cardFullWidth;

        cardsTrack.style.transition = animated ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
        cardsTrack.style.transform = `translateX(${-offset}px)`;

        // Update active pagination dot
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
        // Calculate the current page based on the REAL card index
        const totalRealCards = document.querySelectorAll('.video-card:not(.is-clone)').length;
        // The real index is currentIndex minus the number of prepended clones (which is cardsPerPage)
        let realCardIndex = currentIndex - cardsPerPage;
        if (realCardIndex < 0) { // If we are in the last set of clones
             realCardIndex = totalRealCards + realCardIndex; // Wrap around to the end of real cards
        } else if (realCardIndex >= totalRealCards) { // If we are in the first set of clones
            realCardIndex = realCardIndex - totalRealCards; // Wrap around to the beginning of real cards
        }

        const currentPage = Math.floor(realCardIndex / cardsPerPage);
        const activeDot = document.querySelector(`.dot[data-page="${currentPage}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }
    };

    // Setup for continuous carousel (cloning cards)
    const setupCarousel = () => {
        // Clear existing clones if any
        const currentClones = cardsTrack.querySelectorAll('.is-clone');
        currentClones.forEach(clone => clone.remove());

        const realCards = Array.from(document.querySelectorAll('.video-card:not(.is-clone)'));
        const totalRealCards = realCards.length;

        if (totalRealCards <= cardsPerPage) {
            // If there are fewer or equal real cards than cards per page, no cloning needed
            videoCards = realCards; // Reset videoCards to only real ones
            cardsTrack.style.transform = `translateX(0px)`; // Reset position
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            paginationDotsContainer.innerHTML = ''; // No dots if not enough cards
            return;
        }

        prevBtn.disabled = false;
        nextBtn.disabled = false;

        // Clone cards to create a continuous loop effect
        // Clone from the end to prepend (need enough clones to fill a 'page' view)
        for (let i = 0; i < cardsPerPage; i++) {
            const clone = realCards[totalRealCards - 1 - i].cloneNode(true);
            clone.classList.add('is-clone');
            cardsTrack.prepend(clone);
        }
        // Clone from the beginning to append
        for (let i = 0; i < cardsPerPage; i++) {
            const clone = realCards[i].cloneNode(true);
            clone.classList.add('is-clone');
            cardsTrack.appendChild(clone);
        }

        // Re-query all cards including clones
        videoCards = document.querySelectorAll('.video-card');

        // Adjust currentIndex to start at the first real card (after the prepended clones)
        currentIndex = cardsPerPage; 
        updateCarousel(false); // No animation for initial positioning

        // Attach event listeners for cloned cards
        attachCardEventListeners();
    };


    // Function to attach event listeners to all video cards (including clones)
    const attachCardEventListeners = () => {
        // Remove old listeners to prevent duplicates
        document.querySelectorAll('.video-card').forEach(card => { // Iterate over all cards
            const playOverlay = card.querySelector('.play-overlay');
            if (playOverlay) playOverlay.removeEventListener('click', handleVideoPlay);
            const watchButton = card.querySelector('.watch-button');
            if (watchButton) watchButton.removeEventListener('click', handleWatchButtonClick);
        });

        // Add new listeners
        document.querySelectorAll('.video-card').forEach(card => {
            const playOverlay = card.querySelector('.play-overlay');
            if (playOverlay) playOverlay.addEventListener('click', handleVideoPlay);
            const watchButton = card.querySelector('.watch-button');
            // Re-attach the original behavior for the watch button
            if (watchButton) {
                // Get the original link if available, or use a placeholder
                const originalLink = watchButton.getAttribute('onclick') ? 
                                     watchButton.getAttribute('onclick').match(/window\.open\('([^']*)'/)[1] : '#';
                watchButton.onclick = () => window.open(originalLink, '_blank');
            }
        });
    };

    // Handle video play from play overlay (for demonstration)
    const handleVideoPlay = (event) => {
        event.stopPropagation();
        const card = event.target.closest('.video-card');
        const videoTitle = card.querySelector('.video-title').textContent;
        // In a real application, you would open a modal/iframe for video playback
        alert(`Playing video: "${videoTitle}" (Placeholder - integrate your video player here!)`);
    };

    // Navigation button event listeners
    prevBtn.addEventListener('click', () => {
        const totalRealCards = document.querySelectorAll('.video-card:not(.is-clone)').length;
        const cardFullWidth = getCardFullWidth();

        currentIndex--;
        updateCarousel();

        // If we move into the cloned segment before the real cards, jump to the end
        if (currentIndex < cardsPerPage) {
            setTimeout(() => {
                cardsTrack.style.transition = 'none';
                currentIndex = totalRealCards + currentIndex; // Adjust to a corresponding card in the real set
                cardsTrack.style.transform = `translateX(${-currentIndex * cardFullWidth}px)`;
                // Re-enable transition after a very short delay
                setTimeout(() => {
                    cardsTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 50);
            }, 600); // Match this with carousel transition duration
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalRealCards = document.querySelectorAll('.video-card:not(.is-clone)').length;
        const cardFullWidth = getCardFullWidth();

        currentIndex++;
        updateCarousel();

        // If moved into the cloned segment at the end, reset to first real card
        // We've moved past the last real card (index totalRealCards + cardsPerPage - 1)
        // so if currentIndex is totalRealCards + cardsPerPage, it means we are at the first cloned set
        if (currentIndex >= totalRealCards + cardsPerPage) {
            setTimeout(() => {
                cardsTrack.style.transition = 'none';
                currentIndex = cardsPerPage; // Jump to the first real card
                cardsTrack.style.transform = `translateX(${-currentIndex * cardFullWidth}px)`;

                // Re-enable transition after a short delay
                setTimeout(() => {
                    cardsTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 50);
            }, 600); // Match the animation duration
        }
    });


    // Initialize carousel on load and resize
    updateCardsPerPage(); // This will call setupCarousel, createPaginationDots, and updateCarousel

    window.addEventListener('resize', () => {
        // Prevent layout issues during resize by resetting transition
        cardsTrack.style.transition = 'none'; 
        updateCardsPerPage();
    });
});