const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const queryString = require('query-string');
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function (req,res,next) {
    next();
});

app.get('/',(req,res) => {
    res.render('layout', {
        header: "main",
        content: 'main'
    });
});

var application = require('./routes/app.js');
app.use('/', application);

var cadastros = require('./routes/cadastros.js');
app.use('/cadastros', cadastros);

var edicao = require('./routes/edicao.js');
app.use('/edicao', edicao);

var delecao = require('./routes/delecao.js');
app.use('/delecao',delecao);

var porta = process.env.PORT || 8080;

var server = app.listen(porta, () => {
    console.log('server iniciado na porta ' + porta);
});