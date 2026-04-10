import { computed, effect, inject, Injectable, Injector, Signal, signal } from '@angular/core';
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
import { GroupTasks, Task, ViewMode } from './entities/dashboard-novo.entity';
// Importação importante que faltava:
import { runInInjectionContext } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _firestore = inject(Firestore);
  private readonly _auth = inject(Auth);
  private injector = inject(Injector);
  private readonly _collection = 'tasks';

  private user$ = user(this._auth);

  public viewMode = signal<ViewMode>('dia');
  public referenceDate = signal<Date>(new Date());

  // --- SIGNALS DE DADOS ---
  // Adicionado { initialValue: [] } para evitar que os computeds quebrem no primeiro milissegundo
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

  public tasks = toSignal(
    this.user$.pipe(
      switchMap((currentUser) => {
        if (currentUser) {
          // Agora passamos o UID direto para a função, igual ao todayTasks
          return this.getTasks(currentUser.uid);
        }
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  // --- SIGNALS COMPUTADOS ---
  public groupTasks: Signal<GroupTasks[]> = computed(() => {
    const mode = this.viewMode();
    const allTasks = this.tasks() || [];

    // Se não chegou nada do banco ainda, nem tenta filtrar
    if (allTasks.length === 0) return [];

    const hoje = new Date();
    // Armazenamos a data de hoje formatada (Ex: "09/04/2026") para facilitar a comparação do dia
    const hojeFormatado = hoje.toLocaleDateString('pt-BR');

    // --- PASSO 1: FILTRAR ---
    const filteredTasks = allTasks.filter((tarefa) => {
      // Se por algum motivo a tarefa vier sem período, ignoramos
      if (!tarefa.period) return false;

      // Deixa o JS fazer a mágica de ler a string ISO "2026-04-09T23:30:00.000Z"
      const taskDate = new Date(tarefa.period);

      if (mode === 'dia') {
        // Para "Hoje", basta ver se a string "DD/MM/YYYY" da tarefa é igual a de hoje!
        return taskDate.toLocaleDateString('pt-BR') === hojeFormatado;
      }

      else if (mode === 'semana') {
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        return taskDate >= inicioSemana && taskDate <= fimSemana;
      }

      else if (mode === 'mes') {
        return (
          taskDate.getMonth() === hoje.getMonth() &&
          taskDate.getFullYear() === hoje.getFullYear()
        );
      }
      return false;
    });

    // --- PASSO 2: AGRUPAR ---
    const grupos = filteredTasks.reduce((acc: any, tarefa) => {
      const taskDate = new Date(tarefa.period);

      // Cria a chave bonitinha para o título da data no HTML (Ex: "09/04/2026")
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

  public completedActivitiesInPercent = computed(() => {
    const total = this.todayTasks().length;
    const completed = this.todayTasks().filter((task) => task.completed).length;
    return total > 0 ? (completed / total) * 100 : 0;
  });

  public tasksPendents = computed(() => {
    return this.todayTasks().filter((task) => !task.completed).length;
  });

  public tasksCompleted = computed(() => {
    return this.todayTasks().filter((task) => task.completed).length;
  });

  public isCreating = signal(false);
  public isUpdating = signal(false);
  public isDeleting = signal(false);

  constructor() {
    effect(() => {
      console.log('📡 Dados brutos do tasks():', this.tasks());
      console.log('📅 Modo atual:', this.viewMode());
      console.log('🧪 Resultado do agrupamento:', this.groupTasks());
    });
  }

  // --- MÉTODOS DE CRUD ---

  async addTask(task: Task) {
    const currentUser = this._auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    this.isCreating.set(true);
    try {
      const tasksRef = collection(this._firestore, this._collection);
      return addDoc(tasksRef, {
        ...task,
        userId: currentUser.uid,
        createdAt: new Date(),
      });
    } finally {
      this.isCreating.set(false);
    }
  }

  // Corrigido: Recebe o userId e usa runInInjectionContext
  getTasks(userId: string): Observable<Task[]> {
    return runInInjectionContext(this.injector, () => {
      const tasksRef = collection(this._firestore, this._collection);
      const q = query(tasksRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
    });
  }

  // Corrigido: Usa runInInjectionContext
  public getTodayTasks(userId: string): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const tasksRef = collection(this._firestore, this._collection);
      const now = new Date();

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      ).toISOString();

      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      ).toISOString();

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

  updateTask(taskId: string, data: Partial<Task>) {
    this.isUpdating.set(true);
    try {
      const taskDocRef = doc(this._firestore, `${this._collection}/${taskId}`);
      return updateDoc(taskDocRef, data);
    } finally {
      this.isUpdating.set(false);
    }
  }

  deleteTask(taskId: string) {
    this.isDeleting.set(true);
    try {
      const taskDocRef = doc(this._firestore, `${this._collection}/${taskId}`);
      return deleteDoc(taskDocRef);
    } finally {
      this.isDeleting.set(false);
    }
  }

  mudarModo(novoModo: ViewMode) {
    this.viewMode.set(novoModo);
  }
}
