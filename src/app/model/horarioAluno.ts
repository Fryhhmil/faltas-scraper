export class HorarioAluno {
  id!: number;
  diaSemana!: string;
  horaInicial!: string;
  horaFinal!: string;
  codTurma!: string;
  codDisc!: string;
  nome!: string;
  idTurmaDisc!: number;
  impBoletim!: string;
}

export class HorarioAlunoDTO {
  linhas!: HorarioAlunoLinhaDTO[];
  podefaltarSegunda!: number;
  podefaltarTerca!: number;
  podefaltarQuarta!: number;
  podefaltarQuinta!: number;
  podefaltarSexta!: number;
}

export class HorarioAlunoLinhaDTO {
  segunda!: HorarioAluno;
  terca!: HorarioAluno;
  quarta!: HorarioAluno;
  quinta!: HorarioAluno;
  sexta!: HorarioAluno;
}
