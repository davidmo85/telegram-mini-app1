let score = 0;
let level = 1;
let boostMultiplier = 1;
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const imageElement = document.getElementById('game-image');
const usernameElement = document.getElementById('username');

let username = '';
if (window.Telegram.WebApp.initDataUnsafe) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user) {
        username = user.username || user.first_name;
        usernameElement.textContent = username;
    }
}

// عند الضغط على الصورة
imageElement.addEventListener('click', () => {
    score += boostMultiplier;
    scoreElement.textContent = score;
    document.getElementById('click-sound').play();
});

// تطبيق التعزيز
function applyBoost(multiplier) {
    boostMultiplier = multiplier;
    fetch('/apply-boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, boost: multiplier })
    }).then(response => response.text())
      .then(data => console.log('Boost applied:', data))
      .catch(error => console.error('Error:', error));
}

// إرسال النقاط عند الخروج من اللعبة أو إغلاق الصفحة
window.onbeforeunload = function() {
    fetch('/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, score: score })
    }).then(response => response.json())
      .then(data => {
          level = data.level;
          levelElement.textContent = level;
      }).catch(error => console.error('Error:', error));
};
