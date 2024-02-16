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

async function amostra(req,res){
  const hasAvaliacaoData = await Avaliacao.findOne({
  });

  const hasAvaliacaoDaeData = await AvaliacaoDae.findOne({
  });

  if (!hasAvaliacaoData && !hasAvaliacaoDaeData) {
    // If no data is found, render the page with default values
    res.render("todos/principal.ejs", {
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

  

  const todasAvaliacoes = await Avaliacao.findAll();
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
   if(mediaIMC <= 18,5){
     classGeralIMC = "Abaixo do normal"
   } else if (mediaIMC < 25,1){
     classGeralIMC = "Normal"
   }else {
    classGeralIMC = "Acima do normal"
   }

   const todasAvaliacoesdae = await AvaliacaoDae.findAll({});
   let somaD = 0, somaA = 0, somaE = 0;
   let somaDepressaoNormal = 0, somaDepressaoLeveModerado = 0, somaDepressaoSeveroExSevero = 0;
   let somaAnsiedadeNormal = 0, somaAnsiedadeLeveModerado = 0, somaAnsiedadeSeveroExSevero = 0;
   let somaEstresseNormal = 0, somaEstresseLeveModerado = 0, somaEstresseSeveroExSevero = 0;
   
   if (todasAvaliacoesdae && todasAvaliacoesdae.length > 0) {
     for (const avaliacaodae of todasAvaliacoesdae) {
       somaD += parseFloat(avaliacaodae.depressaoScore) || 0;
       somaA += parseFloat(avaliacaodae.ansiedadeScore) || 0;
       somaE += parseFloat(avaliacaodae.estresseScore) || 0;
   
       if (avaliacaodae.depressao == 'normal') {
         somaDepressaoNormal += 1;
       } else if (avaliacaodae.depressao == 'leve' || avaliacaodae.depressao == 'moderada') {
         somaDepressaoLeveModerado += 1;
       } else if (avaliacaodae.depressao == 'severo' || avaliacaodae.depressao == 'extremamente severo') {
         somaDepressaoSeveroExSevero += 1;
       }
   
       if (avaliacaodae.ansiedade == 'normal') {
         somaAnsiedadeNormal += 1;
       } else if (avaliacaodae.ansiedade == 'leve' || avaliacaodae.ansiedade == 'moderado') {
         somaAnsiedadeLeveModerado += 1;
       } else if (avaliacaodae.ansiedade == 'severo' || avaliacaodae.ansiedade == 'extremamente severo') {
         somaAnsiedadeSeveroExSevero += 1;
       }
   
       if (avaliacaodae.estresse == 'normal') {
         somaEstresseNormal += 1;
       } else if (avaliacaodae.estresse == 'leve' || avaliacaodae.estresse == 'moderado') {
         somaEstresseLeveModerado += 1;
       } else if (avaliacaodae.estresse == 'severo' || avaliacaodae.estresse == 'extremamente severo') {
         somaEstresseSeveroExSevero += 1;
       }
     }
   }

    const totalResultados = todasAvaliacoesdae.length;
    const porcentagemDNormal = ((somaDepressaoNormal/ totalResultados) * 100).toFixed(1);
    const porcentagemDLeveMod = ((somaDepressaoLeveModerado / totalResultados) * 100).toFixed(1);
    const porcentagemDSevExSev = ((somaDepressaoSeveroExSevero / totalResultados) * 100).toFixed(1);

    const porcentagemANormal = ((somaAnsiedadeNormal/ totalResultados) * 100).toFixed(1);
    const porcentagemALeveMod = ((somaAnsiedadeLeveModerado / totalResultados) * 100).toFixed(1);
    const porcentagemASevExSev = ((somaAnsiedadeSeveroExSevero / totalResultados) * 100).toFixed(1);

    const porcentagemENormal = ((somaEstresseNormal/ totalResultados) * 100).toFixed(1);
    const porcentagemELeveMod = ((somaEstresseLeveModerado / totalResultados) * 100).toFixed(1);
    const porcentagemESevExSev = ((somaEstresseSeveroExSevero / totalResultados) * 100).toFixed(1);

    const mediaD = todasAvaliacoesdae && todasAvaliacoesdae.length > 0
    ? somaD / todasAvaliacoesdae.length
    : 0;

    const mediaA = todasAvaliacoesdae && todasAvaliacoesdae.length > 0
    ? somaA / todasAvaliacoesdae.length
    : 0;

    const mediaE = todasAvaliacoesdae && todasAvaliacoesdae.length > 0
    ? somaE / todasAvaliacoesdae.length
    : 0;
   
    var classSomaD = " ";
       var classSomaA = " ";
       var classSomaE = " ";

      if(mediaD <= 9 ){
        classSomaD = "Normal";
      } else if (mediaD <= 20){
      classSomaD = "Leve à Moderado";
      } else {
        classSomaD = "Severo à Extremamente Severo";
      }

      if(mediaA <= 6){
        classSomaA = "Normal";
      }else if ( mediaA <=14){
        classSomaA = "Leve à Moderado";
      } else {
        classSomaA = "Severo à Extremamente Severo"
      }

      if(mediaE <=10){
        classSomaE = "Normal";
      }else if(mediaE <=26){
        classSomaE = "Leve à Moderado"
      }else{
        classSomaE = "Severo à Extremamente Severo"
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
            UsuarioId: usuariosDoCurso.map(usuario => usuario.id),
          },
        });
        
        
        
        const mediaPontuacoes = avaliacoesDoCurso.reduce((media, avaliacao) => {
        media.depressao += avaliacao.depressaoScore / avaliacoesDoCurso.length;
        media.ansiedade += avaliacao.ansiedadeScore / avaliacoesDoCurso.length;
        media.estresse += avaliacao.estresseScore / avaliacoesDoCurso.length;
        return media;
        }, { depressao: 0, ansiedade: 0, estresse: 0 });
        
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

  console.log(`Média de Depressão para ${cursos[i].nome}:`, mediaDepressaoCurso);
  console.log(`Média de Ansiedade para ${cursos[i].nome}:`, mediaAnsiedadeCurso);
  console.log(`Média de Estresse para ${cursos[i].nome}:`, mediaEstresseCurso);

      
        i++;
      } while (i < cursos.length);

      console.log(cursosComMedias);
      
     

      
      console.log('soma de depressao total: ', somaD);
      console.log('soma de ansiedade total: ', somaA);
      console.log('soma de estresse total: ', somaE);

      
      

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
      console.log("% Depressao Leve-Mod: " , porcentagemDLeveMod);
      console.log("% Depressao Seve-ExtSeve: ", porcentagemDSevExSev);
      console.log("% Ansiedade Normal: ", porcentagemANormal);
      console.log("% Ansiedade Leve-Mod: : ", porcentagemALeveMod);
      console.log("% Ansiedade Seve-ExtSeve: ", porcentagemASevExSev);
      console.log("% Estresse Normal: ", porcentagemENormal);
      console.log("% Estresse Leve-Mod: ", porcentagemELeveMod);
      console.log("% Estresse Seve-ExtSeve: ", porcentagemESevExSev);


  res.render("todos/principal.ejs", { 
 mediaIMC, classGeralIMC, mediaD, mediaA, mediaE,
  somaDepressaoNormal,somaDepressaoLeveModerado, somaDepressaoSeveroExSevero, somaAnsiedadeNormal,
  somaAnsiedadeLeveModerado, somaAnsiedadeSeveroExSevero, somaEstresseNormal, somaEstresseLeveModerado, 
  somaEstresseSeveroExSevero, todasAvaliacoesdae, classSomaA, classSomaD, classSomaE,
  porcentagemDNormal, porcentagemDLeveMod, porcentagemDSevExSev, porcentagemANormal, porcentagemALeveMod,
  porcentagemASevExSev, porcentagemENormal, porcentagemELeveMod, porcentagemESevExSev,
  cursosComMedias,
});
}

async function importausuario(req, res) {
  const usuario = await Usuario.findOne({
    where: {
      id: req.user.id,
    },
  });

  return usuario;
}

async function home(req, res) {
  const usuarioreq = await importausuario(req);

  const hasAvaliacaoData = await Avaliacao.findOne({
  });

  const hasAvaliacaoDaeData = await AvaliacaoDae.findOne({
  });

  if (!hasAvaliacaoData && !hasAvaliacaoDaeData) {
    // If no data is found, render the page with default values
    res.render("admin/principal.ejs", {
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
        TurmaId: { [Op.not]: null } // Só busca avaliações de usuários que pertecem alguma turma
      }
    }
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
   if(mediaIMC <= 18,5){
     classGeralIMC = "Abaixo do normal"
   } else if (mediaIMC < 25,1){
     classGeralIMC = "Normal"
   }else {
    classGeralIMC = "Acima do normal"
   }

   const todasAvaliacoesdae = await AvaliacaoDae.findAll({
    include: {
      model: Usuario,
      where: {
        TurmaId: { [Op.not]: null } // Só busca avaliações de usuários que pertecem alguma turma
      }
    }
  });
   let somaD = 0, somaA = 0, somaE = 0;
   let somaDepressaoNormal = 0, somaDepressaoLeveModerado = 0, somaDepressaoSeveroExSevero = 0;
   let somaAnsiedadeNormal = 0, somaAnsiedadeLeveModerado = 0, somaAnsiedadeSeveroExSevero = 0;
   let somaEstresseNormal = 0, somaEstresseLeveModerado = 0, somaEstresseSeveroExSevero = 0;
   
   if (todasAvaliacoesdae && todasAvaliacoesdae.length > 0) {
     for (const avaliacaodae of todasAvaliacoesdae) {
       somaD += parseFloat(avaliacaodae.depressaoScore) || 0;
       somaA += parseFloat(avaliacaodae.ansiedadeScore) || 0;
       somaE += parseFloat(avaliacaodae.estresseScore) || 0;
   
       if (avaliacaodae.depressao == 'normal') {
         somaDepressaoNormal += 1;
       } else if (avaliacaodae.depressao == 'leve' || avaliacaodae.depressao == 'moderada') {
         somaDepressaoLeveModerado += 1;
       } else if (avaliacaodae.depressao == 'severo' || avaliacaodae.depressao == 'extremamente severo') {
         somaDepressaoSeveroExSevero += 1;
       }
   
       if (avaliacaodae.ansiedade == 'normal') {
         somaAnsiedadeNormal += 1;
       } else if (avaliacaodae.ansiedade == 'leve' || avaliacaodae.ansiedade == 'moderado') {
         somaAnsiedadeLeveModerado += 1;
       } else if (avaliacaodae.ansiedade == 'severo' || avaliacaodae.ansiedade == 'extremamente severo') {
         somaAnsiedadeSeveroExSevero += 1;
       }
   
       if (avaliacaodae.estresse == 'normal') {
         somaEstresseNormal += 1;
       } else if (avaliacaodae.estresse == 'leve' || avaliacaodae.estresse == 'moderado') {
         somaEstresseLeveModerado += 1;
       } else if (avaliacaodae.estresse == 'severo' || avaliacaodae.estresse == 'extremamente severo') {
         somaEstresseSeveroExSevero += 1;
       }
     }
   }

    const totalResultados = todasAvaliacoesdae.length;
    const porcentagemDNormal = ((somaDepressaoNormal/ totalResultados) * 100).toFixed(1);
    const porcentagemDLeveMod = ((somaDepressaoLeveModerado / totalResultados) * 100).toFixed(1);
    const porcentagemDSevExSev = ((somaDepressaoSeveroExSevero / totalResultados) * 100).toFixed(1);

    const porcentagemANormal = ((somaAnsiedadeNormal/ totalResultados) * 100).toFixed(1);
    const porcentagemALeveMod = ((somaAnsiedadeLeveModerado / totalResultados) * 100).toFixed(1);
    const porcentagemASevExSev = ((somaAnsiedadeSeveroExSevero / totalResultados) * 100).toFixed(1);

    const porcentagemENormal = ((somaEstresseNormal/ totalResultados) * 100).toFixed(1);
    const porcentagemELeveMod = ((somaEstresseLeveModerado / totalResultados) * 100).toFixed(1);
    const porcentagemESevExSev = ((somaEstresseSeveroExSevero / totalResultados) * 100).toFixed(1);

    const mediaD = todasAvaliacoesdae && todasAvaliacoesdae.length > 0
    ? somaD / todasAvaliacoesdae.length
    : 0;

    const mediaA = todasAvaliacoesdae && todasAvaliacoesdae.length > 0
    ? somaA / todasAvaliacoesdae.length
    : 0;

    const mediaE = todasAvaliacoesdae && todasAvaliacoesdae.length > 0
    ? somaE / todasAvaliacoesdae.length
    : 0;
   
    var classSomaD = " ";
       var classSomaA = " ";
       var classSomaE = " ";

      if(mediaD <= 9 ){
        classSomaD = "Normal";
      } else if (mediaD <= 20){
      classSomaD = "Leve à Moderado";
      } else {
        classSomaD = "Severo à Extremamente Severo";
      }

      if(mediaA <= 6){
        classSomaA = "Normal";
      }else if ( mediaA <=14){
        classSomaA = "Leve à Moderado";
      } else {
        classSomaA = "Severo à Extremamente Severo"
      }

      if(mediaE <=10){
        classSomaE = "Normal";
      }else if(mediaE <=26){
        classSomaE = "Leve à Moderado"
      }else{
        classSomaE = "Severo à Extremamente Severo"
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
            UsuarioId: usuariosDoCurso.map(usuario => usuario.id),
          },
        });
        
        
        
        const mediaPontuacoes = avaliacoesDoCurso.reduce((media, avaliacao) => {
        media.depressao += avaliacao.depressaoScore / avaliacoesDoCurso.length;
        media.ansiedade += avaliacao.ansiedadeScore / avaliacoesDoCurso.length;
        media.estresse += avaliacao.estresseScore / avaliacoesDoCurso.length;
        return media;
        }, { depressao: 0, ansiedade: 0, estresse: 0 });
        
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

  console.log(`Média de Depressão para ${cursos[i].nome}:`, mediaDepressaoCurso);
  console.log(`Média de Ansiedade para ${cursos[i].nome}:`, mediaAnsiedadeCurso);
  console.log(`Média de Estresse para ${cursos[i].nome}:`, mediaEstresseCurso);

      
        i++;
      } while (i < cursos.length);

     
      console.table(cursosComMedias);
      
     

      
      console.log('soma de depressao total: ', somaD);
      console.log('soma de ansiedade total: ', somaA);
      console.log('soma de estresse total: ', somaE);

      
      

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
      console.log("% Depressao Leve-Mod: " , porcentagemDLeveMod);
      console.log("% Depressao Seve-ExtSeve: ", porcentagemDSevExSev);
      console.log("% Ansiedade Normal: ", porcentagemANormal);
      console.log("% Ansiedade Leve-Mod: : ", porcentagemALeveMod);
      console.log("% Ansiedade Seve-ExtSeve: ", porcentagemASevExSev);
      console.log("% Estresse Normal: ", porcentagemENormal);
      console.log("% Estresse Leve-Mod: ", porcentagemELeveMod);
      console.log("% Estresse Seve-ExtSeve: ", porcentagemESevExSev);


  res.render("admin/principal.ejs", { 
  usuario, mediaIMC, classGeralIMC, mediaD, mediaA, mediaE,
  somaDepressaoNormal,somaDepressaoLeveModerado, somaDepressaoSeveroExSevero, somaAnsiedadeNormal,
  somaAnsiedadeLeveModerado, somaAnsiedadeSeveroExSevero, somaEstresseNormal, somaEstresseLeveModerado, 
  somaEstresseSeveroExSevero, todasAvaliacoesdae, classSomaA, classSomaD, classSomaE,
  porcentagemDNormal, porcentagemDLeveMod, porcentagemDSevExSev, porcentagemANormal, porcentagemALeveMod,
  porcentagemASevExSev, porcentagemENormal, porcentagemELeveMod, porcentagemESevExSev,
  cursosComMedias,
});
}

async function alunos(req, res) {
  const usuario = await importausuario(req);
  const usuarios = await Usuario.findAll({
    include: [
      {
        model: Turmas,
        include: [
          {
            model: Curso,
          },
        ],
      },
    ],
    raw: true,
  });
  const cursos = await Curso.findAll({});
  const turmas = await Turmas.findAll({});

  res.render("admin/alunos.ejs", { usuario, usuarios, cursos, turmas });
}

async function avaliacaocorp(req, res) {
  const usuario = await importausuario(req);
  const usuarios = await Usuario.findAll({});
  res.render("admin/avaliacaocorp.ejs", { usuario, usuarios });
}

async function avaliacaodae(req, res) {
  const usuario = await importausuario(req);
  res.render("admin/avaliacaodae.ejs", { usuario: usuario });
}

async function turmas(req, res) {
  const usuario = await importausuario(req);
  const turma = await Turmas.findAll({}).catch(function (err) {
    console.log(err);
  });
  res.render("admin/turmas.ejs", { usuario: usuario, turma: turma });
}

async function addalunos(req, res) {
  const usuario = await importausuario(req);
  const turma = await Turmas.findAll({}).catch(function (err) {
    console.log(err);
  });
  res.render("admin/addalunos.ejs", { usuario: usuario, turma: turma });
}

async function addcurso(req, res) {
  const usuario = await importausuario(req);
  res.render("admin/addcurso.ejs", { usuario: usuario, msg: "" });
}

async function addalunoslote(req, res) {
  const usuario = await importausuario(req);
  res.render("admin/addalunoslote.ejs", { usuario: usuario, msg: "" });
}

async function arqresp(req, res) {
  const usuario = await importausuario(req);
  res.render("admin/uploadarqresp.ejs", { usuario: usuario, msg: "" });
}

async function addturmas(req, res) {
  const usuario = await importausuario(req);
  const curso = await Curso.findAll({}).catch(function (err) {
    console.log(err);
  });

  console.log(curso);
  res.render("admin/addturmas.ejs", {
    usuario: usuario,
    Curso: curso,
    msg: " ",
  });
}



async function profile(req, res) {
  const usuario = await importausuario(req);
  res.render("admin/profile.ejs", { msg: "", usuario: usuario });
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

      // Restante do código para atualizar os outros campos do perfil
      usuario.nome = req.body.nome;
      usuario.sobrenome = req.body.sobrenome;
      usuario.data_nascimento = req.body.data_nascimento;
      usuario.email = req.body.email;
      usuario.cpf = req.body.cpf;
      usuario.etnia = req.body.etnia;
      usuario.sexo = req.body.sexo;

      const dataNascimento = moment(
        req.body.data_nascimento,
        "YYYY-MM-DD"
      ).startOf("day");
      usuario.data_nascimento = dataNascimento
        .tz("America/Sao_Paulo")
        .format("YYYY-MM-DD");

      const cpfSemCaracteresEspeciais = req.body.cpf.replace(/[^\d]/g, "");
      usuario.cpf = cpfSemCaracteresEspeciais;

      await usuario.save();

      profile(req, res, usuario);
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
      return res.render("admin/profile.ejs", {
        msg: "A senha atual está incorreta!",
        usuario: usuario,
      });
    }

    const hashNovaSenha = await bcrypt.hash(nova_senha, 10);
    usuario.senha = hashNovaSenha;
    await usuario.save();

    return res.render("admin/profile.ejs", {
      msg: "A senha foi atualizada",
      usuario: usuario,
    });
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return res.status(500).send("Erro interno do servidor");
  }
}

async function sair(req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}

async function salvarcurso(req, res) {
  const usuario = await importausuario(req);
  const curso = req.body.curso;

  const Cursosalva = await Curso.create({
    curso: curso,
  });
  res.render("admin/addcurso.ejs", { usuario: usuario, msg: "Curso salvo! " });
}

async function salvarturma(req, res) {
  console.log(req.body);
  const usuario = await importausuario(req);
  const turma = req.body.turma;
  const cursoId = req.body.curso; // Aqui você tem o id do curso selecionado

  // Use cursoId conforme necessário para salvar no banco de dados ou realizar outras operações

  const turmasalva = await Turmas.create({
    turma: turma,
    CursoId: cursoId, // Salva o id do curso no banco de dados
  });

  res.redirect("/addturmas");
}

async function salvaralunos(req, res) {
  const usuario = await importausuario(req);
  const senha = generatePassword();
  const hashedSenha = bcrypt.hashSync(senha, 10);

  const alunosalvar = await Usuario.create({
    nome: req.body.nome,
    email: req.body.email,
    matricula: req.body.matricula,
    TurmaId: req.body.turma,
    senha: hashedSenha,
  });

  res.redirect("/addalunos");
}

async function salvaraqr(req, res) {
  try {
    const usuario = await importausuario(req);
    const filePath = path.join(__dirname, "../public/img", req.file.filename);
    const stream = fs.createReadStream(filePath);
    await parseCSVAndSaveToDatabase(stream);
    res.render("admin/addalunoslote.ejs", {
      usuario: usuario,
      msg: "Dados processados!",
    });
  } catch (error) {
    console.error("Erro ao processar o arquivo CSV:", error);
    res.status(500).send("Erro ao processar o arquivo CSV.");
  }
}

async function parseCSVAndSaveToDatabase(csvStream) {
  return new Promise(async (resolve, reject) => {
    const results = [];

    csvStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const cursos = [];
        const turmas = [];
        const usuarios = [];

        for (const data of results) {
          // Tratamento da data de nascimento
          const dataNascimento = moment(
            data.data_nascimento,
            "DD/MM/YYYY"
          ).startOf("day");
          const dataNascimentoFormatada = dataNascimento
            .tz("America/Sao_Paulo")
            .format("YYYY-MM-DD");
          const senha = generatePassword();
          const hashedSenha = bcrypt.hashSync(senha, 10);

          // Verificar se o curso já existe no banco de dados
          let cursoExistente = await Curso.findOne({
            where: { curso: data.curso },
          });

          // Se não existir, criar o curso
          if (!cursoExistente) {
            cursoExistente = await Curso.create({ curso: data.curso });
            cursos.push(cursoExistente);
          }

          // Verificar se a turma já existe no banco de dados
          let turmaExistente = await Turmas.findOne({
            where: { turma: data.turma },
          });

          // Se não existir, criar a turma
          if (!turmaExistente) {
            // Adicionar o ID do curso à turma
            turmaExistente = await Turmas.create({
              turma: data.turma,
              CursoId: cursoExistente.id,
            });
            turmas.push(turmaExistente);
          }

          // Verificar se o usuário já existe no banco de dados com base no nome
          let usuarioExistente = await Usuario.findOne({
            where: { nome: data.nome },
          });

          if (usuarioExistente) {
            // Se o usuário já existe, apenas atualizar a turma
            await usuarioExistente.update({ TurmaId: turmaExistente.id });
            console.log(`Usuário ${data.nome} já existe. Turma atualizada.`);
          } else {
            // Se o usuário não existe, criar o usuário
            const novoUsuario = {
              nome: data.nome,
              cpf: data.cpf,
              data_nascimento: dataNascimentoFormatada,
              email: data.email,
              senha: hashedSenha,
              matricula: data.matricula,
              TurmaId: turmaExistente.id,
            };

            // Adicionar o novo usuário ao array de usuários
            usuarios.push(novoUsuario);

            console.log(`Usuário ${data.nome} criado com sucesso.`);
          }
        }

        try {
          // Criar cursos
          await Curso.bulkCreate(cursos, { returning: true });

          // Criar turmas associadas aos cursos
          await Turmas.bulkCreate(turmas);

          // Criar usuários associados às turmas
          await Usuario.bulkCreate(usuarios);

          console.log("Dados salvos nas tabelas com sucesso.");
          resolve();
        } catch (error) {
          console.error("Erro ao salvar dados nas tabelas:", error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("Erro ao processar o arquivo CSV:", error);
        reject(error);
      });
  });
}

async function uploadarqresp(req, res) {
  try {
    const usuario = await importausuario(req);
    const filePath = path.join(__dirname, "../public/img", req.file.filename);
    const stream = fs.createReadStream(filePath);
    await parseCSVAndSaveToDatabaseResp(stream);
    res.render("admin/addalunoslote.ejs", {
      usuario: usuario,
      msg: "Dados processados!",
    });
  } catch (error) {
    console.error("Erro ao processar o arquivo CSV:", error);
    res.status(500).send("Erro ao processar o arquivo CSV.");
  }
}

async function parseCSVAndSaveToDatabaseResp(csvStream) {
  return new Promise(async (resolve, reject) => {
    const results = [];

    csvStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const avaliacoes = [];

        for (const data of results) {
          const matricula = data.matricula;
          const usuario = await Usuario.findOne({
            where: {
              matricula: matricula,
            },
          });

          if (usuario) {
            const usuarioId = usuario.id;

            const ansiedadeScore =
              (parseInt(data["2"]) +
                parseInt(data["4"]) +
                parseInt(data["7"]) +
                parseInt(data["9"]) +
                parseInt(data["15"]) +
                parseInt(data["19"]) +
                parseInt(data["20"])) *
              2;

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

            const depressaoScore =
              (parseInt(data["3"]) +
                parseInt(data["5"]) +
                parseInt(data["10"]) +
                parseInt(data["13"]) +
                parseInt(data["16"]) +
                parseInt(data["17"]) +
                parseInt(data["21"])) *
              2;

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

            const estresseScore =
              (parseInt(data["1"]) +
                parseInt(data["6"]) +
                parseInt(data["8"]) +
                parseInt(data["11"]) +
                parseInt(data["12"]) +
                parseInt(data["14"]) +
                parseInt(data["18"])) *
              2;

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

            const novaAvaliacao = {
              UsuarioId: usuarioId,
              data_avaliacao: new Date(),
              perg1: data["1"],
              perg2: data["2"],
              perg3: data["3"],
              perg4: data["4"],
              perg5: data["5"],
              perg6: data["6"],
              perg7: data["7"],
              perg8: data["8"],
              perg9: data["9"],
              perg10: data["10"],
              perg11: data["11"],
              perg12: data["12"],
              perg13: data["13"],
              perg14: data["14"],
              perg15: data["15"],
              perg16: data["16"],
              perg17: data["17"],
              perg18: data["18"],
              perg19: data["19"],
              perg20: data["20"],
              perg21: data["21"],
              estresseScore: estresseScore,
              ansiedadeScore: ansiedadeScore,
              depressaoScore: depressaoScore,
              depressao: depressaoClassificacao,
              ansiedade: ansiedadeClassificacao,
              estresse: estresseClassificacao,
            };

            avaliacoes.push(novaAvaliacao);

            console.log(`Avaliação para  adicionada com sucesso.`);
          } else {
            console.log(
              `Usuário  não encontrado. Avaliação não adicionada.`
            );
          }
        }

        try {
          // Create evaluations associated with users
          await AvaliacaoDae.bulkCreate(avaliacoes);

          console.log("Dados de avaliações salvos na tabela com sucesso.");
          resolve();
        } catch (error) {
          console.error("Erro ao salvar dados de avaliações na tabela:", error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("Erro ao processar o arquivo CSV:", error);
        reject(error);
      });
  });
}

function generatePassword() {
  const chars =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var pass = "";
  for (var i = 0; i < 10; i++) pass += chars.charAt(Math.random() * 61);
  return pass;
}

async function buscaraluno(req, res) {
  let usuario;

  try {
    usuario = await importausuario(req);
    const nome = req.body.nome.trim();

    const usuarios = await Usuario.findAll({
      where: {
        nome: {
          [Sequelize.Op.iLike]: `%${nome}%`, //consulta substring do nome
        },
      },
      include: [
        {
          model: Turmas,
          include: [
            {
              model: Curso,
            },
          ],
        },
      ],
      raw: true,
    });

    res.render("admin/alunos.ejs", { usuarios, usuario });
  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    res.status(500).send("Erro interno do servidor");
  }
}

async function excluiraluno(req, res) {
  const itemId = req.params.id;
  console.log(itemId);

  try {
    const item = await Usuario.destroy({ where: { id: itemId } });

    return res.redirect("/alunos");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover aluno", error });
  }
}

async function verperfilaluno(req, res) {
  let usuario;

  try {
    usuario = await importausuario(req);
    const itemId = req.params.id;

    const aluno = await Usuario.findOne({
      where: {
        id: itemId,
      },
      include: [
        {
          model: Turmas,
          include: [
            {
              model: Curso,
            },
          ],
          // Use 'required: false' to perform a left join
          required: false,
        },
      ],
    });

    const avaliacoes = await Avaliacao.findAll({
      where: {
        UsuarioId: itemId,
      },
    });

    const avaliacoesdae = await AvaliacaoDae.findAll({
      where: {
        UsuarioId: itemId,
      },
    });

    console.log(aluno);
    res.render("admin/profilealunos.ejs", { usuario, aluno, avaliacoes, avaliacoesdae });
  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    res.status(500).send("Erro interno do servidor");
  }
}

async function excluirturma(req, res) {
  const itemId = req.params.id;
  console.log(itemId);

  try {
    await Usuario.update({ TurmaId: null }, { where: { TurmaId: itemId } });

    await Turmas.destroy({ where: { id: itemId } });

    return res.redirect("/turmas");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover turma", error });
  }
}

async function veralunosturma(req, res) {
  let usuario;

  try {
    usuario = await importausuario(req);
    const itemId = req.params.id;

    const alunosdaturma = await Usuario.findAll({
      where: {
        TurmaId: itemId,
      },
      include: [
        {
          model: Turmas,
          include: [
            {
              model: Curso,
            },
          ],
        },
      ],
    });
    
    res.render("admin/veralunosturma.ejs", { usuario, alunosdaturma });
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).send("Erro interno do servidor");
  }
}

async function edtturma(req, res) {
  let usuario;

  try {
    usuario = await importausuario(req);
    const itemId = req.params.id;

    const turma = await Turmas.findOne({
      where: {
        id: itemId,
      },
    });
    res.render("admin/edtturma.ejs", { usuario, turma });
  } catch (error) {
    console.error("Erro ao buscar turma:", error);
    res.status(500).send("Erro interno do servidor");
  }
}

async function updateturma(req, res) {
  const itemId = req.params.id;
  const turma = req.body.turma;

  try {
    const turmaAtualizada = await Turmas.findByPk(itemId);

    if (!turmaAtualizada) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }

    turmaAtualizada.turma = turma;
    await turmaAtualizada.save();

    return res.redirect("/turmas");
  } catch (error) {
    console.error("Erro ao atualizar turma:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

async function salvaravcorp(req, res) {
  try {
    const avaliacaocorp = await Avaliacao.create({
      UsuarioId: req.body.usuario,
      avaliador: req.body.avaliador,
      data_avaliacao: req.body.data_avaliacao,
      estatura: req.body.estatura,
      peso: req.body.peso,
      IMC: req.body.imc,
      FCrep: req.body.fcrep,
      PASrep: req.body.pasrep,
      PADrep: req.body.padrep,
      GCr: req.body.gcr,
      MMr: req.body.mmr,
      MMUr: req.body.mmur,
      H2O: req.body.h2o,
      GordVise: req.body.gordvise,
      Proteina: req.body.proteina,
      TxObes: req.body.txobes,
    });

    return res.redirect("/avaliacaocorp");
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    return res.status(500).send("Erro interno");
  }
}

async function veravcorp(req,res){
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
          attributes: ['nome'],
        },
      ],
    });
    
    res.render("admin/veravcorp.ejs", { usuario, avaliacao });
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    res.status(500).send("Erro interno do servidor");
  }
}

async function veravdae(req,res){
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
          attributes: ['nome'],
        },
      ],
    });
    
    res.render("admin/veravdae.ejs", { usuario, avaliacao });
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    res.status(500).send("Erro interno do servidor");
  }
}

async function deletavaliacaodaealuno(req,res){
  const itemId = req.params.id;
  console.log(itemId);

  try {
    const item = await AvaliacaoDae.destroy({ where: { id: itemId } });

    return res.redirect("/alunos");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover Avaliação DAE", error });
  }
}

async function deletavaliacaocorpaluno(req,res){
  const itemId = req.params.id;
  console.log(itemId);

  try {
    const item = await Avaliacao.destroy({ where: { id: itemId } });

    return res.redirect("/alunos");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover Avaliação corporal", error });
  }
}
module.exports = {
  home,
  alunos,
  avaliacaocorp,
  avaliacaodae,
  turmas,
  addalunos,
  addcurso,
  addalunoslote,
  addturmas,
  profile,
  importausuario,
  salvarperfil,
  novasenhaperfil,
  sair,
  salvarcurso,
  salvarturma,
  salvaraqr,
  salvaralunos,
  buscaraluno,
  excluiraluno,
  verperfilaluno,
  excluirturma,
  veralunosturma,
  edtturma,
  updateturma,
  uploadarqresp,
  salvaravcorp,
  arqresp,
  veravcorp,
  veravdae,
  deletavaliacaodaealuno,
  deletavaliacaocorpaluno,
  amostra,
};
