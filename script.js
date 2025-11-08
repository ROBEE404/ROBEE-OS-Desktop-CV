        let draggedWindow = null;
        let offsetX = 0, offsetY = 0;
        let isDarkMode = true;
        let currentThemeColor = '#6366f1';

        // ============================================
        // DEFAULT WALLPAPER CONFIGURATION
        // Change this path to set your default wallpaper
        // ============================================
        const DEFAULT_WALLPAPER = 'wallpaper/vidoev2.gif'; // Put your image path here (e.g., 'wallpaper.jpg' or 'https://example.com/image.jpg')
        // ============================================

        // Apply default wallpaper on page load
        if (DEFAULT_WALLPAPER) {
            document.getElementById('desktop').style.backgroundImage = `url(${DEFAULT_WALLPAPER})`;
            document.getElementById('desktop').style.backgroundSize = 'cover';
            document.getElementById('desktop').style.backgroundPosition = 'center';
        }

        // ============================================
        // WELCOME TEXT COLOR CONFIGURATION
        // Change these colors for "Welcome to ROBEE's Terminal CV"
        // ============================================
        const WELCOME_COLOR_DARK = '#6366f1';  // Blue/Purple for dark mode
        const WELCOME_COLOR_LIGHT = '#8b5cf6'; // Purple for light mode
        // ============================================

        // TERMINAL PROMPT COLOR CONFIGURATION
        // Change these colors for the terminal prompt (➜ 0xROBEE@CV:)
        // ============================================
        const PROMPT_COLOR_DARK = '#10b981';  // Green for dark mode
        const PROMPT_COLOR_LIGHT = '#0891b2'; // Cyan for light mode
        // ============================================

        // Apply welcome text colors
        document.documentElement.style.setProperty('--welcome-text-color', WELCOME_COLOR_DARK);
        
        // Apply prompt colors
        document.documentElement.style.setProperty('--terminal-prompt-dark', PROMPT_COLOR_DARK);
        document.documentElement.style.setProperty('--terminal-prompt-light', PROMPT_COLOR_LIGHT);

        // Loading Screen
        setTimeout(() => {
            document.getElementById('loading').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('welcome-modal').style.display = 'flex';
            }, 500);
        }, 3000);

        function closeWelcome() {
            document.getElementById('welcome-modal').style.display = 'none';
        }

        function openTerminal() {
            closeWelcome();
            toggleWindow('terminal-window');
            typeWelcomeMessage();
        }

        // Terminal Welcome Animation
        function typeWelcomeMessage() {
            const welcomeText = document.getElementById('welcome-text');
            const text = "Welcome to ROBEE's Terminal CV";
            let i = 0;
            welcomeText.textContent = '';
            
            const typing = setInterval(() => {
                welcomeText.textContent += text[i];
                i++;
                if (i >= text.length) clearInterval(typing);
            }, 50);
        }

        // Terminal Commands
        document.getElementById('terminal-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = e.target.value.trim().toLowerCase();
                e.target.value = '';
                handleCommand(command);
            }
        });

        // Scroll to Bottom Functionality
        const terminalOutput = document.getElementById('terminal-output');
        const scrollButton = document.getElementById('scroll-to-bottom');

        function checkScrollPosition() {
            const container = terminalOutput.parentElement;
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            
            // Show button if not at bottom and there's content to scroll
            if (scrollHeight - scrollTop - clientHeight > 50) {
                scrollButton.classList.add('show');
            } else {
                scrollButton.classList.remove('show');
            }
        }

        function scrollToBottom() {
            const container = terminalOutput.parentElement;
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }

        // Monitor scroll on terminal window
        document.querySelector('#terminal-window .window-content').addEventListener('scroll', checkScrollPosition);

        function handleCommand(command) {
            const output = document.getElementById('terminal-output');
            
            const commandLine = document.createElement('p');
            commandLine.innerHTML = `<span class="terminal-prompt">➜</span> ${command}`;
            commandLine.style.marginTop = '15px';
            output.appendChild(commandLine);

            let response;
            switch(command) {
                case 'help':
                    response = `<div class="command-response">
                        <p><strong>Available commands:</strong></p>
                        <ul>
                            <li><span class="accent">help</span> - Show this help</li>
                            <li><span class="accent">about</span> - About me</li>
                            <li><span class="accent">contact</span> - Contact information</li>
                            <li><span class="accent">skills</span> - Technical skills</li>
                            <li><span class="accent">clear</span> - Clear terminal</li>
                        </ul>
                    </div>`;
                    break;
                    
                case 'about':
                    response = `<div class="command-response">
                        <p>IT specialist with expertise in system optimization, troubleshooting, and support. Proficient in Linux/Windows environments, ensuring seamless system operations. Skilled in web development, database management, and responsive design, with strong problem-solving and communication skills. Committed to delivering efficient technical solutions for optimal IT performance.</p>
                    </div>`;
                    break;
                    
                case 'contact':
                    response = `<div class="command-response">
                        <p>📧 <span class="accent">Email:</span> 0xrobee@gmail.com</p>
                        <p>💻 <span class="accent">GitHub:</span> github.com/ROBEE404</p>
                    </div>`;
                    break;
                    
                case 'skills':
                    response = `<div class="command-response">
                        <div class="skills-grid">
                            <div class="skill-category">
                                <h3>Frontend</h3>
                                <ul>
                                    <li>Html & Css</li>
                                    <li>JavaScript</li>
                                    <li>TypeScript</li>
                                    <li>React</li>
                                    <li>Tailwind CSS</li>
                                </ul>
                            </div>
                            <div class="skill-category">
                                <h3>Backend</h3>
                                <ul>
                                    <li>Node.js</li>
                                    <li>Python</li>
                                    <li>PostgreSQL</li>
                                </ul>
                            </div>
                        </div>
                    </div>`;
                    break;
                    
                case 'clear':
                    output.innerHTML = `
                        <p id="welcome-text"></p>
                        <p class="help-text">Type 'help' to see available commands</p>
                    `;
                    typeWelcomeMessage();
                    return;
                    
                default:
                    response = `<p class="error">Command not found: ${command}. Type 'help' for available commands.</p>`;
            }

            const responseElement = document.createElement('div');
            responseElement.innerHTML = response;
            output.appendChild(responseElement);
            
            // Check if scroll button should appear
            checkScrollPosition();
        }

        // Window Management
        function toggleWindow(windowId) {
            const window = document.getElementById(windowId);
            if (window.style.display === 'none' || window.style.display === '') {
                window.style.display = 'flex';
                setActiveWindow(window);
                updateDockIcons();
            } else {
                closeWindow(windowId);
            }
        }

        function closeWindow(windowId) {
            document.getElementById(windowId).style.display = 'none';
            updateDockIcons();
            checkMaximizedWindows();
        }

        function minimizeWindow(windowId) {
            document.getElementById(windowId).style.display = 'none';
            updateDockIcons();
            checkMaximizedWindows();
        }

        function maximizeWindow(windowId) {
            const window = document.getElementById(windowId);
            const isMaximized = window.dataset.maximized === 'true';
            
            if (!isMaximized) {
                window.dataset.originalStyle = window.style.cssText;
                window.style.left = '20px';
                window.style.top = '20px';
                window.style.width = 'calc(100vw - 40px)';
                window.style.height = 'calc(100vh - 120px)';
                window.style.maxWidth = 'calc(100vw - 40px)';
                window.style.maxHeight = 'calc(100vh - 120px)';
                window.dataset.maximized = 'true';
                checkMaximizedWindows();
            } else {
                window.style.cssText = window.dataset.originalStyle;
                window.dataset.maximized = 'false';
                checkMaximizedWindows();
            }
        }

        function checkMaximizedWindows() {
            const windows = document.querySelectorAll('.window');
            let hasMaximized = false;
            
            windows.forEach(win => {
                if (win.dataset.maximized === 'true' && win.style.display === 'flex') {
                    hasMaximized = true;
                }
            });
            
            const themeToggle = document.getElementById('theme-toggle');
            const themeTrigger = document.getElementById('theme-toggle-trigger');
            
            if (hasMaximized) {
                themeToggle.classList.add('maximized-mode');
                themeTrigger.style.display = 'flex';
            } else {
                themeToggle.classList.remove('maximized-mode');
                themeToggle.classList.remove('visible');
                themeTrigger.style.display = 'none';
            }
        }

        function toggleThemeVisibility() {
            const themeToggle = document.getElementById('theme-toggle');
            const themeTrigger = document.getElementById('theme-toggle-trigger');
            
            themeTrigger.classList.add('active');
            setTimeout(() => themeTrigger.classList.remove('active'), 600);
            
            if (!themeToggle.classList.contains('visible')) {
                themeToggle.classList.add('visible');
                setTimeout(() => {
                    themeToggle.classList.remove('visible');
                }, 3000);
            }
        }

        function setActiveWindow(window) {
            document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
            window.classList.add('active');
        }

        function updateDockIcons() {
            const windows = ['terminal-window', 'notepad-window', 'settings-window'];
            const dockIcons = document.querySelectorAll('.dock-icon');
            
            windows.forEach((windowId, index) => {
                const window = document.getElementById(windowId);
                if (window.style.display === 'flex') {
                    dockIcons[index].classList.add('active');
                } else {
                    dockIcons[index].classList.remove('active');
                }
            });
        }

        // Drag Window Functionality
        document.querySelectorAll('.window-header').forEach(header => {
            header.addEventListener('mousedown', startDrag);
        });

        function startDrag(e) {
            if (e.target.classList.contains('window-btn')) return;
            
            draggedWindow = e.target.closest('.window');
            setActiveWindow(draggedWindow);
            
            const rect = draggedWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }

        function drag(e) {
            if (!draggedWindow) return;
            
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            
            newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
            newY = Math.max(0, Math.min(newY, window.innerHeight - 100));
            
            draggedWindow.style.left = newX + 'px';
            draggedWindow.style.top = newY + 'px';
        }

        function stopDrag() {
            draggedWindow = null;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }

        // Theme Toggle
        function toggleTheme() {
            isDarkMode = !isDarkMode;
            const body = document.body;
            const themeToggle = document.getElementById('theme-toggle');
            const modeDisplay = document.getElementById('mode-display');
            
            if (isDarkMode) {
                body.classList.remove('light-mode');
                themeToggle.textContent = '🌙';
                if (modeDisplay) modeDisplay.textContent = 'Dark';
                document.documentElement.style.setProperty('--welcome-text-color', WELCOME_COLOR_DARK);
            } else {
                body.classList.add('light-mode');
                themeToggle.textContent = '☀️';
                if (modeDisplay) modeDisplay.textContent = 'Light';
                document.documentElement.style.setProperty('--welcome-text-color', WELCOME_COLOR_LIGHT);
            }
        }

        // Theme Color Change
        function changeThemeColor(color) {
            currentThemeColor = color;
            document.documentElement.style.setProperty('--accent', color);
            
            const lighterColor = adjustColor(color, 20);
            document.documentElement.style.setProperty('--accent-light', lighterColor);
            
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('active');
            });
            event.target.classList.add('active');
            
            const dockIcons = document.querySelectorAll('.dock-icon');
            dockIcons[0].style.background = color;
        }

        function adjustColor(color, percent) {
            const num = parseInt(color.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                (B < 255 ? B < 1 ? 0 : B : 255))
                .toString(16).slice(1);
        }

        // Background Management
        function uploadBackground(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    setBackground(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }

        function setBackgroundFromUrl() {
            const url = document.getElementById('bg-url').value.trim();
            if (url) {
                setBackground(url);
            }
        }

        function setBackground(imageUrl) {
            const desktop = document.getElementById('desktop');
            desktop.style.backgroundImage = `url(${imageUrl})`;
            desktop.style.backgroundSize = 'cover';
            desktop.style.backgroundPosition = 'center';
        }

        function removeBackground() {
            const desktop = document.getElementById('desktop');
            desktop.style.backgroundImage = 'none';
            document.getElementById('bg-url').value = '';
        }

        // Click outside to deactivate windows
        document.getElementById('desktop').addEventListener('mousedown', (e) => {
            if (e.target.id === 'desktop') {
                document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
            }
        });

        // Make windows clickable to activate
        document.querySelectorAll('.window').forEach(window => {
            window.addEventListener('mousedown', () => {
                setActiveWindow(window);
            });
        });

        // Prevent text selection while dragging
        document.addEventListener('selectstart', (e) => {
            if (draggedWindow) e.preventDefault();
        });