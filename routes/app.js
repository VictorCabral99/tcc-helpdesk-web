"use strict";

const express = require("express");
const session = require("express-session");
const queryString = require("query-string");
const request = require("request");
const rp = require("request-promise");

let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

var router = express.Router();

//Login
router.get("/", function (req, res) {
    res.render("layout", {
        header: "main",
        content: "main"
    });
});
router.post("/autenticar", function (req, res) {
    let form = req.body;

    let authRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios/autenticar',
        headers: headers,
        method: 'POST',
        body: JSON.stringify(form)
    }

    return rp(authRequest).then(function (data) {
        let login = data.split(",");
        console.log(login);
        switch (login[1]) {
            case "ACTIVE":
                switch (login[4]) {
                    case "ADMIN":
                        res.cookie("usuario",login[0]);
                        res.redirect("https://helpdesk-tcc-web.herokuapp.com/adm-home");
                        break;
                    case "ANALIST1":
                        res.cookie("usuario",login[0]);
                        res.redirect("https://helpdesk-tcc-web.herokuapp.com/analist1-home");
                        break;
                    case "ANALIST2":
                        res.cookie("usuario",login[0]);
                        res.redirect("https://helpdesk-tcc-web.herokuapp.com/analist2-home");
                        break;
                    case "GERENTE":
                        res.cookie("usuario",login[0]);                    
                        res.redirect("https://helpdesk-tcc-web.herokuapp.com/gerente-home");
                        break;
                }
                break;
            case "BLOCKED":
                res.redirect("https://helpdesk-tcc-web.herokuapp.com/login?alert=error&code=401");
                break;
            case "CANCELED":
                res.redirect("https://helpdesk-tcc-web.herokuapp.com/login?alert=error&code=402");
                break;
        }
    }).catch(function (error) {
        if (error.statusCode !== 400) {
            var erro = JSON.parse(error.error)
            console.log(erro.status);
            if (erro.status === 500) {
                res.redirect("https://helpdesk-tcc-web.herokuapp.com/login?alert=error&code=500");
            } else {
                console.log("Erro Generico");
                res.redirect("https://helpdesk-tcc-web.herokuapp.com/login?alert=error&code=" + erro.status);
            }
        } else {
            console.log(error.error);
            res.redirect("https://helpdesk-tcc-web.herokuapp.com/login?alert=error&code=400");
        }
    });

});
router.get("/duvidas", function (req, res) {
    res.render("layout", {
        header: "main",
        content: "duvidas"
    });
});
router.get("/login", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));
    if (qs.alert) {
        if (qs.code === '400') {
            res.render("layout", {
                header: "main",
                content: "login",
                message: "Login inválido"
            });
        } else if (qs.code === '401') {
            res.render("layout", {
                header: "main",
                content: "login",
                message: "Usuário Bloqueado"
            });
        } else if (qs.code === '402') {
            res.render("layout", {
                header: "main",
                content: "login",
                message: "Usuário Cancelado"
            });
        } else if (qs.code === '500') {
            res.render("layout", {
                header: "main",
                content: "login",
                message: "Usuário Inexistente na base"
            });
        } else {
            res.render("layout", {
                header: "main",
                content: "login",
                message: "Erro Genérico"
            });
        }
    } else {
        res.render("layout", {
            header: "main",
            content: "login",
            message: null
        });
    }
});
router.get("/servicos", function (req,res) {
    res.render("layout", {
        header: "main",
        content: "servicos"
    });
});
router.get("/suporte", function (req, res) {
    res.render("layout", {
        header: "main",
        content: "suporte"
    });
});
//Login

//Administrador
router.get("/adm-altera-funcionario", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var usuario = JSON.parse(data);
        var status;
        var perfil;
        switch (usuario.status) {
            case "ACTIVE":
                status = 1;
                break;
            case "BLOCKED":
                status = 2;
                break;
            case "CANCELED":
                status = 3;
                break;
        }
        switch (usuario.perfil) {
            case "ADMIN":
                perfil = 1;
                break;
            case "GERENTE":
                perfil = 2;
                break;
            case "ANALIST2":
                perfil = 4;
                break;
            case "ANALIST1":
                perfil = 3;
                break;
        }

        res.render("layout", {
            content: "alterar-funcionario",
            header: "admin",
            usuario: usuario,
            perfil: perfil,
            status: status,
            id: qs.id
        });
    })
})
router.get("/adm-cadastra-funcionario", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));
    if (qs.alert) {
        if (qs.message) {
            res.render("layout", {
                header: "admin",
                content: "cadastrar-funcionario",
                alert: qs.alert,
                message: qs.message
            });
        } else {
            res.render("layout", {
                header: "admin",
                content: "cadastrar-funcionario",
                alert: qs.alert,
                message: null
            });
        }

    } else {
        res.render("layout", {
            header: "admin",
            content: "cadastrar-funcionario",
            alert: null
        });
    }
});
router.get("/adm-consulta-funcionario", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var usuario = JSON.parse(data);
        var status;
        var perfil;
        switch (usuario.status) {
            case "ACTIVE":
                status = "Ativo";
                break;
            case "BLOCKED":
                status = "Bloqueado";
                break;
            case "CANCELED":
                status = "Cancelado";
                break;
        }
        switch (usuario.perfil) {
            case "ADMIN":
                perfil = "Administrador";
                break;
            case "GERENTE":
                perfil = "Gerente";
                break;
            case "ANALIST1":
                perfil = "Analista 1";
                break;
            case "ANALIST2":
                perfil = "Analista 2";
                break;
        }

        res.render("layout", {
            header: "admin",
            content: "consultar-funcionario",
            usuario: usuario,
            perfil: perfil,
            status: status
        });
    })
})
router.get("/adm-employee", function (req, res) {

    let authRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios',
        headers: headers,
        method: 'GET',
    }

    return rp(authRequest).then(function (data) {
        let usuarios = JSON.parse(data);
        res.render("layout", {
            header: "admin",
            content: "consultar-todos-funcionarios",
            usuarios: usuarios
        });
    });
});
router.get("/adm-home", function (req, res) {
    res.render("layout", {
        header: "admin",
        content: "home-admin"
    });
});
//Administrador

//Analista1
router.get("/analist1-chamados", function (req, res) {
    let authRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados',
        headers: headers,
        method: 'GET',
    }

    return rp(authRequest).then(function (data) {
        let chamados = JSON.parse(data);
        for(let chamado in chamados){
            var date = new Date(chamados[chamado].dataCriacao);
            chamados[chamado].dataCriacao = date.toLocaleString();
        }
        res.render("layout", {
            header: "analist1",
            content: "consultar-todos-chamados",
            chamados: chamados
        });
    });
});
router.get("/analist1-home", function (req, res) {
    res.render("layout", {
        header: "analist1",
        content: "home-analista-1"
    });
});
router.get("/analist1-cadastra-chamados", function (req,res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));
    if (qs.alert) {
        if (qs.message) {
            res.render("layout", {
                header: "analist1",
                content: "cadastrar-chamado",
                alert: qs.alert,
                message: qs.message
            });
        } else {
            res.render("layout", {
                header: "analist1",
                content: "cadastrar-chamado",
                alert: qs.alert,
                message: null
            });
        }

    } else {
        res.render("layout", {
            header: "analist1",
            content: "cadastrar-chamado",
            alert: null
        });
    }
});
router.get("/analist1-consulta-chamados", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var chamados = JSON.parse(data);
        var sexo;
        var tipo;
        var status;
        switch (chamados.cliente.sexo) {
            case 1:
                sexo = "M";
                break;
            case 2:
                sexo = "F";
                break;
        }
        switch (chamados.tipo) {
            case "DUVIDA":
                tipo = "Dúvida";
                break;
            case "MELHORIA":
                tipo = "Melhoria";
                break;
            case "PROBLEMA":
                tipo = "Problema";
                break;
        }
        switch (chamados.status) {
            case "SUCESS":
                status = "Sucesso";
                break;
            case "INREVIEW":
                status = "Em Análise";
                break;
            case "WAITINGDATA":
                status = "Aguardando Retorno";
                break;
            case "PENDING":
                status = "Pendente";
                break;
        }
        res.render("layout", {
            header: "analist1",
            content: "consultar-chamado",
            chamados: chamados,
            sexo: sexo,
            tipo: tipo,
            status: status
        });
    })
});
router.get("/analist1-altera-chamados", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var chamados = JSON.parse(data);
        let status;
        console.log(chamados);
        switch (chamados.status) {
            case "SUCESS":
                status = "Sucesso";
                break;
            case "INREVIEW":
                status = "Em Análise";
                break;
            case "WAITINGDATA":
                status = "Aguardando Retorno";
                break;
            case "PENDING":
                status = "Pendente";
                break;
        }

        let userRequest = {
            url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios',
            headers: headers,
            method: 'GET',
        };
        return rp(userRequest).then(function (usuarios) {
            res.render("layout", {
                header: "analist1",
                content: "alterar-chamado",
                chamados: chamados,
                status: status,
                usuarios:JSON.parse(usuarios)
            });
        });
    })
});
//Analista1

//Analista2
router.get("/analist2-home", function (req, res) {
    res.render("layout", {
        header: "analist2",
        content: "home-analista-2"
    });
});
router.get("/analist2-chamados", function (req, res) {
    let authRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados',
        headers: headers,
        method: 'GET',
    }

    return rp(authRequest).then(function (data) {
        let chamados = JSON.parse(data);
        for(let chamado in chamados){
            var date = new Date(chamados[chamado].dataCriacao);
            chamados[chamado].dataCriacao = date.toLocaleString();
        }
        res.render("layout", {
            header: "analist2",
            content: "consultar-todos-chamados",
            chamados: chamados
        });
    });
    
});
router.get("/analist2-cadastra-chamados", function (req,res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));
    if (qs.alert) {
        if (qs.message) {
            res.render("layout", {
                header: "analist2",
                content: "cadastrar-chamado",
                alert: qs.alert,
                message: qs.message
            });
        } else {
            res.render("layout", {
                header: "analist2",
                content: "cadastrar-chamado",
                alert: qs.alert,
                message: null
            });
        }

    } else {
        res.render("layout", {
            header: "analist2",
            content: "cadastrar-chamado",
            alert: null
        });
    }
});
router.get("/analist2-altera-chamados", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var chamados = JSON.parse(data);
        let status;
        console.log(chamados);
        switch (chamados.status) {
            case "SUCESS":
                status = "Sucesso";
                break;
            case "INREVIEW":
                status = "Em Análise";
                break;
            case "WAITINGDATA":
                status = "Aguardando Retorno";
                break;
            case "PENDING":
                status = "Pendente";
                break;
        }

        let userRequest = {
            url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios',
            headers: headers,
            method: 'GET',
        };
        return rp(userRequest).then(function (usuarios) {
            res.render("layout", {
                header: "analist2",
                content: "alterar-chamado",
                chamados: chamados,
                status: status,
                usuarios:JSON.parse(usuarios)
            });
        });
    })
});
router.get("/analist2-consulta-chamados", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var chamados = JSON.parse(data);
        var sexo;
        var tipo;
        var status;
        switch (chamados.cliente.sexo) {
            case 1:
                sexo = "M";
                break;
            case 2:
                sexo = "F";
                break;
        }
        switch (chamados.tipo) {
            case "DUVIDA":
                tipo = "Dúvida";
                break;
            case "MELHORIA":
                tipo = "Melhoria";
                break;
            case "PROBLEMA":
                tipo = "Problema";
                break;
        }
        switch (chamados.status) {
            case "SUCESS":
                status = "Sucesso";
                break;
            case "INREVIEW":
                status = "Em Análise";
                break;
            case "WAITINGDATA":
                status = "Aguardando Retorno";
                break;
            case "PENDING":
                status = "Pendente";
                break;
        }


        res.render("layout", {
            header: "analist2",
            content: "consultar-chamado",
            chamados: chamados,
            sexo: sexo,
            tipo: tipo,
            status: status
        });
    })
});
//Analista2

//Gerente
router.get("/gerente-altera-chamados", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var chamados = JSON.parse(data);
        let status;
        console.log(chamados);
        switch (chamados.status) {
            case "SUCESS":
                status = "Sucesso";
                break;
            case "INREVIEW":
                status = "Em Análise";
                break;
            case "WAITINGDATA":
                status = "Aguardando Retorno";
                break;
            case "PENDING":
                status = "Pendente";
                break;
        }

        let userRequest = {
            url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios',
            headers: headers,
            method: 'GET',
        };
        return rp(userRequest).then(function (usuarios) {
            res.render("layout", {
                header: "gerente",
                content: "alterar-chamado",
                chamados: chamados,
                status: status,
                usuarios:JSON.parse(usuarios)
            });
        });
    })
});
router.get("/gerente-cadastra-chamados", function (req,res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));
    if (qs.alert) {
        if (qs.message) {
            res.render("layout", {
                header: "gerente",
                content: "cadastrar-chamado",
                alert: qs.alert,
                message: qs.message
            });
        } else {
            res.render("layout", {
                header: "gerente",
                content: "cadastrar-chamado",
                alert: qs.alert,
                message: null
            });
        }

    } else {
        res.render("layout", {
            header: "gerente",
            content: "cadastrar-chamado",
            alert: null
        });
    }
});
router.get("/gerente-consulta-chamados", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var chamados = JSON.parse(data);
        var sexo;
        var tipo;
        var status;
        switch (chamados.cliente.sexo) {
            case 1:
                sexo = "M";
                break;
            case 2:
                sexo = "F";
                break;
        }
        switch (chamados.tipo) {
            case "DUVIDA":
                tipo = "Dúvida";
                break;
            case "MELHORIA":
                tipo = "Melhoria";
                break;
            case "PROBLEMA":
                tipo = "Problema";
                break;
        }
        switch (chamados.status) {
            case "SUCESS":
                status = "Sucesso";
                break;
            case "INREVIEW":
                status = "Em Análise";
                break;
            case "WAITINGDATA":
                status = "Aguardando Retorno";
                break;
            case "PENDING":
                status = "Pendente";
                break;
        }


        res.render("layout", {
            header: "gerente",
            content: "consultar-chamado",
            chamados: chamados,
            sexo: sexo,
            tipo: tipo,
            status: status
        });
    })
});
router.get("/gerente-cadastra-clientes", function (req,res){
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));
    if (qs.alert) {
        if (qs.message) {
            res.render("layout", {
                header: "gerente",
                content: "cadastrar-cliente",
                alert: qs.alert,
                message: qs.message
            });
        } else {
            res.render("layout", {
                header: "gerente",
                content: "cadastrar-cliente",
                alert: qs.alert,
                message: null
            });
        }

    } else {
        res.render("layout", {
            header: "gerente",
            content: "cadastrar-cliente",
            alert: null
        });
    }
});
router.get("/gerente-altera-funcionario", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var usuario = JSON.parse(data);
        var status;
        var perfil;
        switch (usuario.status) {
            case "ACTIVE":
                status = 1;
                break;
            case "BLOCKED":
                status = 2;
                break;
            case "CANCELED":
                status = 3;
                break;
        }
        switch (usuario.perfil) {
            case "ADMIN":
                perfil = 1;
                break;
            case "GERENTE":
                perfil = 2;
                break;
            case "ANALIST2":
                perfil = 4;
                break;
            case "ANALIST1":
                perfil = 3;
                break;
        }
        res.render("layout", {
            content: "alterar-funcionario",
            header: "gerente",
            usuario: usuario,
            perfil: perfil,
            status: status,
            id: qs.id
        });
    })
});
router.get("/gerente-cadastra-funcionario", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));
    if (qs.alert) {
        if (qs.message) {
            res.render("layout", {
                header: "gerente",
                content: "cadastrar-funcionario",
                alert: qs.alert,
                message: qs.message
            });
        } else {
            res.render("layout", {
                header: "gerente",
                content: "cadastrar-funcionario",
                alert: qs.alert,
                message: null
            });
        }

    } else {
        res.render("layout", {
            header: "gerente",
            content: "cadastrar-funcionario",
            alert: null
        });
    }
});
router.get("/gerente-consulta-funcionario", function (req, res) {
    let qs = queryString.parse(req.url.replace(/^.*\?/, ""));

    let consultarRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios/' + qs.id,
        headers: headers,
        method: 'GET',
    };
    return rp(consultarRequest).then(function (data) {
        var usuario = JSON.parse(data);
        var status;
        var perfil;
        switch (usuario.status) {
            case "ACTIVE":
                status = "Ativo";
                break;
            case "BLOCKED":
                status = "Bloqueado";
                break;
            case "CANCELED":
                status = "Cancelado";
                break;
        }
        switch (usuario.perfil) {
            case "ADMIN":
                perfil = "Administrador";
                break;
            case "GERENTE":
                perfil = "Gerente";
                break;
            case "ANALIST1":
                perfil = "Analista 1";
                break;
            case "ANALIST2":
                perfil = "Analista 2";
                break;
        }

        res.render("layout", {
            header: "gerente",
            content: "consultar-funcionario",
            usuario: usuario,
            perfil: perfil,
            status: status
        });
    })
});
router.get("/gerente-chamados", function (req, res) {
    let authRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/chamados',
        headers: headers,
        method: 'GET',
    }

    return rp(authRequest).then(function (data) {
        let chamados = JSON.parse(data);
        for(let chamado in chamados){
            var date = new Date(chamados[chamado].dataCriacao);
            chamados[chamado].dataCriacao = date.toLocaleString();
        }
        res.render("layout", {
            header: "gerente",
            content: "consultar-todos-chamados",
            chamados: chamados
        });
    });
});
router.get("/gerente-employee", function (req, res) {

    let authRequest = {
        url: 'https://helpdesk-tcc-api.herokuapp.com/usuarios',
        headers: headers,
        method: 'GET',
    }

    return rp(authRequest).then(function (data) {
        let usuarios = JSON.parse(data);
        res.render("layout", {
            header: "gerente",
            content: "consultar-todos-funcionarios",
            usuarios: usuarios
        });
    });
});
router.get("/gerente-home", function (req, res) {
    res.render("layout", {
        header: "gerente",
        content: "home-gerente"
    });
});
//Gerente
module.exports = router;