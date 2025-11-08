const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navMenu.classList.remove('active');

        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('carouselIndicators');

let currentIndex = 0;

function createIndicators() {
    testimonialCards.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');

        indicator.addEventListener('click', () => {
            showTestimonial(index);
        });

        indicatorsContainer.appendChild(indicator);
    });
}

function showTestimonial(index) {
    testimonialCards.forEach(card => {
        card.classList.remove('active');
    });

    document.querySelectorAll('.indicator').forEach(indicator => {
        indicator.classList.remove('active');
    });

    testimonialCards[index].classList.add('active');
    document.querySelectorAll('.indicator')[index].classList.add('active');

    currentIndex = index;
}

function nextTestimonial() {
    let next = currentIndex + 1;
    if (next >= testimonialCards.length) {
        next = 0;
    }
    showTestimonial(next);
}

function prevTestimonial() {
    let prev = currentIndex - 1;
    if (prev < 0) {
        prev = testimonialCards.length - 1;
    }
    showTestimonial(prev);
}

prevBtn.addEventListener('click', prevTestimonial);
nextBtn.addEventListener('click', nextTestimonial);

let autoplayInterval = setInterval(nextTestimonial, 5000);

const testimonialsSection = document.querySelector('.testimonials-section');
testimonialsSection.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
});

testimonialsSection.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextTestimonial, 5000);
});

createIndicators();

const reservationForm = document.getElementById('reservationForm');
const successMessage = document.getElementById('successMessage');

function validateName(name) {
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name must contain only letters';
    }
    return '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
}

function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
        return 'Phone number must be at least 10 digits';
    }
    return '';
}

function validateDate(date) {
    if (!date) {
        return 'Please select a date';
    }

    const selectedDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return 'Date cannot be in the past';
    }
    return '';
}

function validateTime(time) {
    if (!time) {
        return 'Please select a time';
    }

    const [hours] = time.split(':').map(Number);

    if (hours < 7 || hours >= 21) {
        return 'Time must be between 7:00 AM and 9:00 PM';
    }
    return '';
}

function validateGuests(guests) {
    if (!guests) {
        return 'Please select number of guests';
    }
    return '';
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);

    if (message) {
        errorElement.textContent = message;
        inputElement.classList.add('error');
        return false;
    } else {
        errorElement.textContent = '';
        inputElement.classList.remove('error');
        return true;
    }
}

document.getElementById('name').addEventListener('blur', function() {
    const error = validateName(this.value);
    showError('name', error);
});

document.getElementById('email').addEventListener('blur', function() {
    const error = validateEmail(this.value);
    showError('email', error);
});

document.getElementById('phone').addEventListener('blur', function() {
    const error = validatePhone(this.value);
    showError('phone', error);
});

document.getElementById('date').addEventListener('change', function() {
    const error = validateDate(this.value);
    showError('date', error);
});

document.getElementById('time').addEventListener('change', function() {
    const error = validateTime(this.value);
    showError('time', error);
});

document.getElementById('guests').addEventListener('change', function() {
    const error = validateGuests(this.value);
    showError('guests', error);
});

reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const dateError = validateDate(date);
    const timeError = validateTime(time);
    const guestsError = validateGuests(guests);

    const nameValid = showError('name', nameError);
    const emailValid = showError('email', emailError);
    const phoneValid = showError('phone', phoneError);
    const dateValid = showError('date', dateError);
    const timeValid = showError('time', timeError);
    const guestsValid = showError('guests', guestsError);

    if (nameValid && emailValid && phoneValid && dateValid && timeValid && guestsValid) {
        console.log('Reservation submitted:', {
            name,
            email,
            phone,
            date,
            time,
            guests,
            message: document.getElementById('message').value
        });

        successMessage.classList.add('show');

        reservationForm.reset();

        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);

        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        if (!nameValid) document.getElementById('name').focus();
        else if (!emailValid) document.getElementById('email').focus();
        else if (!phoneValid) document.getElementById('phone').focus();
        else if (!dateValid) document.getElementById('date').focus();
        else if (!timeValid) document.getElementById('time').focus();
        else if (!guestsValid) document.getElementById('guests').focus();
    }
});

const today = new Date().toISOString().split('T')[0];
document.getElementById('date').setAttribute('min', today);

console.log('Mood Café - Website loaded successfully');
