// Lead Capture Logic
let currentStep = 1;
const totalSteps = 3;

function nextStep(step) {
    // Basic validation before moving
    if (currentStep === 1 && step === 2) {
        if (!document.getElementById('leadName').value || !document.getElementById('leadEmail').value) {
            alert('Please fill out Name and Email.');
            return;
        }
    }

    const currentForm = document.getElementById(`step${currentStep}`);
    const nextForm = document.getElementById(`step${step}`);

    // Update Progress Bar
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((el, index) => {
        if (index < step) el.classList.add('active');
        else el.classList.remove('active');
    });

    // GSAP Transition
    gsap.to(currentForm, {
        x: step > currentStep ? -50 : 50,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            currentForm.style.display = 'none';
            nextForm.style.display = 'block';
            gsap.fromTo(nextForm, 
                { x: step > currentStep ? 50 : -50, opacity: 0 }, 
                { x: 0, opacity: 1, duration: 0.3 }
            );
            currentStep = step;
        }
    });
}

document.getElementById('leadCaptureForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('submitLeadBtn');
    btn.innerHTML = 'Submitting...';
    btn.disabled = true;

    const data = {
        name: document.getElementById('leadName').value,
        email: document.getElementById('leadEmail').value,
        company: document.getElementById('leadCompany').value,
        projectType: document.getElementById('leadType').value,
        notes: document.getElementById('leadNotes').value,
        budget: document.getElementById('leadBudget').value,
        timeline: document.getElementById('leadTimeline').value
    };

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (result.success) {
            gsap.to('#leadCaptureForm', {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    document.getElementById('leadCaptureForm').style.display = 'none';
                    document.getElementById('leadSuccess').style.display = 'block';
                    gsap.fromTo('#leadSuccess', {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)"});
                }
            });
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred. Please try again.');
        btn.innerHTML = 'Submit Request ✓';
        btn.disabled = false;
    }
});
