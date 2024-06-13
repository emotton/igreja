const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var path = require('path');

const clientes = [
    {'nome':'GM'}, 
    {'nome':'Fiat'}, 
    {'nome':'Ford'},
    {'nome':'Renault'}
];

// Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.get('/', (req, res) => {
     res.send("Bem vindo!");
});

app.get('/cliente/list', (req, res) => {
    res.json(clientes);
});

// Server propriamente dito
app.listen(3000, () => {
    console.log(`Server started on port`);
});