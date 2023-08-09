const bancoDados = require('../database/config');

// Funções Locais (Não será exportar)-----------
function info(nome_funcao, info_query) {
    console.log(`\n[User Model] ${nome_funcao} => ${info_query}`);
}


// Funções para exportar
function listar() {
    var query = 'SELECT * FROM usuario';

    info("Listar()", query);

    return bancoDados.consultaBd(query);
}

module.exports = {
    listar
}