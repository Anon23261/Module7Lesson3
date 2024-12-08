// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// Create stats display
const createStatsDisplay = () => {
    const container = document.querySelector('.container');
    const statsSection = document.createElement('section');
    statsSection.className = 'stats-section';
    statsSection.innerHTML = `
        <h2>Developer Statistics</h2>
        <div class="stats-container">
            <div class="stats-card">
                <h3>Total Profiles</h3>
                <p id="total-profiles">0</p>
            </div>
            <div class="stats-card">
                <h3>Popular Languages</h3>
                <div id="language-stats" class="stats-list"></div>
            </div>
            <div class="stats-card">
                <h3>Experience Levels</h3>
                <div id="expertise-stats" class="stats-list"></div>
            </div>
            <div class="stats-card">
                <h3>Development Platforms</h3>
                <div id="platform-stats" class="stats-list"></div>
            </div>
        </div>
    `;
    container.appendChild(statsSection);
};

// Update stats display
const updateStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const stats = await response.json();
        
        // Update total profiles
        document.getElementById('total-profiles').textContent = stats.total_profiles;
        
        // Update language statistics
        const languageStats = document.getElementById('language-stats');
        languageStats.innerHTML = Object.entries(stats.languages)
            .sort((a, b) => b[1] - a[1])
            .map(([lang, count]) => `
                <div class="stat-item">
                    <span class="stat-label">${lang}</span>
                    <span class="stat-value">${count}</span>
                </div>
            `).join('');
        
        // Update expertise level statistics
        const expertiseStats = document.getElementById('expertise-stats');
        expertiseStats.innerHTML = Object.entries(stats.expertise_levels)
            .map(([level, count]) => `
                <div class="stat-item">
                    <span class="stat-label">${level}</span>
                    <span class="stat-value">${count}</span>
                </div>
            `).join('');
        
        // Update platform statistics
        const platformStats = document.getElementById('platform-stats');
        platformStats.innerHTML = Object.entries(stats.platforms)
            .map(([platform, count]) => `
                <div class="stat-item">
                    <span class="stat-label">${platform}</span>
                    <span class="stat-value">${count}</span>
                </div>
            `).join('');
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
};

// Initialize stats display
createStatsDisplay();
updateStats();

// Form submission handler
document.getElementById('developerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = {
        programmingLanguage: formData.get('programmingLanguage'),
        expertiseLevel: formData.get('expertiseLevel'),
        platforms: formData.getAll('platforms')
    };
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            feedback.classList.add('success');
            feedback.textContent = `✓ ${result.message}`;
            
            // Update stats after successful submission
            updateStats();
            
            // Reset form after 2 seconds
            setTimeout(() => {
                e.target.reset();
                feedback.remove();
            }, 2000);
        } else {
            feedback.classList.add('error');
            feedback.textContent = `✗ Error: ${result.message}`;
        }
    } catch (error) {
        feedback.classList.add('error');
        feedback.textContent = '✗ Error: Could not connect to server';
        console.error('Submission error:', error);
    }
    
    // Remove any existing feedback
    const existingFeedback = e.target.querySelector('.feedback-message');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Add new feedback
    e.target.appendChild(feedback);
});
