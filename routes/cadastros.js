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
    let createBody = {
        email:form.email,
        senha:form.senha,
        dataCriacao:new Date(),
        status:1,
        perfil:parseInt(form.cargo)
    }

    let createRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios/',
        headers: headers,
        method: 'POST',
        body: JSON.stringify(createBody)
    }
    return rp(createRequest).then(function(data){
        if(form.header === "admin"){
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/adm-employee?alert=sucess');
        } else if (form.header === "gerente"){
            res.redirect('https://helpdesk-tcc-web.herokuapp.com/gerente-employee?alert=sucess');
        }
    }).catch(function(error){
        res.redirect('https://helpdesk-tcc-web.herokuapp.com/cadastrar-funcionario?alert=error&message='+error+'');
    });
});

router.post("/chamado", function (req,res){
    let form = req.body;
    if(form['id-cliente'] === ''){
        let datas = form['data-nascimento'].split("/");
        let dataNascimento = datas[2]+"-"+datas[1]+"-"+datas[0];
        let createCustomer = {
            id:1,
            nome:form.nome,
            sobrenome:form.sobrenome,
            documento:form.cpf,
            sexo:form.sexo,
            dataNascimento:dataNascimento,
            cep:form.cep,
            logradouro:form.logradouro,
            numero:form.numero,
            complemento:form.complemento,
            bairro:form.bairro,
            cidade:form.cidade,
            estado:form['estados-brasil']
        }
        console.log(createCustomer);
        let customerRequest = {
            url: 'https://helpdesk-tcc-api.herokuapp.com/clientes/',
            headers: headers,
            method: 'POST',
            body: JSON.stringify(createCustomer)
        }   
        return rp(customerRequest).then(function(customerData){
            console.log("cliente criado com sucesso");
            console.log(customerData)
            let customer = JSON.parse(customerData);
            let consultarRequest = {
                url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios/' + req.cookies.usuario,
                headers: headers,
                method: 'GET',
            };
            return rp(consultarRequest).then(function (data) {
                var usuarios = JSON.parse(data);

                let createOrder = {
                    id:1,
                    cliente: customer,
                    tipo: form.tipo,
                    status: 4,
                    usuarioCriador: usuarios,
                    usuarioResponsavel: usuarios,
                    titulo: form.titulo,
                    descricao: form.descricao,
                    dataCriacao: new Date(),
                    dataFinalizacao: null
                }
                console.log(createOrder);
                let orderRequest = {
                    url: 'https://helpdesk-tcc-api.herokuapp.com/chamados/',
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify(createOrder)
                }
                return rp(orderRequest).then(function(orderData){
                    console.log("chamado criado com sucesso");                
                    if (form.header === "gerente"){
                        res.redirect('https://helpdesk-tcc-web.herokuapp.com/gerente-chamados?alert=sucess');
                    } else if (form.header === "analist2"){
                        res.redirect('https://helpdesk-tcc-web.herokuapp.com/analist2-chamados?alert=sucess');
                    } else {
                        res.redirect('https://helpdesk-tcc-web.herokuapp.com/analist1-chamados?alert=sucess');
                    }
                });
            }).catch(function(error){
                if (form.header === "gerente"){
                    res.redirect('https://helpdesk-tcc-web.herokuapp.com/gerente-cadastra-chamados?alert=error&message='+error+'');
                } else if (form.header === "analist2"){
                    res.redirect('https://helpdesk-tcc-web.herokuapp.com/analist2-cadastra-chamados?alert=error&message='+error+'');
                } else {
                    res.redirect('https://helpdesk-tcc-web.herokuapp.com/analist1-cadastra-chamados?alert=error&message='+error+'');
                }
            });
        }).catch(function(error){
            if (form.header === "gerente"){
                res.redirect('https://helpdesk-tcc-web.herokuapp.com/gerente-cadastra-chamados?alert=error&message='+error+'');
            } else if (form.header === "analist2"){
                res.redirect('https://helpdesk-tcc-web.herokuapp.com/analist2-cadastra-chamados?alert=error&message='+error+'');
            } else {
                res.redirect('https://helpdesk-tcc-web.herokuapp.com/analist1-cadastra-chamados?alert=error&message='+error+'');
            }
        });
    }
});
module.exports = router;