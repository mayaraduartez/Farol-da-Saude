const { DataTypes, Sequelize } = require("sequelize");
const conexao = require("../config/sequelize"); 

const Avaliacao = conexao.define(
  "Avaliacao",
  {
    UsuarioId:{
        type: DataTypes.INTEGER,
    },
    avaliador: {
        type: DataTypes.STRING,
    },
    data_avaliacao: {
        type: DataTypes.DATEONLY,
    },
    estatura: {
        type: DataTypes.STRING,
    },
    peso: { 
        type: DataTypes.STRING,
    },
    IMC: {
        type: DataTypes.STRING,
    },
    FCrep: {
        type: DataTypes.STRING,
    },
    PASrep: {
        type: DataTypes.STRING,
    },
    PADrep: {
        type: DataTypes.STRING,
    },
    GCr: {
        type: DataTypes.STRING,
    },
    MMr: {
        type: DataTypes.STRING,
    },
    MMUr: {
        type: DataTypes.STRING,
    },
    H2O: {
        type: DataTypes.STRING,
    },
    GordVise: {
        type: DataTypes.STRING,
    },
    Proteina: {
        type: DataTypes.STRING,
    },
    TxObes: {
        type: DataTypes.STRING,
    }
  },
  {
    timestamps: false, 
    tableName: "avaliacao", 
  }
);

module.exports = Avaliacao;