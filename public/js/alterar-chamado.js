$("#btnAlterar").click(function () {
    if (document.getElementById("alterar").style.display === "none") {
        document.getElementById("btnAlterar").style.display = "none";
        document.getElementById("btnTransferir").style.display = "none";
        $("#alterar").fadeToggle();
    }
});
$("#btnTransferir").click(function () {
    if (document.getElementById("transferir").style.display === "none") {
        document.getElementById("btnAlterar").style.display = "none";
        document.getElementById("btnTransferir").style.display = "none";
        $("#transferir").fadeToggle();
    }
});
$("#btnStatus").click(function () {
    let status = document.getElementById("statusChamado").value;
    let chamado = document.getElementById("call-id").value;
    let header = document.getElementById("h").value;
    if (status !== "0") {
        let body = {
            id: chamado,
            status: status
        };
        body = JSON.stringify(body);
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "https://helpdesk-tcc-api.herokuapp.com/chamados/status/", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 204) {
                    console.log("sucesso");
                    if (header === "gerente") {
                        window.open(getPath() + "/gerente-chamados", "_self")
                    } else if (header === "analist2") {
                        window.open(getPath() + "/analist2-chamados", "_self")
                    } else {
                        window.open(getPath() + "/analist1-chamados", "_self")
                    }
                }
            }
        }
        xhr.send(body);
    } else {

    }
});

function transferir(idUser) {
    let chamado = document.getElementById("call-id").value;
    let header = document.getElementById("h").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://helpdesk-tcc-api.herokuapp.com/usuarios/" + idUser, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status)
            if (xhr.status === 200) {
                let body = {
                    id: chamado,
                    usuarioResponsavel: JSON.parse(xhr.responseText)
                };
                body = JSON.stringify(body);
                var xhr2 = new XMLHttpRequest();
                xhr2.open("PUT", "https://helpdesk-tcc-api.herokuapp.com/chamados/responsavel/", true);
                xhr2.setRequestHeader("Content-type", "application/json");
                xhr2.setRequestHeader("Accept", "application/json");
                xhr2.onreadystatechange = function () {
                    if (xhr2.readyState === 4) {
                        if (xhr2.status === 204) {
                            console.log("sucesso");
                            if(header === "gerente"){
                                window.open(getPath() + "/gerente-chamados", "_self")
                            } else if (header === "analist2"){
                                window.open(getPath() + "/analist2-chamados", "_self")
                            } else {
                                window.open(getPath() + "/analist1-chamados", "_self")
                            }
                        }
                    }
                }
                xhr2.send(body);
            }
        }
    }
    xhr.send();
    /*

if(status !== "0"){
    let body = {
        id:chamado,
        usuarioResponsavel:status
    };
    body = JSON.stringify(body);
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://helpdesk-tcc-api.herokuapp.com/chamados/status/", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status)
            if (xhr.status === 204) {
                console.log("sucesso");
                if(header === "gerente"){
                    window.open(getPath() + "/gerente-chamados", "_self")
                } else if (header === "analist2"){
                    window.open(getPath() + "/analist2-chamados", "_self")
                } else {
                    window.open(getPath() + "/analist1-chamados", "_self")
                }
            }
        }
    }
    xhr.send(body);
} else {
 
}
*/
}
$("").click(function () {

});