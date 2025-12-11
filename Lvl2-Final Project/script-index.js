document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, rgba(255, 240, 255, 1), rgba(255, 200, 255, 1))';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, rgba(255, 240, 255, 0.9), rgba(255, 220, 255, 0.9))';
    });
});
