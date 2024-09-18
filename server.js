const express = require('express');
const { Telegraf } = require('telegraf');
const path = require('path');

const app = express();
app.use(express.json());

let leaderboard = {};
let userBoosts = {};  // تخزين التعزيزات لكل مستخدم
let userLastLogin = {};  // تخزين آخر وقت دخول لكل مستخدم

// إعداد البوت
const bot = new Telegraf('6820999044:AAGxzz0f35f1XnF-kCzOb7z0LYIpHKzuSnA');

// حساب المستوى بناءً على عدد النقاط
function calculateLevel(score) {
    if (score < 100) return 1;
    if (score < 500) return 2;
    if (score < 1000) return 3;
    if (score < 2000) return 4;
    return 5;  // أعلى مستوى
}

// تسجيل النقاط من العميل
app.post('/submit-score', (req, res) => {
    const { username, score } = req.body;

    if (username && score !== undefined) {
        leaderboard[username] = (leaderboard[username] || 0) + score;
        const level = calculateLevel(leaderboard[username]);
        res.status(200).json({ message: 'Score submitted!', level: level });
    } else {
        res.status(400).send('Invalid data');
    }
});

// استقبال التعزيزات
app.post('/apply-boost', (req, res) => {
    const { username, boost } = req.body;

    if (username && boost) {
        userBoosts[username] = boost;
        res.status(200).send('Boost applied successfully!');
    } else {
        res.status(400).send('Invalid data');
    }
});

// مكافأة يومية
app.post('/daily-reward', (req, res) => {
    const { username } = req.body;

    if (username) {
        const currentDate = new Date().toDateString();
        const lastLogin = userLastLogin[username];

        if (lastLogin !== currentDate) {
            userLastLogin[username] = currentDate;
            leaderboard[username] = (leaderboard[username] || 0) + 100;
            res.status(200).json({ success: true, reward: 100 });
        } else {
            res.status(400).json({ success: false });
        }
    } else {
        res.status(400).send('Invalid data');
    }
});

// عرض لوحة المتصدرين
app.get('/leaderboard', (req, res) => {
    const sortedLeaderboard = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);
    res.json(sortedLeaderboard);
});

// تقديم الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));


// تشغيل البوت
bot.launch();

// تشغيل الخادم
app.listen(3000, () => {
    console.log('App is running on port 3000');
});
