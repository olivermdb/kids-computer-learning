class TypingGame {
    constructor() {
        this.wordLibrary = {
            firsttime: [
                // Home row only
                'a', 's', 'd', 'f', 'j', 'k', 'l',
                // Simple home row combinations
                'as', 'ad', 'af', 'sa', 'sd', 'sf', 'da', 'ds', 'df', 'fa', 'fs', 'fd',
                'jk', 'jl', 'kj', 'kl', 'lj', 'lk',
                // Cross-hand simple combinations
                'aj', 'ak', 'al', 'sj', 'sk', 'sl', 'dj', 'dk', 'dl', 'fj', 'fk', 'fl',
                // Simple words with home row
                'ask', 'sad', 'lad', 'dad', 'fall', 'all', 'lass', 'lass', 'flask'
            ],
            beginner: [
                'cat', 'dog', 'run', 'fun', 'sun', 'bug', 'hug', 'cup', 'top', 'hop',
                'red', 'big', 'yes', 'mom', 'dad', 'car', 'bus', 'egg', 'hat', 'bat',
                'bag', 'pig', 'dig', 'fig', 'wig', 'log', 'fog', 'jog', 'box', 'fox',
                'six', 'mix', 'fix', 'zip', 'tip', 'rip', 'lap', 'map', 'tap', 'cap',
                'pen', 'ten', 'men', 'hen', 'den', 'net', 'wet', 'set', 'get', 'pet'
            ],
            intermediate: [
                'hello', 'world', 'house', 'mouse', 'water', 'happy', 'smile', 'magic',
                'brave', 'smart', 'quick', 'funny', 'party', 'dance', 'music', 'dream',
                'cloud', 'flower', 'button', 'purple', 'orange', 'yellow', 'friend',
                'school', 'garden', 'rabbit', 'turtle', 'monkey', 'cookie', 'bridge',
                'castle', 'dragon', 'prince', 'queen', 'tiger', 'eagle', 'ocean',
                'forest', 'rainbow', 'thunder', 'winter', 'summer', 'spring', 'autumn'
            ],
            advanced: [
                'computer', 'keyboard', 'programming', 'adventure', 'chocolate',
                'butterfly', 'elephant', 'telephone', 'dinosaur', 'helicopter',
                'refrigerator', 'microscope', 'telescope', 'photograph', 'automobile',
                'playground', 'wonderful', 'beautiful', 'fantastic', 'incredible',
                'transportation', 'imagination', 'celebration', 'conversation',
                'mathematics', 'encyclopedia', 'hippopotamus', 'neighborhood',
                'responsibility', 'extraordinary', 'understanding', 'enthusiastic'
            ]
        };

        this.currentLevel = 'firsttime';
        this.currentWord = '';
        this.typedText = '';
        this.score = 0;
        this.streak = 0;
        this.gameActive = false;

        // Finger mapping for keyboard guidance
        this.fingerMap = {
            'q': 'left-pinky', 'w': 'left-ring', 'e': 'left-middle', 'r': 'left-index', 't': 'left-index',
            'y': 'right-index', 'u': 'right-index', 'i': 'right-middle', 'o': 'right-ring', 'p': 'right-pinky',
            'a': 'left-pinky', 's': 'left-ring', 'd': 'left-middle', 'f': 'left-index', 'g': 'left-index',
            'h': 'right-index', 'j': 'right-index', 'k': 'right-middle', 'l': 'right-ring', ';': 'right-pinky',
            'z': 'left-pinky', 'x': 'left-ring', 'c': 'left-middle', 'v': 'left-index', 'b': 'left-index',
            'n': 'right-index', 'm': 'right-index', ',': 'right-middle', '.': 'right-ring', '/': 'right-pinky',
            ' ': 'thumbs'
        };

        this.initializeElements();
        this.bindEvents();
        this.setLevel('firsttime'); // Initialize with First Time mode
        this.showNewWord();
    }

    initializeElements() {
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.streakElement = document.getElementById('streak');
        this.currentWordElement = document.getElementById('current-word');
        this.feedback = document.getElementById('feedback');
        this.startBtn = document.getElementById('start-btn');
        this.levelBtn = document.getElementById('level-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.levelSelector = document.getElementById('level-selector');
        this.keyboardContainer = document.getElementById('keyboard-container');
        this.keyboard = document.getElementById('keyboard');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.toggleGame());
        this.levelBtn.addEventListener('click', () => this.toggleLevelSelector());
        this.resetBtn.addEventListener('click', () => this.resetGame());

        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        document.querySelectorAll('.level-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setLevel(e.target.dataset.level);
            });
        });
    }

    toggleGame() {
        if (this.gameActive) {
            this.stopGame();
        } else {
            this.startGame();
        }
    }

    startGame() {
        this.gameActive = true;
        this.startBtn.textContent = 'Stop Game';
        this.startBtn.className = 'btn secondary';
        this.showNewWord();
        this.clearFeedback();
    }

    stopGame() {
        this.gameActive = false;
        this.startBtn.textContent = 'Start Game';
        this.startBtn.className = 'btn primary';
        this.showFeedback('Game stopped! Click Start to play again.', 'neutral');
    }

    resetGame() {
        this.score = 0;
        this.streak = 0;
        this.typedText = '';
        this.updateStats();
        this.stopGame();
        this.showNewWord();
        this.clearFeedback();
    }

    toggleLevelSelector() {
        this.levelSelector.classList.toggle('hidden');
    }

    setLevel(level) {
        this.currentLevel = level;
        this.levelElement.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        this.levelSelector.classList.add('hidden');

        // Show/hide keyboard based on level
        if (level === 'firsttime') {
            this.keyboardContainer.classList.remove('hidden');
        } else {
            this.keyboardContainer.classList.add('hidden');
        }

        this.showNewWord();
    }

    showNewWord() {
        const words = this.wordLibrary[this.currentLevel];
        this.currentWord = words[Math.floor(Math.random() * words.length)];
        this.typedText = '';
        this.updateWordDisplay('');
        this.highlightNextKey();
    }

    updateWordDisplay(typedText) {
        let html = '';

        for (let i = 0; i < this.currentWord.length; i++) {
            const letter = this.currentWord[i];

            if (i < typedText.length) {
                if (typedText[i] === letter) {
                    html += `<span class="letter correct">${letter}</span>`;
                } else {
                    html += `<span class="letter incorrect">${letter}</span>`;
                }
            } else if (i === typedText.length) {
                html += `<span class="letter current">${letter}</span>`;
            } else {
                html += `<span class="letter">${letter}</span>`;
            }
        }

        this.currentWordElement.innerHTML = html;
        this.highlightNextKey(typedText);
    }

    highlightNextKey(typedText = '') {
        if (this.currentLevel !== 'firsttime') return;

        // Clear all highlights
        this.clearKeyboardHighlights();

        // Get the next letter to type
        const nextLetterIndex = typedText.length;
        if (nextLetterIndex < this.currentWord.length) {
            const nextLetter = this.currentWord[nextLetterIndex].toLowerCase();
            this.highlightKeyAndFinger(nextLetter);
        }
    }

    clearKeyboardHighlights() {
        // Clear key highlights
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('highlight', 'correct', 'incorrect');
        });

        // Clear finger highlights
        document.querySelectorAll('.finger').forEach(finger => {
            finger.classList.remove('active');
        });
    }

    highlightKeyAndFinger(letter) {
        // Highlight the key
        const key = document.querySelector(`[data-key="${letter}"]`);
        if (key) {
            key.classList.add('highlight');
        }

        // Highlight the finger
        const fingerType = this.fingerMap[letter];
        if (fingerType) {
            if (fingerType === 'thumbs') {
                // Highlight both thumbs for space
                document.querySelectorAll('[data-finger="left-thumb"], [data-finger="right-thumb"]').forEach(thumb => {
                    thumb.classList.add('active');
                });
            } else {
                const finger = document.querySelector(`[data-finger="${fingerType}"]`);
                if (finger) {
                    finger.classList.add('active');
                }
            }
        }
    }

    handleKeyPress(e) {
        if (!this.gameActive) return;

        // Ignore special keys
        if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Enter') return;

        e.preventDefault();

        if (e.key === 'Backspace') {
            if (this.typedText.length > 0) {
                this.typedText = this.typedText.slice(0, -1);
                this.updateWordDisplay(this.typedText);
                this.clearFeedback();
            }
        } else if (e.key === 'Enter') {
            this.checkWord();
        } else if (e.key === ' ' || (e.key.length === 1 && e.key.match(/[a-zA-Z]/))) {
            const char = e.key.toLowerCase();
            this.typedText += char;
            this.updateWordDisplay(this.typedText);

            if (this.typedText === this.currentWord) {
                this.correctWord();
            } else if (this.currentWord.startsWith(this.typedText)) {
                this.showFeedback('Keep going...', 'neutral');
            } else {
                this.showFeedback('Check your spelling...', 'warning');
            }
        }
    }

    checkWord() {
        if (!this.gameActive) return;

        if (this.typedText === this.currentWord) {
            this.correctWord();
        } else {
            this.incorrectWord();
        }
    }

    correctWord() {
        this.score += this.getPointsForWord();
        this.streak++;
        this.updateStats();
        this.showFeedback('Great job! 🎉', 'correct');
        this.showNewWord();

        setTimeout(() => {
            this.clearFeedback();
        }, 1500);
    }

    incorrectWord() {
        this.streak = 0;
        this.updateStats();
        this.showFeedback(`Try again! The word was: ${this.currentWord}`, 'incorrect');

        setTimeout(() => {
            this.showNewWord();
            this.clearFeedback();
        }, 2000);
    }

    getPointsForWord() {
        const basePoints = {
            beginner: 10,
            intermediate: 20,
            advanced: 30
        };

        const streakBonus = Math.floor(this.streak / 5) * 5;
        return basePoints[this.currentLevel] + streakBonus;
    }

    updateStats() {
        this.scoreElement.textContent = this.score;
        this.streakElement.textContent = this.streak;
    }

    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type}`;
    }

    clearFeedback() {
        this.feedback.textContent = '';
        this.feedback.className = 'feedback';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TypingGame();
});