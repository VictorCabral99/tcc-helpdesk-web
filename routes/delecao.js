const express = require("express");
const session = require("express-session");
const queryString = require("query-string");
const request = require("request");
const rp = require("request-promise");
const bodyParser = require("body-parser");

let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

var router = express.Router();

router.get("/funcionario", function (req,res){
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));
    let deleteRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios/'+qs.id,
        headers: headers,
        method: 'DELETE',
    }
    return rp(deleteRequest).then(function(data){
        if(qs.header === "admin"){
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/adm-employee?alert=sucess');
        } else if (qs.header === "gerente"){
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/gerente-employee?alert=sucess');
        }
    }).catch(function(error){
        res.redirect('https://helpdesk-tcc-web.herokuapp.com/adm-employee?alert=error&message='+error+'');
    });
});

router.get("/chamado", function (req,res){
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));
    let selectRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados/finalize/'+qs.id,
        headers: headers,
        method: 'GET',
    }
    return rp(selectRequest).then(function(data){
        if (qs.header === "gerente"){
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/gerente-chamados?alert=sucess');
        } else if (qs.header === "analist2") {
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/analist2-chamados?alert=sucess');
        } else if (qs.header === "analist1") {
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/analist1-chamados?alert=sucess');
        } else {
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/gerente-chamados?alert=error&message='+error+'');
        }
    }).catch(function(error){
        res.redirect('https://helpdesk-tcc-web.herokuapp.com/gerente-chamados?alert=error&message='+error+'');
    });
});
module.exports = router;