const { DataTypes, Sequelize } = require("sequelize");
const conexao = require("../config/sequelize"); 

const AvaliacaoDae = conexao.define(
  "AvaliacaoDae",
  {
    UsuarioId:{
        type: DataTypes.INTEGER,
    },
    data_avaliacao: {
        type: DataTypes.DATEONLY,
    },
    perg1: { 
        type: DataTypes.INTEGER,
    },
    perg2: { 
        type: DataTypes.INTEGER,
    },
    perg3: { 
        type: DataTypes.INTEGER,
    },
    perg4: { 
        type: DataTypes.INTEGER,
    },
    perg5: { 
        type: DataTypes.INTEGER,
    },
    perg6: { 
        type: DataTypes.INTEGER,
    },
    perg7: { 
        type: DataTypes.INTEGER,
    },
    perg8: { 
        type: DataTypes.INTEGER,
    },
    perg9: { 
        type: DataTypes.INTEGER,
    },
    perg10: { 
        type: DataTypes.INTEGER,
    },
    perg11: { 
        type: DataTypes.INTEGER,
    },
    perg12: { 
        type: DataTypes.INTEGER,
    },
    perg13: { 
        type: DataTypes.INTEGER,
    },
    perg14: { 
        type: DataTypes.INTEGER,
    },
    perg15: { 
        type: DataTypes.INTEGER,
    },
    perg16: { 
        type: DataTypes.INTEGER,
    },
    perg17: { 
        type: DataTypes.INTEGER,
    },
    perg18: { 
        type: DataTypes.INTEGER,
    },
    perg19: { 
        type: DataTypes.INTEGER,
    },
    perg20: { 
        type: DataTypes.INTEGER,
    },
    perg21: { 
        type: DataTypes.INTEGER,
    },
    estresseScore: {
        type: DataTypes.INTEGER,
    },
    depressaoScore:{
        type: DataTypes.INTEGER,
    },
    ansiedadeScore:{
        type: DataTypes.INTEGER,
    },
    depressao: {
        type: DataTypes.STRING,
    },
    ansiedade: {
        type: DataTypes.STRING,
    },
    estresse: {
        type: DataTypes.STRING,
    }

  },
  {
    timestamps: false, 
    tableName: "avaliacaodae", 
  }
);

module.exports = AvaliacaoDae;