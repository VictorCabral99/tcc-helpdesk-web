function consultar(id) {
    window.open(getPath() + "/analist1-consulta-chamados?id=" + id, "_self")
}

function alterar(id) {
    window.open(getPath() + "/analist1-altera-chamados?id=" + id, "_self")
}

function finalizar(id) {
    document.getElementById("finalizar").innerHTML = '<a href="' + getPath() + '/delecao/chamado?id=' + id + '&header=analist1"><button class="btn btn-succes modal-ok">Sim</button></a><button data-dismiss="modal" aria-hidden="true" class="btn btn-succes modal-ok">Não</button>';
}