const bcrypt = require("bcrypt");
const { Op, Sequelize } = require("sequelize");

const moment = require("moment");
const Usuario = require("../models/Usuario");
const Curso = require("../models/Curso");
const Turmas = require("../models/Turmas");
const Avaliacao = require("../models/Avaliacao");
const AvaliacaoDae = require("../models/Avaliacaodae");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

async function importausuario(req, res) {
  const usuario = await Usuario.findOne({
    where: {
      id: req.user.id,
    },
  });
  return usuario;
}

async function principal(req, res) {
  const usuarioreq = await importausuario(req);

  const hasAvaliacaoData = await Avaliacao.findOne({});

  const hasAvaliacaoDaeData = await AvaliacaoDae.findOne({});

  if (!hasAvaliacaoData && !hasAvaliacaoDaeData) {
    // If no data is found, render the page with default values
    res.render("alunos/principal.ejs", {
      usuario: usuarioreq,
      mediaIMC: 0,
      classGeralIMC: " ",
      mediaD: 0,
      mediaA: 0,
      mediaE: 0,
      somaDepressaoNormal: 0,
      somaDepressaoLeveModerado: 0,
      somaDepressaoSeveroExSevero: 0,
      somaAnsiedadeNormal: 0,
      somaAnsiedadeLeveModerado: 0,
      somaAnsiedadeSeveroExSevero: 0,
      somaEstresseNormal: 0,
      somaEstresseLeveModerado: 0,
      somaEstresseSeveroExSevero: 0,
      todasAvaliacoesdae: [], // or provide an empty array for other arrays
      classSomaA: " ",
      classSomaD: " ",
      classSomaE: " ",
      porcentagemDNormal: 0,
      porcentagemDLeveMod: 0,
      porcentagemDSevExSev: 0,
      porcentagemANormal: 0,
      porcentagemALeveMod: 0,
      porcentagemASevExSev: 0,
      porcentagemENormal: 0,
      porcentagemELeveMod: 0,
      porcentagemESevExSev: 0,
      cursosComMedias: [],
    });
    return;
  }
  const usuario = await Usuario.findOne({
    where: {
      id: req.user.id,
    },
  });

  const todasAvaliacoes = await Avaliacao.findAll({
    include: {
      model: Usuario,
      where: {
        TurmaId: { [Op.not]: null }, // Só busca avaliações de usuários que pertecem alguma turma
      },
    },
  });
  // Calcular média do IMC
  let somaIMC = 0;
  if (todasAvaliacoes && todasAvaliacoes.length > 0) {
    for (const avaliacao of todasAvaliacoes) {
      somaIMC += parseFloat(avaliacao.IMC) || 0; // Convertendo para número
    }
  }
  const mediaIMC =
    todasAvaliacoes && todasAvaliacoes.length > 0
      ? somaIMC / todasAvaliacoes.length
      : 0;
  console.log(mediaIMC);

  let classGeralIMC;
  if ((mediaIMC <= 18, 5)) {
    classGeralIMC = "Abaixo do normal";
  } else if ((mediaIMC < 25, 1)) {
    classGeralIMC = "Normal";
  } else {
    classGeralIMC = "Acima do normal";
  }

  const todasAvaliacoesdae = await AvaliacaoDae.findAll({
    include: {
      model: Usuario,
      where: {
        TurmaId: { [Op.not]: null }, // Só busca avaliações de usuários que pertecem alguma turma
      },
    },
  });
  let somaD = 0,
    somaA = 0,
    somaE = 0;
  let somaDepressaoNormal = 0,
    somaDepressaoLeveModerado = 0,
    somaDepressaoSeveroExSevero = 0;
  let somaAnsiedadeNormal = 0,
    somaAnsiedadeLeveModerado = 0,
    somaAnsiedadeSeveroExSevero = 0;
  let somaEstresseNormal = 0,
    somaEstresseLeveModerado = 0,
    somaEstresseSeveroExSevero = 0;

  if (todasAvaliacoesdae && todasAvaliacoesdae.length > 0) {
    for (const avaliacaodae of todasAvaliacoesdae) {
      somaD += parseFloat(avaliacaodae.depressaoScore) || 0;
      somaA += parseFloat(avaliacaodae.ansiedadeScore) || 0;
      somaE += parseFloat(avaliacaodae.estresseScore) || 0;

      if (avaliacaodae.depressao == "normal") {
        somaDepressaoNormal += 1;
      } else if (
        avaliacaodae.depressao == "leve" ||
        avaliacaodae.depressao == "moderada"
      ) {
        somaDepressaoLeveModerado += 1;
      } else if (
        avaliacaodae.depressao == "severo" ||
        avaliacaodae.depressao == "extremamente severo"
      ) {
        somaDepressaoSeveroExSevero += 1;
      }

      if (avaliacaodae.ansiedade == "normal") {
        somaAnsiedadeNormal += 1;
      } else if (
        avaliacaodae.ansiedade == "leve" ||
        avaliacaodae.ansiedade == "moderado"
      ) {
        somaAnsiedadeLeveModerado += 1;
      } else if (
        avaliacaodae.ansiedade == "severo" ||
        avaliacaodae.ansiedade == "extremamente severo"
      ) {
        somaAnsiedadeSeveroExSevero += 1;
      }

      if (avaliacaodae.estresse == "normal") {
        somaEstresseNormal += 1;
      } else if (
        avaliacaodae.estresse == "leve" ||
        avaliacaodae.estresse == "moderado"
      ) {
        somaEstresseLeveModerado += 1;
      } else if (
        avaliacaodae.estresse == "severo" ||
        avaliacaodae.estresse == "extremamente severo"
      ) {
        somaEstresseSeveroExSevero += 1;
      }
    }
  }

  const totalResultados = todasAvaliacoesdae.length;
  const porcentagemDNormal = (
    (somaDepressaoNormal / totalResultados) *
    100
  ).toFixed(1);
  const porcentagemDLeveMod = (
    (somaDepressaoLeveModerado / totalResultados) *
    100
  ).toFixed(1);
  const porcentagemDSevExSev = (
    (somaDepressaoSeveroExSevero / totalResultados) *
    100
  ).toFixed(1);

  const porcentagemANormal = (
    (somaAnsiedadeNormal / totalResultados) *
    100
  ).toFixed(1);
  const porcentagemALeveMod = (
    (somaAnsiedadeLeveModerado / totalResultados) *
    100
  ).toFixed(1);
  const porcentagemASevExSev = (
    (somaAnsiedadeSeveroExSevero / totalResultados) *
    100
  ).toFixed(1);

  const porcentagemENormal = (
    (somaEstresseNormal / totalResultados) *
    100
  ).toFixed(1);
  const porcentagemELeveMod = (
    (somaEstresseLeveModerado / totalResultados) *
    100
  ).toFixed(1);
  const porcentagemESevExSev = (
    (somaEstresseSeveroExSevero / totalResultados) *
    100
  ).toFixed(1);

  const mediaD =
    todasAvaliacoesdae && todasAvaliacoesdae.length > 0
      ? somaD / todasAvaliacoesdae.length
      : 0;

  const mediaA =
    todasAvaliacoesdae && todasAvaliacoesdae.length > 0
      ? somaA / todasAvaliacoesdae.length
      : 0;

  const mediaE =
    todasAvaliacoesdae && todasAvaliacoesdae.length > 0
      ? somaE / todasAvaliacoesdae.length
      : 0;

  var classSomaD = " ";
  var classSomaA = " ";
  var classSomaE = " ";

  if (mediaD <= 9) {
    classSomaD = "Normal";
  } else if (mediaD <= 20) {
    classSomaD = "Leve à Moderado";
  } else {
    classSomaD = "Severo à Extremamente Severo";
  }

  if (mediaA <= 6) {
    classSomaA = "Normal";
  } else if (mediaA <= 14) {
    classSomaA = "Leve à Moderado";
  } else {
    classSomaA = "Severo à Extremamente Severo";
  }

  if (mediaE <= 10) {
    classSomaE = "Normal";
  } else if (mediaE <= 26) {
    classSomaE = "Leve à Moderado";
  } else {
    classSomaE = "Severo à Extremamente Severo";
  }

  const cursos = await Curso.findAll({
    include: [
      {
        model: Turmas,
        include: [
          {
            model: Usuario,
            include: [
              {
                model: AvaliacaoDae,
              },
            ],
          },
        ],
      },
    ],
  }); // Supondo que você tenha um método findAll para buscar todos os cursos

  const cursosComMedias = [];

  let i = 0;
  do {
    const cursoId = cursos[i].id;

    const usuariosDoCurso = await Usuario.findAll({
      include: [
        {
          model: Turmas,
          where: { CursoId: cursoId },
        },
      ],
    });

    // Encontrar todas as avaliações dos usuários do curso
    const avaliacoesDoCurso = await AvaliacaoDae.findAll({
      where: {
        UsuarioId: usuariosDoCurso.map((usuario) => usuario.id),
      },
    });

    const mediaPontuacoes = avaliacoesDoCurso.reduce(
      (media, avaliacao) => {
        media.depressao += avaliacao.depressaoScore / avaliacoesDoCurso.length;
        media.ansiedade += avaliacao.ansiedadeScore / avaliacoesDoCurso.length;
        media.estresse += avaliacao.estresseScore / avaliacoesDoCurso.length;
        return media;
      },
      { depressao: 0, ansiedade: 0, estresse: 0 }
    );

    const mediaDepressaoCurso = mediaPontuacoes.depressao;
    const mediaAnsiedadeCurso = mediaPontuacoes.ansiedade;
    const mediaEstresseCurso = mediaPontuacoes.estresse;

    // Salvar os resultados para cada curso, incluindo o nome do curso
    cursosComMedias.push({
      curso: cursos[i].curso, // Substitua 'nome' pela propriedade correta do curso
      mediaDepressaoCurso,
      mediaAnsiedadeCurso,
      mediaEstresseCurso,
    });

    console.log(
      `Média de Depressão para ${cursos[i].nome}:`,
      mediaDepressaoCurso
    );
    console.log(
      `Média de Ansiedade para ${cursos[i].nome}:`,
      mediaAnsiedadeCurso
    );
    console.log(
      `Média de Estresse para ${cursos[i].nome}:`,
      mediaEstresseCurso
    );

    i++;
  } while (i < cursos.length);

  console.log(cursosComMedias);
  console.log("soma de depressao total: ", somaD);
  console.log("soma de ansiedade total: ", somaA);
  console.log("soma de estresse total: ", somaE);

  console.log("Media Depressao: ", mediaD);
  console.log("Media Ansiedade: ", mediaA);
  console.log("Media Estresse: ", mediaE);
  console.log("Soma Depressão Normal: ", somaDepressaoNormal);
  console.log("Soma Depressão Lev-Mod: ", somaDepressaoLeveModerado);
  console.log("Soma Depressão Seve-ExtSeve: ", somaDepressaoSeveroExSevero);
  console.log("Soma Ansiedade Normal: ", somaAnsiedadeNormal);
  console.log("Soma Ansiedade Lev-Mod: ", somaAnsiedadeLeveModerado);
  console.log("Soma Ansiedade Seve-ExtSeve: ", somaAnsiedadeSeveroExSevero);
  console.log("Soma Estresse Normal: ", somaEstresseNormal);
  console.log("Soma Estresse Lev-Mod: ", somaEstresseLeveModerado);
  console.log("Soma Estresse Seve-ExtSeve", somaEstresseSeveroExSevero);
  console.log("% Depressao Normal: ", porcentagemDNormal);
  console.log("% Depressao Leve-Mod: ", porcentagemDLeveMod);
  console.log("% Depressao Seve-ExtSeve: ", porcentagemDSevExSev);
  console.log("% Ansiedade Normal: ", porcentagemANormal);
  console.log("% Ansiedade Leve-Mod: : ", porcentagemALeveMod);
  console.log("% Ansiedade Seve-ExtSeve: ", porcentagemASevExSev);
  console.log("% Estresse Normal: ", porcentagemENormal);
  console.log("% Estresse Leve-Mod: ", porcentagemELeveMod);
  console.log("% Estresse Seve-ExtSeve: ", porcentagemESevExSev);

  res.render("alunos/principal.ejs", {
    usuario,
    mediaIMC,
    classGeralIMC,
    mediaD,
    mediaA,
    mediaE,
    somaDepressaoNormal,
    somaDepressaoLeveModerado,
    somaDepressaoSeveroExSevero,
    somaAnsiedadeNormal,
    somaAnsiedadeLeveModerado,
    somaAnsiedadeSeveroExSevero,
    somaEstresseNormal,
    somaEstresseLeveModerado,
    somaEstresseSeveroExSevero,
    todasAvaliacoesdae,
    classSomaA,
    classSomaD,
    classSomaE,
    porcentagemDNormal,
    porcentagemDLeveMod,
    porcentagemDSevExSev,
    porcentagemANormal,
    porcentagemALeveMod,
    porcentagemASevExSev,
    porcentagemENormal,
    porcentagemELeveMod,
    porcentagemESevExSev,
    cursosComMedias,
  });
}

async function perfilalunos(req, res) {
  const usuario = await importausuario(req);
  res.render("alunos/profile.ejs", { msg: "", usuario });
}

async function salvarperfil(req, res) {
  try {
    const usuario = await importausuario(req);

    if (usuario) {
      // Verifica se o usuário deseja remover a foto
      const removerFoto = req.body.remover_foto === "true";

      // Lógica para remover a foto se `remover_foto` for verdadeiro
      if (removerFoto) {
        usuario.foto = null;
      } else if (req.file) {
        // Adiciona a nova foto se houver uma nova foto no formulário
        usuario.foto = req.file.filename;
      }

      // Atualiza o CPF após remover caracteres especiais
      const cpfSemCaracteresEspeciais = req.body.cpf.replace(/[^\d]/g, "");

      // Verifica se o CPF já está cadastrado em outro usuário
      const verificacpf = await Usuario.findOne({ cpf: usuario.cpf });

      if (verificacpf && verificacpf.id !== usuario.id) {
        res.render("alunos/profile.ejs", {
          msg: "CPF já cadastrado em outro usuário",
          usuario: usuario,
        });
      } else {
        // Restante do código para atualizar os outros campos do perfil
        usuario.nome = req.body.nome;
        usuario.sobrenome = req.body.sobrenome;
        usuario.data_nascimento = req.body.data_nascimento;
        usuario.email = req.body.email;
        usuario.etnia = req.body.etnia;
        usuario.sexo = req.body.sexo;

        const dataNascimento = moment(
          req.body.data_nascimento,
          "YYYY-MM-DD"
        ).startOf("day");
        usuario.data_nascimento = dataNascimento
          .tz("America/Sao_Paulo")
          .format("YYYY-MM-DD");

        // Atualiza o CPF após remover caracteres especiais
        usuario.cpf = cpfSemCaracteresEspeciais;

        // Salva o usuário apenas se o CPF não estiver cadastrado em outro usuário
        await usuario.save();
        perfilalunos(req, res, usuario);
      }
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar o perfil do usuário" });
  }
}

async function novasenhaperfil(req, res) {
  try {
    const usuario = await importausuario(req);
    const senha_atual = req.body.senha_atual;
    const nova_senha = req.body.nova_senha;
    const senhaCorreta = await bcrypt.compare(senha_atual, usuario.senha);

    if (!senhaCorreta) {
      return res.render("alunos/profile.ejs", {
        msg: "A senha atual está incorreta!",
        usuario: usuario,
      });
    }

    const hashNovaSenha = await bcrypt.hash(nova_senha, 10);
    usuario.senha = hashNovaSenha;
    await usuario.save();

    return res.render("alunos/profile.ejs", {
      msg: "A senha foi atualizada",
      usuario: usuario,
    });
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return res.status(500).send("Erro interno do servidor");
  }
}

async function abreavdae(req, res) {
  const usuario = await importausuario(req);
  res.render("alunos/avaliacaodae.ejs", { usuario });
}

async function salvaravdae(req, res) {
  const usuario = await importausuario(req);

  const perg1 = parseInt(req.body.gridRadios1);
  const perg2 = parseInt(req.body.gridRadios2);
  const perg3 = parseInt(req.body.gridRadios3);
  const perg4 = parseInt(req.body.gridRadios4);
  const perg5 = parseInt(req.body.gridRadios5);
  const perg6 = parseInt(req.body.gridRadios6);
  const perg7 = parseInt(req.body.gridRadios7);
  const perg8 = parseInt(req.body.gridRadios8);
  const perg9 = parseInt(req.body.gridRadios9);
  const perg10 = parseInt(req.body.gridRadios10);
  const perg11 = parseInt(req.body.gridRadios11);
  const perg12 = parseInt(req.body.gridRadios12);
  const perg13 = parseInt(req.body.gridRadios13);
  const perg14 = parseInt(req.body.gridRadios14);
  const perg15 = parseInt(req.body.gridRadios15);
  const perg16 = parseInt(req.body.gridRadios16);
  const perg17 = parseInt(req.body.gridRadios17);
  const perg18 = parseInt(req.body.gridRadios18);
  const perg19 = parseInt(req.body.gridRadios19);
  const perg20 = parseInt(req.body.gridRadios20);
  const perg21 = parseInt(req.body.gridRadios21);

  const depressaoScore =
    (perg3 + perg5 + perg10 + perg13 + perg16 + perg17 + perg21) * 2;
  const ansiedadeScore =
    (perg2 + perg4 + perg7 + perg9 + perg15 + perg19 + perg20) * 2;
  const estresseScore =
    (perg1 + perg6 + perg8 + perg11 + perg12 + perg14 + perg18) * 2;

  let depressaoClassificacao = "";

  if (depressaoScore >= 0 && depressaoScore <= 9) {
    depressaoClassificacao = "normal";
  } else if (depressaoScore >= 10 && depressaoScore <= 12) {
    depressaoClassificacao = "leve";
  } else if (depressaoScore >= 13 && depressaoScore <= 20) {
    depressaoClassificacao = "moderada";
  } else if (depressaoScore >= 21 && depressaoScore <= 27) {
    depressaoClassificacao = "severo";
  } else {
    depressaoClassificacao = "extremamente severo";
  }

  let ansiedadeClassificacao = "";

  if (ansiedadeScore >= 0 && ansiedadeScore <= 6) {
    ansiedadeClassificacao = "normal";
  } else if (ansiedadeScore >= 7 && ansiedadeScore <= 9) {
    ansiedadeClassificacao = "leve";
  } else if (ansiedadeScore >= 10 && ansiedadeScore <= 14) {
    ansiedadeClassificacao = "moderado";
  } else if (ansiedadeScore >= 15 && ansiedadeScore <= 19) {
    ansiedadeClassificacao = "severo";
  } else {
    ansiedadeClassificacao = "extremamente severo";
  }

  let estresseClassificacao = "";

  if (estresseScore >= 0 && estresseScore <= 10) {
    estresseClassificacao = "normal";
  } else if (estresseScore >= 11 && estresseScore <= 18) {
    estresseClassificacao = "leve";
  } else if (estresseScore >= 19 && estresseScore <= 26) {
    estresseClassificacao = "moderado";
  } else if (estresseScore >= 27 && estresseScore <= 34) {
    estresseClassificacao = "severo";
  } else {
    estresseClassificacao = "extremamente severo";
  }

  const novaav = await AvaliacaoDae.create({
    UsuarioId: usuario.id,
    data_avaliacao: new Date(),
    perg1: perg1,
    perg2: perg2,
    perg3: perg3,
    perg4: perg4,
    perg5: perg5,
    perg6: perg6,
    perg7: perg7,
    perg8: perg8,
    perg9: perg9,
    perg10: perg10,
    perg11: perg11,
    perg12: perg12,
    perg13: perg13,
    perg14: perg14,
    perg15: perg15,
    perg16: perg16,
    perg17: perg17,
    perg18: perg18,
    perg19: perg19,
    perg20: perg20,
    perg21: perg21,
    depressaoScore: depressaoScore,
    ansiedadeScore: ansiedadeScore,
    estresseScore: estresseScore,
    depressao: depressaoClassificacao,
    ansiedade: ansiedadeClassificacao,
    estresse: estresseClassificacao,
  });

  res.redirect("/abreav");
}

async function abrelistaav(req, res) {
  const usuario = await importausuario(req);

  const avaliacoes = await Avaliacao.findAll({
    where: {
      UsuarioId: usuario.id,
    },
  });

  const avaliacoesdae = await AvaliacaoDae.findAll({
    where: {
      UsuarioId: usuario.id,
    },
  });

  res.render("alunos/minhasav.ejs", { usuario, avaliacoes, avaliacoesdae });
}

async function veravcorp(req, res) {
  let usuario;

  try {
    usuario = await importausuario(req);
    const itemId = req.params.id;

    const avaliacao = await Avaliacao.findOne({
      where: {
        id: itemId,
      },
      include: [
        {
          model: Usuario,
          attributes: ["nome"],
        },
      ],
    });

    res.render("alunos/veravcorp.ejs", { usuario, avaliacao });
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    res.status(500).send("Erro interno do servidor");
  }
}

async function veravdae(req, res) {
  let usuario;

  try {
    usuario = await importausuario(req);
    const itemId = req.params.id;

    const avaliacao = await AvaliacaoDae.findOne({
      where: {
        id: itemId,
      },
      include: [
        {
          model: Usuario,
          attributes: ["nome"],
        },
      ],
    });

    res.render("alunos/veravdae.ejs", { usuario, avaliacao });
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    res.status(500).send("Erro interno do servidor");
  }
}

module.exports = {
  principal,
  importausuario,
  perfilalunos,
  salvarperfil,
  novasenhaperfil,
  abreavdae,
  salvaravdae,
  abrelistaav,
  veravcorp,
  veravdae,
};
