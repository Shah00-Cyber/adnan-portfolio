/**
 * Mohd Shah Adnan Portfolio - Script File
 * Interactive features for high-conversion Clinical Luxury Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Navigation Scroll Effect
    // ==========================================
    const mainNav = document.getElementById('main-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 2. Mobile Sticky Hire Bar Display Trigger
    // ==========================================
    const mobileStickyBar = document.getElementById('mobile-sticky');
    const heroSection = document.getElementById('hero');

    window.addEventListener('scroll', () => {
        if (heroSection) {
            const heroHeight = heroSection.offsetHeight;
            // Show sticky bar on scroll past hero section
            if (window.scrollY > (heroHeight - 100)) {
                mobileStickyBar.classList.add('visible');
            } else {
                mobileStickyBar.classList.remove('visible');
            }
        }
    });

    // ==========================================
    // 3. Contact/Hiring Modal Toggle
    // ==========================================
    const modal = document.getElementById('contact-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const openModalBtns = document.querySelectorAll('.btn-open-modal');

    // Function to open modal
    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    };

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable background scrolling
    };

    // Attach click listeners to all opening triggers
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // Close on click close button
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close on clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on pressing Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================
    // 4. LocalStorage-backed Countdown Timer
    // ==========================================
    const hoursVal = document.getElementById('hours');
    const minutesVal = document.getElementById('minutes');
    const secondsVal = document.getElementById('seconds');

    const COUNTDOWN_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    const startCountdown = () => {
        let deadline = localStorage.getItem('adnan_portfolio_deadline');
        const now = new Date().getTime();

        // If no deadline is set, or the deadline has already passed, reset the 3-hour window
        if (!deadline || parseInt(deadline) < now) {
            deadline = now + COUNTDOWN_DURATION;
            localStorage.setItem('adnan_portfolio_deadline', deadline.toString());
        } else {
            deadline = parseInt(deadline);
        }

        const updateTimer = () => {
            const currentTime = new Date().getTime();
            const difference = deadline - currentTime;

            if (difference <= 0) {
                // Timer finished: reset to another 3 hours to maintain FOMO/urgency indefinitely
                const newDeadline = new Date().getTime() + COUNTDOWN_DURATION;
                localStorage.setItem('adnan_portfolio_deadline', newDeadline.toString());
                deadline = newDeadline;
                return;
            }

            // Calculations for hours, minutes, and seconds
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Format numbers to always show two digits
            if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
            if (minutesVal) minutesVal.textContent = String(minutes).padStart(2, '0');
            if (secondsVal) secondsVal.textContent = String(seconds).padStart(2, '0');
        };

        // Run once immediately, then interval every second
        updateTimer();
        setInterval(updateTimer, 1000);
    };

    startCountdown();

    // ==========================================
    // 5. Form Submission Handling with Toast
    // ==========================================
    const hireForm = document.getElementById('hire-form');
    const successToast = document.getElementById('success-toast');

    if (hireForm) {
        hireForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Intercept real submit

            // Read form inputs
            const companyName = document.getElementById('company-name').value;
            const clientEmail = document.getElementById('client-email').value;
            const contractType = document.getElementById('contract-type').value;
            const message = document.getElementById('message').value;

            // Log submission metadata (simulating backend capture)
            console.log('--- Proposal Received ---');
            console.log('Company:', companyName);
            console.log('Contact Email:', clientEmail);
            console.log('Scope:', contractType);
            console.log('Message:', message);
            console.log('Timestamp:', new Date().toISOString());
            console.log('-------------------------');

            // Disable submit button during submit to prevent double submit
            const submitBtn = hireForm.querySelector('.form-submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending Proposal...";

            // Submit using FormSubmit AJAX API
            fetch("https://formsubmit.co/ajax/mohammadshahadnan427@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `New Contract Proposal from ${companyName}`,
                    _template: "table",
                    "Organization Name": companyName,
                    "Work Email": clientEmail,
                    "Contract Model": contractType,
                    "Scope of Work": message
                })
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Reset form inputs
                hireForm.reset();

                // Close hiring modal
                closeModal();

                // Trigger beautiful Toast Notification
                if (successToast) {
                    successToast.classList.add('active');

                    // Auto-dismiss toast after 4 seconds
                    setTimeout(() => {
                        successToast.classList.remove('active');
                    }, 4000);
                }
            })
            .catch(error => {
                console.error("FormSubmit Error, falling back to mailto:", error);
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Fallback to mailto link if offline/API fails
                const subject = encodeURIComponent(`Contract Proposal: ${companyName}`);
                const bodyText = `Dear Mohd Shah Adnan,

We would like to submit a contract proposal with the following details:

- Organization: ${companyName}
- Work Email: ${clientEmail}
- Contract Type: ${contractType}

Scope of Work:
${message}

Best regards,
${companyName}`;
                
                const mailtoLink = `mailto:mohammadshahadnan427@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
                window.location.href = mailtoLink;

                // Reset form inputs & close modal
                hireForm.reset();
                closeModal();

                // Trigger Toast Notification
                if (successToast) {
                    successToast.classList.add('active');
                    setTimeout(() => {
                        successToast.classList.remove('active');
                    }, 4000);
                }
            });
        });
    }

});
