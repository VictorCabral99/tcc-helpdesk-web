function consultar(id) {
    window.open(getPath() + "/adm-consulta-funcionario?id=" + id, "_self")
}

function alterar(id) {
    window.open(getPath() + "/adm-altera-funcionario?id=" + id, "_self")
}

function excluir(id,header) {
    document.getElementById("deletar").innerHTML = '<a href="' + getPath() + '/delecao/funcionario?id=' + id + '&header='+ header + '"><button class="btn btn-succes modal-ok">Sim</button></a><button data-dismiss="modal" aria-hidden="true" class="btn btn-succes modal-ok">Não</button>';
}