document.addEventListener('DOMContentLoaded', () => {
    // Add tab functionality
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Add stars to background
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.backgroundColor = '#fff';
        star.style.borderRadius = '50%';
        star.style.opacity = Math.random();
        star.style.animation = `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`;
        starsContainer.appendChild(star);
    }

    // Load favicons
    document.querySelectorAll('.app-icon').forEach(img => {
        img.src = img.dataset.favicon;
        img.onerror = () => {
            img.style.display = 'none';
        };
    });

    // Modal and iframe handling
    const modal = document.getElementById('openModal');
    const iframeContainer = document.getElementById('iframeContainer');
    const bypassFrame = document.getElementById('bypassFrame');
    let currentUrl = '';

    document.querySelectorAll('.app-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentUrl = button.dataset.url;
            modal.style.display = 'flex';
        });
    });

    document.querySelector('.close-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('openBlank').addEventListener('click', () => {
        const win = window.open();
        if (win) {
            win.document.body.style.margin = '0';
            win.document.body.style.height = '100vh';
            const iframe = win.document.createElement('iframe');
            iframe.style.border = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.margin = '0';
            iframe.src = currentUrl;
            win.document.body.appendChild(iframe);
        }
        modal.style.display = 'none';
    });

    document.getElementById('openHere').addEventListener('click', () => {
        bypassFrame.src = currentUrl;
        iframeContainer.style.display = 'block';
        modal.style.display = 'none';
    });

    document.querySelector('.close-iframe').addEventListener('click', () => {
        iframeContainer.style.display = 'none';
        bypassFrame.src = '';
    });

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Keybind functionality
    const keybindInput = document.getElementById('keybindInput');
    const urlInput = document.getElementById('urlInput');
    const addKeybindBtn = document.getElementById('addKeybind');
    const keybindList = document.querySelector('.keybind-list');

    let currentKeys = new Set();
    let isRecording = false;
    let keybinds = JSON.parse(localStorage.getItem('keybinds') || '[]');

    function updateKeybindsList() {
        keybindList.innerHTML = '';
        keybinds.forEach((keybind, index) => {
            const item = document.createElement('div');
            item.className = 'keybind-item';
            item.innerHTML = `
                <span>${keybind.keys.join(' + ')} → ${keybind.url}</span>
                <button onclick="removeKeybind(${index})">Remove</button>
            `;
            keybindList.appendChild(item);
        });
        localStorage.setItem('keybinds', JSON.stringify(keybinds));
    }

    keybindInput.addEventListener('focus', () => {
        isRecording = true;
        currentKeys.clear();
        keybindInput.value = 'Press keys...';
    });

    keybindInput.addEventListener('blur', () => {
        isRecording = false;
    });

    document.addEventListener('keydown', (e) => {
        if (isRecording) {
            e.preventDefault();
            currentKeys.add(e.key);
            keybindInput.value = Array.from(currentKeys).join(' + ');
        } else {
            // Check for keybind matches
            const pressedKeys = new Set();
            if (e.ctrlKey) pressedKeys.add('Control');
            if (e.altKey) pressedKeys.add('Alt');
            if (e.shiftKey) pressedKeys.add('Shift');
            pressedKeys.add(e.key);

            const match = keybinds.find(keybind => 
                keybind.keys.length === pressedKeys.size && 
                keybind.keys.every(key => pressedKeys.has(key))
            );

            if (match) {
                window.open(match.url, '_blank');
                window.close();
            }
        }
    });

    addKeybindBtn.addEventListener('click', () => {
        if (currentKeys.size > 0 && urlInput.value) {
            keybinds.push({
                keys: Array.from(currentKeys),
                url: urlInput.value
            });
            updateKeybindsList();
            currentKeys.clear();
            keybindInput.value = '';
            urlInput.value = '';
        }
    });

    window.removeKeybind = (index) => {
        keybinds.splice(index, 1);
        updateKeybindsList();
    };

    // Initial keybinds list update
    updateKeybindsList();

    // Add twinkling animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
});