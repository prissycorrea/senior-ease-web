import { computed, inject, Injectable, Injector, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { runInInjectionContext } from '@angular/core';
import { GroupTasks, Task, ViewMode } from './entities/dashboard-novo.entity';

/**
 * Serviço responsável pelo gerenciamento de tarefas do usuário.
 * Lida com o CRUD no Firebase Firestore e com a lógica reativa de
 * agrupamento e filtragem de tarefas baseada em períodos (dia, semana, mês).
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _firestore = inject(Firestore);
  private readonly _auth = inject(Auth);
  private readonly injector = inject(Injector);
  private readonly _collection = 'tasks';

  /** * Observable do usuário atualmente logado no Firebase Auth.
   */
  private user$ = user(this._auth);

  /** Modo de visualização atual da agenda (dia, semana ou mes) */
  public viewMode = signal<ViewMode>('dia');

  /** Data que serve de âncora para navegação e filtros (padrão: hoje) */
  public referenceDate = signal<Date>(new Date());

  // ==========================================================================
  // SIGNALS DE DADOS (Reativos ao estado de autenticação)
  // ==========================================================================

  /**
   * Contém apenas as tarefas do dia de hoje para o usuário logado.
   * Utilizado principalmente para alimentar as métricas do Dashboard.
   */
  public todayTasks = toSignal(
    this.user$.pipe(
      switchMap((currentUser) => {
        if (currentUser) {
          return this.getTodayTasks(currentUser.uid);
        }
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  /**
   * Contém todas as tarefas cadastradas do usuário logado.
   * Utilizado como base de dados em memória para a tela de Agenda.
   */
  public tasks = toSignal(
    this.user$.pipe(
      switchMap((currentUser) => {
        if (currentUser) {
          return this.getTasks(currentUser.uid);
        }
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  // ==========================================================================
  // SIGNALS COMPUTADOS (Derivados dos dados)
  // ==========================================================================

  /**
   * Transforma a lista plana de tarefas em uma estrutura agrupada por data,
   * filtrando automaticamente com base no `viewMode` selecionado.
   * @returns Array de objetos contendo a data formatada e as tarefas daquele dia.
   */
  public groupTasks: Signal<GroupTasks[]> = computed(() => {
    const mode = this.viewMode();
    const allTasks = this.tasks() || [];

    if (allTasks.length === 0) return [];

    const hoje = new Date();
    const hojeFormatado = hoje.toLocaleDateString('pt-BR');

    // Filtra relativo ao período selecionado
    const filteredTasks = allTasks.filter((tarefa) => {
      if (!tarefa.period) return false;

      const taskDate = new Date(tarefa.period);

      if (mode === 'dia') {
        return taskDate.toLocaleDateString('pt-BR') === hojeFormatado;
      } else if (mode === 'semana') {
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        return taskDate >= inicioSemana && taskDate <= fimSemana;
      } else if (mode === 'mes') {
        return (
          taskDate.getMonth() === hoje.getMonth() &&
          taskDate.getFullYear() === hoje.getFullYear()
        );
      }
      return false;
    });

    // Agrupa por data formatada (DD/MM/YYYY)
    const grupos = filteredTasks.reduce((acc: any, tarefa) => {
      const taskDate = new Date(tarefa.period);
      const dataChave = taskDate.toLocaleDateString('pt-BR');

      if (!acc[dataChave]) acc[dataChave] = [];
      acc[dataChave].push(tarefa);
      return acc;
    }, {});

    return Object.keys(grupos).map((data) => ({
      date: data,
      tasks: grupos[data],
    }));
  });

  /** Retorna a porcentagem (0 a 100) de tarefas concluídas no dia atual */
  public completedActivitiesInPercent = computed(() => {
    const total = this.todayTasks().length;
    const completed = this.todayTasks().filter((task) => task.completed).length;
    return total > 0 ? (completed / total) * 100 : 0;
  });

  /** Quantidade absoluta de tarefas não concluídas hoje */
  public tasksPendents = computed(() => {
    return this.todayTasks().filter((task) => !task.completed).length;
  });

  /** Quantidade absoluta de tarefas já concluídas hoje */
  public tasksCompleted = computed(() => {
    return this.todayTasks().filter((task) => task.completed).length;
  });

  // ==========================================================================
  // ESTADOS DE CARREGAMENTO (Loading Indicators)
  // ==========================================================================

  /** Indica se existe uma requisição em andamento para criar uma nova tarefa */
  public isCreating = signal(false);

  /** Indica se existe uma requisição em andamento para atualizar uma tarefa */
  public isUpdating = signal(false);

  /** Indica se existe uma requisição em andamento para deletar uma tarefa */
  public isDeleting = signal(false);

  // ==========================================================================
  // MÉTODOS DE CRUD
  // ==========================================================================

  /**
   * Cria uma nova tarefa no banco de dados vinculada ao usuário atual.
   * @param task Objeto contendo os dados da nova tarefa.
   * @returns Uma Promise com a referência do documento criado.
   */
  async addTask(task: Task) {
    const currentUser = this._auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    this.isCreating.set(true);
    try {
      const tasksRef = collection(this._firestore, this._collection);
      return await addDoc(tasksRef, {
        ...task,
        userId: currentUser.uid,
        createdAt: new Date(),
      });
    } finally {
      this.isCreating.set(false);
    }
  }

  /**
   * Busca todas as tarefas associadas a um usuário específico.
   * Ouve as mudanças em tempo real.
   * @param userId ID do usuário no Firebase Auth.
   * @returns Observable com a lista de tarefas ordenada pela criação.
   */
  getTasks(userId: string): Observable<Task[]> {
    return runInInjectionContext(this.injector, () => {
      const tasksRef = collection(this._firestore, this._collection);
      const q = query(
        tasksRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
    });
  }

  /**
   * Busca estritamente as tarefas que ocorrem dentro da janela de 24h do dia atual.
   * Ouve as mudanças em tempo real.
   * @param userId ID do usuário no Firebase Auth.
   * @returns Observable com a lista de tarefas do dia.
   */
  public getTodayTasks(userId: string): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const tasksRef = collection(this._firestore, this._collection);
      const now = new Date();

      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

      const q = query(
        tasksRef,
        where('userId', '==', userId),
        where('period', '>=', startOfDay),
        where('period', '<=', endOfDay),
        orderBy('period', 'asc'),
      );

      return collectionData(q, { idField: 'id' }) as Observable<any[]>;
    });
  }

  /**
   * Atualiza propriedades parciais de uma tarefa existente.
   * @param taskId O ID do documento da tarefa no Firestore.
   * @param data Objeto contendo os campos a serem atualizados (ex: { completed: true }).
   */
  updateTask(taskId: string, data: Partial<Task>) {
    this.isUpdating.set(true);
    try {
      const taskDocRef = doc(this._firestore, `${this._collection}/${taskId}`);
      return updateDoc(taskDocRef, data);
    } finally {
      this.isUpdating.set(false);
    }
  }

  /**
   * Remove permanentemente uma tarefa do banco de dados.
   * @param taskId O ID do documento da tarefa no Firestore.
   */
  deleteTask(taskId: string) {
    this.isDeleting.set(true);
    try {
      const taskDocRef = doc(this._firestore, `${this._collection}/${taskId}`);
      return deleteDoc(taskDocRef);
    } finally {
      this.isDeleting.set(false);
    }
  }

  // ==========================================================================
  // CONTROLE DE INTERFACE
  // ==========================================================================

  /**
   * Altera a visualização da agenda e dispara automaticamente
   * o recalculo do Signal `groupTasks`.
   * @param novoModo 'dia', 'semana' ou 'mes'.
   */
  mudarModo(novoModo: ViewMode) {
    this.viewMode.set(novoModo);
  }
}
