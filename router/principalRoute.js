const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); 
const principalController = require("../controllers/principalController"); 
const usuarioController = require("../controllers/usuarioController");
const upload = require("../config/upload");
const autenticacao = require("../config/autenticacao");
const autenticacaoadmin = require("../config/autenticacaoadmin");

// Páginas login
router.get('/login', loginController.abrelogin);

router.get('/cadastrar', loginController.cadastrar);

router.post('/cadastrar', loginController.cadastro);

router.post('/login', loginController.logar);

router.get('/primeiroacesso', loginController.primeiroacesso);

router.get('/forgot', loginController.forgot);

router.post('/forgot', loginController.recuperar);

router.get('/token', loginController.token);

router.post('/token' , loginController.atualizarsenha);

// Páginas adm
router.get('/principaladm', 
autenticacaoadmin,
principalController.home);

router.get('/profile',
autenticacaoadmin,
principalController.profile);

router.post('/salvarperfil', 
upload.single('foto'),
autenticacaoadmin,
principalController.salvarperfil);

router.post('/profile',
autenticacaoadmin,
principalController.novasenhaperfil);

router.get('/avaliacaocorp',
autenticacaoadmin,
principalController.avaliacaocorp);

router.post('/avaliacaocorp', 
autenticacaoadmin,
principalController.salvaravcorp);

router.get('/avaliacaodae', 
autenticacaoadmin,
principalController.avaliacaodae);

router.get('/addalunos',
autenticacaoadmin,
principalController.addalunos);

router.get('/addcursos', 
autenticacaoadmin,
principalController.addcurso);

router.get('/addalunoslote', 
autenticacaoadmin,
principalController.addalunoslote);

router.post('/addalunoslote', 
autenticacaoadmin,
upload.single('arquivo'), principalController.salvaraqr);

router.get('/addturmas', 
autenticacaoadmin,
principalController.addturmas);

router.get('/turmas', 
autenticacaoadmin,
principalController.turmas);

router.get('/alunos', 
autenticacaoadmin,
principalController.alunos);

router.post('/sair', 
principalController.sair);

router.post('/addcursos', 
autenticacaoadmin,
principalController.salvarcurso);

router.post('/addturmas', 
autenticacaoadmin,
principalController.salvarturma);

router.post('/addalunos', 
autenticacaoadmin,
principalController.salvaralunos);

router.post('/alunos', 
autenticacaoadmin,
principalController.buscaraluno);

router.post('/excluiraluno/:id', 
autenticacaoadmin,
principalController.excluiraluno);

router.post('/verperfil/:id', 
autenticacaoadmin,
principalController.verperfilaluno);

router.post('/excluirturma/:id', 
autenticacaoadmin,
principalController.excluirturma);

router.post('/veralunos/:id', 
autenticacaoadmin,
principalController.veralunosturma);

router.post('/edtturma/:id', 
autenticacaoadmin,
principalController.edtturma);

router.post('/updateturma/:id' , 
autenticacaoadmin,
principalController.updateturma);

router.get('/uploadarqresp', 
autenticacaoadmin,
principalController.arqresp);

router.post('/uploadarqresp',
upload.single('arquivo'),
autenticacaoadmin,
principalController.uploadarqresp);

router.post('/veravaliacaocorpaluno/:id', 
autenticacaoadmin,
principalController.veravcorp);

router.post('/veravaliacaodaealuno/:id', 
autenticacaoadmin,
principalController.veravdae);

router.post('/deletavaliacaodaealuno/:id', 
autenticacaoadmin,
principalController.deletavaliacaodaealuno);

router.post('/deletavaliacaocorpaluno/:id', 
autenticacaoadmin,
principalController.deletavaliacaocorpaluno);

router.get('/rt',
autenticacaoadmin,
principalController.relatorio);

router.post('/rt',
autenticacaoadmin,
principalController.emiterelatorio);

//páginas usuario

router.get('/principal',
usuarioController.principal);

router.get('/perfilalunos', 
usuarioController.perfilalunos);

router.post('/salvarperfilalunos', 
upload.single('foto'),
autenticacao,
usuarioController.salvarperfil);

router.post('/perfilalunos',
usuarioController.novasenhaperfil);

router.get('/abreavdae', 
autenticacao,
usuarioController.abreavdae);

router.post('/abreavdae',
usuarioController.salvaravdae);

router.get('/abreav',
usuarioController.abrelistaav);

router.post('/verminhaavaliacaocorp/:id', 
autenticacao,
usuarioController.veravcorp);

router.post('/verminhaavaliacaodae/:id', 
autenticacao,
usuarioController.veravdae);

//views usuarios qualquer (sem login)

router.get('/', 
principalController.amostra);

module.exports = router;