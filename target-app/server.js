const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Target App is Running Normally ');
});

// Intentional Bug Route
// The developer made a typo calling `user_answers` instead of `userAnswers`
app.get('/api/broken', (req, res) => {
    const userAnswers = [1, 2, 3];
    
    // Fix: Corrected variable name from `user_answers` to `userAnswers`
    if (userAnswers.length > 0) {
        res.json({ success: true, count: userAnswers.length });
    } else {
        res.json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Target app listening on port ${PORT}`);
});