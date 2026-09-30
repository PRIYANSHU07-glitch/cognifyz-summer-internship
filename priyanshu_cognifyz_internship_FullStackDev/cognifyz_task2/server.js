const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const tempDatabase = []; 


app.get('/', (req, res) => {
    res.render('index', { error: null, success: null, users: tempDatabase });
});


app.post('/register', (req, res) => {
    const { username, email, age } = req.body;

    
    if (!username || username.length < 3) {
        return res.render('index', { error: "Server Error: Username must be at least 3 characters.", success: null, users: tempDatabase });
    }
    if (!email.includes('@') || !email.includes('.')) {
        return res.render('index', { error: "Server Error: Invalid email format.", success: null, users: tempDatabase });
    }
    if (!age || isNaN(age) || age < 18) {
        return res.render('index', { error: "Server Error: You must be at least 18 years old.", success: null, users: tempDatabase });
    }

    
    tempDatabase.push({ username, email, age });
    
    
    res.render('index', { error: null, success: "Registration successful!", users: tempDatabase });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});