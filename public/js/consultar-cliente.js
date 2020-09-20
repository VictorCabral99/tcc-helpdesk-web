function fMasc(objeto,mascara) {
    obj=objeto
    masc=mascara
    setTimeout("fMascEx()",1)
}
function fMascEx() {
    obj.value=masc(obj.value)
}
function mTel(tel) {
    tel=tel.replace(/\D/g,"")
    tel=tel.replace(/^(\d)/,"($1")
    tel=tel.replace(/(.{3})(\d)/,"$1)$2")
    if(tel.length == 9) {
        tel=tel.replace(/(.{1})$/,"-$1")
    } else if (tel.length == 10) {
        tel=tel.replace(/(.{2})$/,"-$1")
    } else if (tel.length == 11) {
        tel=tel.replace(/(.{3})$/,"-$1")
    } else if (tel.length == 12) {
        tel=tel.replace(/(.{4})$/,"-$1")
    } else if (tel.length > 12) {
        tel=tel.replace(/(.{4})$/,"-$1")
    }
    return tel;
}
function mCNPJ(cnpj){
    cnpj=cnpj.replace(/\D/g,"")
    cnpj=cnpj.replace(/^(\d{2})(\d)/,"$1.$2")
    cnpj=cnpj.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3")
    cnpj=cnpj.replace(/\.(\d{3})(\d)/,".$1/$2")
    cnpj=cnpj.replace(/(\d{4})(\d)/,"$1-$2")
    return cnpj
}
function mCPF(cpf){
    cpf=cpf.replace(/\D/g,"")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
    return cpf
}
function mCEP(cep){
    cep=cep.replace(/\D/g,"")
    cep=cep.replace(/^(\d{2})(\d)/,"$1.$2")
    cep=cep.replace(/\.(\d{3})(\d)/,".$1-$2")
    return cep
}
function mNum(num){
    num=num.replace(/\D/g,"")
    return num
}
function validCPF(strCPF) {
    strCPF = strCPF.replace(".","");
    strCPF = strCPF.replace(".","");
    strCPF = strCPF.replace("-","");
    var Soma;
    var Resto;
    var i;
    Soma = 0;
    if (strCPF === "00000000000") {
        return false;
    }
    for (i = 1; i <= 9; i += 1) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;
    if ((Resto === 10) || (Resto === 11)) {
        Resto = 0;
    }
    if (Resto !== parseInt(strCPF.substring(9, 10))) {
        return false;
    }
    Soma = 0;
    for (i = 1; i <= 10; i += 1) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;
    if ((Resto === 10) || (Resto === 11)) {
        Resto = 0;
    }
    if (Resto !== parseInt(strCPF.substring(10, 11))) {
        return false;
    }
    return true;
}
function validCEP(strCEP) {
    strCEP = strCEP.replace(".","");
    strCEP = strCEP.replace("-","");
    var regex = /^(?=(?:.*?[0-9]){8})[[0-9]*$/;
    if (strCEP.length !== 8) {
        return false;
    } else if (!regex.exec(strCEP)) {
        return false;
    } else {
        return true;
    }
}
function validForm(){
    let titulo = document.getElementById("titulo").value;
    let tipo = document.getElementById("tipoChamado").value;
    let descricao = document.getElementById("comment").value;
    let nome = document.getElementById("nome").value;
    let sobrenome = document.getElementById("sobrenome").value;
    let cpf = document.getElementById("cpf").value;
    let data = document.getElementById("data-nascimento").value;
    let cep = document.getElementById("cep").value;
    let logradouro = document.getElementById("logradouro").value;
    let numero = document.getElementById("numero").value;
    let bairro = document.getElementById("bairro").value;
    let cidade = document.getElementById("cidade").value;
    let estado = document.getElementById("estado").value;

    if(titulo){
         if(tipo){
            if(descricao){
                if(nome){
                    if(sobrenome){
                        if(cpf){
                            if(data){
                                if(cep){
                                    if(logradouro){
                                        if(numero){
                                            if(bairro){
                                                if(cidade){
                                                    if(estado){
                                                        return true;
                                                    } else {
                                                        document.getElementById("estado").style.borderColor = "red";
                                                    }
                                                } else {
                                                    document.getElementById("cidade").style.borderColor = "red";
                                                }
                                            } else {
                                                document.getElementById("bairro").style.borderColor = "red";
                                            }
                                        } else {
                                            document.getElementById("numero").style.borderColor = "red";
                                        }
                                    } else {
                                        document.getElementById("logradouro").style.borderColor = "red";
                                    }
                                } else {
                                    document.getElementById("cep").style.borderColor = "red";
                                }
                            } else {
                                document.getElementById("data-nascimento").style.borderColor = "red";
                            }
                        } else {
                            document.getElementById("cpf").style.borderColor = "red";
                        }
                    } else {
                        document.getElementById("sobrenome").style.borderColor = "red";
                    }
                } else {
                    document.getElementById("nome").style.borderColor = "red";
                }
            } else {
                document.getElementById("comment").style.borderColor = "red";
            }
         } else {
            document.getElementById("tipoChamado").style.borderColor = "red";
         }
    } else {
        document.getElementById("titulo").style.borderColor = "red";   
    }
    return false;
}


$("#btnPesquisar").click(function () {
    let documento = document.getElementById("cliente").value;
    if (validCPF(documento)) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://helpdesk-tcc-api.herokuapp.com/clientes/document/" + documento, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let cliente = JSON.parse(xhr.responseText)
                    let id = cliente.id
                    document.getElementById("id-cliente").value = id;
                    document.getElementById("nome").value = cliente.nome;
                    document.getElementById("sobrenome").value = cliente.sobrenome;
                    document.getElementById("cpf").value = cliente.documento;
                    document.getElementById("data-nascimento").value = cliente.dataNascimento;
                    document.getElementById("cep").value = cliente.cep;
                    document.getElementById("logradouro").value = cliente.logradouro;
                    document.getElementById("numero").value = cliente.numero;
                    document.getElementById("complemento").value = cliente.complemento;
                    document.getElementById("bairro").value = cliente.bairro;
                    document.getElementById("cidade").value = cliente.cidade;
                    document.getElementById("estado").value = cliente.estado;
                    if (cliente.sexo === 1) {
                        document.getElementById("M").checked = true;
                    } else {
                        document.getElementById("F").checked = true;
                    }
                    if(document.getElementById("customer").style.display === "none"){
                        $("#customer").fadeToggle();
                    }
                } else {
                    let error = JSON.parse(xhr.responseText);
                    let eror = error.message.split(',');
                    document.getElementById("erro").innerText = eror[0];
                }
            }
        };
        xhr.send();
    } else {
        document.getElementById("erro").innerText = "CPF Inválido";
    }
});

$("#btnAdicionar").click(function (){
    if(document.getElementById("customer").style.display === "none"){
        $("#customer").fadeToggle();
    }
});

$("#btnFinalizar").click(function (){
    if(validForm()){
        document.getElementById("formCadastro").submit();
    } else {

    }
    
});

document.getElementById("cep").addEventListener("focusout", function () {
    if (validCEP(this.value)) {
        let cep = this.value
        cep = cep.replace(".","");
        cep = cep.replace("-","");
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://viacep.com.br/ws/"+cep+"/json/", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let endereco = JSON.parse(xhr.responseText);                    
                    document.getElementById("logradouro").value = endereco.logradouro;
                    document.getElementById("bairro").value = endereco.bairro;
                    document.getElementById("cidade").value = endereco.localidade;
                    document.getElementById("estado").value = endereco.uf;
                } else {
                    let error = JSON.parse(xhr.responseText);
                    let eror = error.message.split(',');
                    document.getElementById("erroCEP").innerText = eror[0];
                }
            }
        };
        xhr.send();
    } else {
        document.getElementById("erroCEP").innerText = "CEP Inválido";
    }
})