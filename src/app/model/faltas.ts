// export class Falta {
//   codTurma!: string;
//   codDisc!: string;
//   disciplina!: string;
//   situacao!: string;
//   primeiroBimestre!: string;
//   segundoBimestre!: string;
//   totalFaltas!: string;
//   percentual!: number;
//   idTurmaDisc!: number;
//   situacaoFaltas!: number;
// }

export class FaltaDTO {
  codigoDisciplina!: string;
  codigoTurma!: string;
  nomeMateria!: string;
  faltas!: string;
  podeFaltar!: number;
  percentual!: number;
}
