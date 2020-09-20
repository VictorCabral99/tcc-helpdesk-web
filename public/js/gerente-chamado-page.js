function consultar(id) {
    window.open(getPath() + "/gerente-consulta-chamados?id=" + id, "_self")
}

function alterar(id) {
    window.open(getPath() + "/gerente-altera-chamados?id=" + id, "_self")
}

function finalizar(id) {
    document.getElementById("finalizar").innerHTML = '<a href="' + getPath() + '/delecao/chamado?id=' + id + '&header=gerente"><button class="btn btn-succes modal-ok">Sim</button></a><button data-dismiss="modal" aria-hidden="true" class="btn btn-succes modal-ok">Não</button>';
}