//ler do local storage aqui
let candidatos = JSON.parse(localStorage.getItem('candidatos')) || [];

function abrirModal(candidato) {
  if (candidato) {
    document.getElementById("id").value = candidato.id;
    document.getElementById("cpf").value = candidato.cpf;
    document.getElementById("nome").value = candidato.nome;
    document.getElementById("celular").value = candidato.celular;
    document.getElementById("email").value = candidato.email;
    if (candidato.sexo == 'Masculino') {
      document.getElementById("sexoMasculino").checked = true;
    } else {
      document.getElementById("sexoFeminino").checked = true;
    }
    document.getElementById("nascimento").value = candidato.nascimento.split('/').reverse().join('-');
    document.getElementById("skillHtml").checked = candidato.skills.html;
    document.getElementById("skillCss").checked = candidato.skills.css;
    document.getElementById("skillJs").checked = candidato.skills.js;
  }

  $('#candidatoModal').modal('show');
}

function fecharModal() {
  $('#candidatoModal').modal('hide');
  $('body').removeClass('modal-open');
  $('body').removeAttr('style');
  $('.modal-backdrop').remove();

  document.getElementById("id").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("celular").value = "";
  document.getElementById("email").value = "";
  document.getElementById("sexoMasculino").checked = true;
  document.getElementById("nascimento").value = '';
  document.getElementById("skillHtml").checked = false;
  document.getElementById("skillCss").checked = false;
  document.getElementById("skillJs").checked = false;
}

function salvar() {
  let id = document.getElementById("id").value;
  let cpf = document.getElementById("cpf").value;
  let nome = document.getElementById("nome").value;
  let celular = document.getElementById("celular").value;
  let email = document.getElementById("email").value;
  let nascimento = document.getElementById("nascimento").value.split('-').reverse().join('/');
  let sexo = document.getElementById("sexoMasculino").checked;
  let skillHtml = document.getElementById("skillHtml").checked;
  let skillCss = document.getElementById("skillCss").checked;
  let skillJs = document.getElementById("skillJs").checked;

  // Fazer validações aqui

  //validação do cpf
  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11) return false;

    // Verificação de CPFs inválidos conhecidos
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma, resto;
    soma = 0;

    // Valida o primeiro dígito verificador
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    // Valida o segundo dígito verificador
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  // Função para verificar se CPF é único
  function cpfUnico(cpf) {
    return !candidatos.some(candidato => candidato.cpf === cpf);
  }

  // Função para verificar se o nome é completo
  function nomeCompleto(nome) {
    return nome.trim().split(' ').length > 1;
  }

  // Função para verificar idade mínima (maior que 16 anos)
  function idadeMinima(dataNascimento) {
    const dataNasc = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mesAtual = hoje.getMonth() - dataNasc.getMonth();

    if (mesAtual < 0 || (mesAtual === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }

    // Verifica se a idade é maior que 16 anos
    return idade > 16;
  }


  // Validação dos Campos Preenchidos + alerta
  if (!cpf || !nome || !celular || !email || !nascimento) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Por favor, preencha todos os campos obrigatórios.',
    });
    return;
  }

  // Validação do CPF + Alerta
  if (!validarCPF(cpf)) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'CPF inválido',
    });
    return;
  }

  if (!cpfUnico(cpf) && id === '') {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'CPF já cadastrado'
    });
    return;
  }

  // Validação do Sobrenome
  if (!nomeCompleto(nome)) {
    swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Por favor, insira o seu sobrenome',
    });
    return;
  }

  // Validação da idade mínima
  if (!idadeMinima(nascimento)) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'O candidato deve ter mais de 16 anos de idade.',
    });
    return;
  }
  
  if (!skillHtml && !skillCss && !skillJs) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'O candidato deve ter pelo menos uma habilidade.',
    });
    return;
  }



  // Formulário para checar o e-mail
  let formulario = document.getElementById("candidatoForm");
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    //retorna se nao foi preenchido corretamente
    return;
  }



  // Fazer validações aqui

  let candidato = {
    id: id != '' ? id : new Date().getTime(),
    cpf: cpf,
    nome: nome,
    celular: celular,
    email: email,
    sexo: sexo ? 'Masculino' : 'Feminino',
    nascimento: nascimento,
    skills: {
      html: skillHtml,
      css: skillCss,
      js: skillJs
    }
  };

  if (id != '') {
    let checkCandidato = candidatos.find(e => e.id == candidato.id);
    checkCandidato.cpf = candidato.cpf;
    checkCandidato.nome = candidato.nome;
    checkCandidato.celular = candidato.celular;
    checkCandidato.email = candidato.email;
    checkCandidato.sexo = candidato.sexo;
    checkCandidato.nascimento = candidato.nascimento;
    checkCandidato.skills = candidato.skills;
  } else {
    candidatos.push(candidato);
  }

  //salvar a lista de canditatos atualizada no local storage
  localStorage.setItem('candidatos', JSON.stringify(candidatos));

  fecharModal();
  listarCandidatos();
}

function listarCandidatos() {
  let tabela = document.getElementById("table-body");
  tabela.innerHTML = '';

  for (let candidato of candidatos) {
    let linha = document.createElement("tr");

    let colunaCpf = document.createElement("td");
    let colunaNome = document.createElement("td");
    let colunaCelular = document.createElement("td");
    let colunaEmail = document.createElement("td");
    let colunaSexo = document.createElement("td");
    let colunaNascimento = document.createElement("td");
    let colunaSkills = document.createElement("td");
    let colunaEditar = document.createElement("td");
    let colunaRemover = document.createElement("td");

    // Funcionalidades botão editar
    let botaoEditar = document.createElement("button");
    botaoEditar.classList.add('editar');

    let iconeEditar = document.createElement("i");
    iconeEditar.className = "fa-solid fa-pen-to-square";
    botaoEditar.style.border = "none";

    botaoEditar.appendChild(iconeEditar);
    botaoEditar.onclick = function () {
      console.log('editar');
      abrirModal(candidato);
    }

    // Funcionalidades botão remover
    let botaoRemover = document.createElement("button");
    botaoRemover.classList.add('editar');

    let iconeRemover = document.createElement("i");
    iconeRemover.className = "fa-solid fa-trash-can";

    botaoRemover.appendChild(iconeRemover);
    botaoRemover.onclick = function () {

      Swal.fire({
        title: 'Tem certeza?',
        icon: 'warning',
        text: 'O candidato será apagado permanentemente!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          removerCandidato(candidato.id);
          Swal.fire(
            'Removido!',
            'O candidato foi removido com sucesso.',
            'success'
          );
        }
      });
    }


    let arrSkills = [];
    if (candidato.skills.html) {
      arrSkills.push('HTML');
    }
    if (candidato.skills.css) {
      arrSkills.push('CSS');
    }
    if (candidato.skills.js) {
      arrSkills.push('JS');
    }

    //mascara do cpf
    const cpf = document.querySelector('#cpf');

    cpf.addEventListener('keypress', () => {
      let tamanhoInputcpf = cpf.value.length;
      if (tamanhoInputcpf === 3 || tamanhoInputcpf === 7) {
        cpf.value += '.';
      } else if (tamanhoInputcpf == 11) {
        cpf.value += '-';
      }
    })

    //mascara do celular
    const celular = document.querySelector('#celular');

    celular.addEventListener('keypress', () => {
      let tamanhoInputCelular = celular.value.length;
      if (tamanhoInputCelular === 0) {
        celular.value += '(';
      } else if (tamanhoInputCelular === 3) {
        celular.value += ') ';
      } else if (tamanhoInputCelular === 10) {
        celular.value += '-';
      }
    })

    colunaCpf.appendChild(document.createTextNode(candidato.cpf));
    colunaNome.appendChild(document.createTextNode(candidato.nome));
    colunaCelular.appendChild(document.createTextNode(candidato.celular));
    colunaEmail.appendChild(document.createTextNode(candidato.email));
    colunaSexo.appendChild(document.createTextNode(candidato.sexo));
    colunaNascimento.appendChild(document.createTextNode(candidato.nascimento));
    colunaSkills.appendChild(document.createTextNode(arrSkills.join(', ')));
    colunaEditar.appendChild(botaoEditar);
    colunaRemover.appendChild(botaoRemover);

    linha.appendChild(colunaCpf);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaCelular);
    linha.appendChild(colunaEmail);
    linha.appendChild(colunaSexo);
    linha.appendChild(colunaNascimento);
    linha.appendChild(colunaSkills);
    linha.appendChild(colunaEditar);
    linha.appendChild(colunaRemover);
    tabela.appendChild(linha);
  }
}

//Função para remover os Candidatos
function removerCandidato(id) {
  candidatos = candidatos.filter(candidato => candidato.id !== id);
  localStorage.setItem('candidatos', JSON.stringify(candidatos));
  listarCandidatos();
}

listarCandidatos();

//Trecho resposável pelo filtro da tabela
$(document).ready(function () {
  $("#search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#candidatos tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

