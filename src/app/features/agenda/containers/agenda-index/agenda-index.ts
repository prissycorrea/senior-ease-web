import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';
import { Task } from '../../../dashboard/services/entities/dashboard-novo.entity';
import { TaskService } from '../../../dashboard/services/task.service';

export interface Tarefa {
  id: string;
  titulo: string;
  horario: string;
  status: 'done' | 'missed' | 'pending'; // concluído, perdido ou pendente
  tipo: string; // Ex: 'remedio', 'agua', 'pressao' (para os ícones)
}

@Component({
  selector: 'app-agenda-index',
  imports: [WrapperCard, DatePipe],
  templateUrl: './agenda-index.html',
  styleUrl: './agenda-index.scss',
})
export class AgendaIndex {
  private readonly _task = inject(TaskService);

  public readonly today = new Date().toISOString();

  // Variáveis vinculadas ao HTML
  tarefas: Task[] = [];
  textoDataExibicao: string = 'Hoje';

  // Controle interno da data
  dataSelecionada: Date = new Date();

  public groupTasks = this._task.groupTasks;
  public mudarModo = this._task.mudarModo;
  public viewMode = this._task.viewMode;

  constructor() {}

  ngOnInit(): void {
    // Carrega os dados iniciais assim que a tela abre
    this._carregarTarefasMock();
  }

  // 2. Método chamado pelos botões <- Ontem | Amanhã ->
  mudarData(dias: number): void {
    // Adiciona ou subtrai os dias da data atual
    this.dataSelecionada.setDate(this.dataSelecionada.getDate() + dias);

    // Atualiza o texto na tela (Hoje, Ontem, Amanhã, ou a data por extenso)
    this.atualizarTextoData();

    // Quando você ligar o Firestore, é aqui que você chamará a busca no banco
    // this.buscarTarefasNoFirebase(this.dataSelecionada);

    // Por enquanto, recarrega o mock para simular o funcionamento
    this._carregarTarefasMock();
  }

  // 3. Lógica para deixar a data amigável para leitura
  private atualizarTextoData(): void {
    const hoje = new Date();
    // Zera as horas para comparar apenas os dias
    hoje.setHours(0, 0, 0, 0);
    const dataComparacao = new Date(this.dataSelecionada);
    dataComparacao.setHours(0, 0, 0, 0);

    const diferencaTempo = dataComparacao.getTime() - hoje.getTime();
    const diferencaDias = Math.round(diferencaTempo / (1000 * 3600 * 24));

    if (diferencaDias === 0) {
      this.textoDataExibicao = 'Hoje';
    } else if (diferencaDias === -1) {
      this.textoDataExibicao = 'Ontem';
    } else if (diferencaDias === 1) {
      this.textoDataExibicao = 'Amanhã';
    } else {
      // Se passar de 1 dia, mostra a data (Ex: "12 de Abril")
      this.textoDataExibicao = this.dataSelecionada.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
      });
    }
  }

  // 4. Dados estáticos para você testar o visual do HTML e SCSS
  private _carregarTarefasMock(): void {
    // // this._task.
    // this.tarefas = [
    //   {
    //     id: 't1',
    //     titulo: 'Tomar Losartana 50mg',
    //     horario: '08:00',
    //     status: 'done',
    //     tipo: 'remedio',
    //   },
    //   {
    //     id: 't2',
    //     titulo: 'Beber 2 copos de água',
    //     horario: '10:30',
    //     status: 'missed',
    //     tipo: 'agua',
    //   },
    //   {
    //     id: 't3',
    //     titulo: 'Caminhada leve (15 min)',
    //     horario: '17:00',
    //     status: 'pending', // Pendente (não aplica a classe de erro nem sucesso)
    //     tipo: 'exercicio',
    //   },
    // ];
  }

  // --- FUTURA INTEGRAÇÃO ---
  // Exemplo de como ficará quando você buscar no banco de dados:
  /*
  async buscarTarefasNoFirebase(data: Date) {
    // 1. Formatar a data selecionada para o padrão que você salva no banco (ex: "2026-04-09")
    // 2. Montar a query no Firestore buscando pelo seu uid e pela data
    // 3. Atualizar o array this.tarefas com o retorno do banco
  }
  */
}
