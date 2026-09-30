const express = require('express');
const app = express();
const PORT = 3000;


app.set('view engine', 'ejs');


app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    
    res.render('index', { submission: null });
});

app.post('/submit-form', (req, res) => {
    
    const userName = req.body.username;
    const userMessage = req.body.message;

  
    res.render('index', { 
        submission: {
            name: userName,
            message: userMessage
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});