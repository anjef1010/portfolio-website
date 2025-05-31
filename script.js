// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});


// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.about-content, .projects-grid, .contact-container');

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(element => {
    observer.observe(element);
});

// Form submission
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        if (!validateForm(nameInput, emailInput, messageInput)) {
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Message sent successfully!');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Form validation function
function validateForm(nameInput, emailInput, messageInput) {
    let isValid = true;
    
    // Reset previous error states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    // Validate name
    if (nameInput.value.trim() === '') {
        markAsError(nameInput);
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        markAsError(emailInput);
        isValid = false;
    }
    
    // Validate message
    if (messageInput.value.trim() === '') {
        markAsError(messageInput);
        isValid = false;
    }
    
    return isValid;
}

// Mark input as error
function markAsError(input) {
    input.parentElement.classList.add('error');
}

// Initialize AOS animation 
document.addEventListener('DOMContentLoaded', () => {
    // Add reveal classes to initial view elements
    if (window.innerWidth > 768) {
        document.querySelector('.hero-content').classList.add('fade-in-left');
        document.querySelector('.hero-img').classList.add('fade-in-right');
    } else {
        document.querySelector('.hero-img').classList.add('fade-in-top');
        document.querySelector('.hero-content').classList.add('fade-in-bottom');
    }
});

window.onload = function() {
    const typewriterText = document.getElementById('typewriter-text');
    
    // Add the 'finished' class after the typing animation completes
    typewriterText.addEventListener('animationend', function() {
        typewriterText.classList.add('finished');
    });
};
