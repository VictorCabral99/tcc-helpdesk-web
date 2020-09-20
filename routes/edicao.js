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

router.post("/funcionario", function (req,res){
    let form = req.body;
    let updateBody = {
        id:form.id,
        email:form.email,
        status:parseInt(form.status),
        perfil:parseInt(form.cargo)
    }
    let updateRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios/'+form.id,
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(updateBody)
    }
    return rp(updateRequest).then(function(data){
        if(form.header === "admin"){
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/adm-employee?alert=sucess');
        } else if (form.header === "gerente"){
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/gerente-employee?alert=sucess');
        }
    }).catch(function(error){
        console.log("erro" + error);
        res.redirect('https://helpdesk-tcc-web.herokuapp.com/adm-employee?alert=error&message='+error+'');
    });
});

module.exports = router;