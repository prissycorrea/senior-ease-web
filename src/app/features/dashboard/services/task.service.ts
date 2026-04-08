import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth'; // Importe o Auth
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
import { Task } from './entities/dashboard-novo.entity';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _firestore = inject(Firestore);
  private readonly _auth = inject(Auth);
  private readonly _collection = 'tasks';

  private user$ = user(this._auth);

  public tasks = toSignal(
    this.user$.pipe(
      switchMap((currentUser) => {
        if (currentUser) {
          return this.getTodayTasks(currentUser.uid);
        }
        return of([]);
      }),
    ),
  );

  public completedActivitiesInPercent = computed(() => {
    const total = this.tasks()?.length || 0;
    const completed = this.tasks()?.filter((task) => task.completed).length || 0;
    return total > 0 ? (completed / total) * 100 : 0;
  });

  public tasksPendents = computed(() => {
    return this.tasks()?.filter((task) => !task.completed).length || 0;
  });

  public tasksCompleted = computed(() => {
    return this.tasks()?.filter((task) => task.completed).length || 0;
  });

  public isCreating = signal(false);
  public isUpdating = signal(false);
  public isDeleting = signal(false);

  // Criar nova tarefa vinculada ao usuário
  async addTask(task: Task) {
    const currentUser = this._auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    this.isCreating.set(true);
    try {
      const tasksRef = collection(this._firestore, this._collection);
      return addDoc(tasksRef, {
        ...task,
        userId: currentUser.uid, // Vincula a tarefa ao ID do usuário
        createdAt: new Date(),
      });
    } finally {
      this.isCreating.set(false);
    }
  }

  // Listar tarefas do usuário logado
  getTasks(): Observable<Task[]> {
    return this.user$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) return of([]);

        const tasksRef = collection(this._firestore, this._collection);
        const q = query(
          tasksRef,
          where('userId', '==', currentUser.uid), // Filtro por usuário
          orderBy('createdAt', 'desc'),
        );
        return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
      }),
    );
  }

  // Atualizar tarefa
  updateTask(taskId: string, data: Partial<Task>) {
    this.isUpdating.set(true);
    try {
      const taskDocRef = doc(this._firestore, `${this._collection}/${taskId}`);
      return updateDoc(taskDocRef, data);
    } finally {
      this.isUpdating.set(false);
    }
  }

  // Deletar tarefa
  deleteTask(taskId: string) {
    this.isDeleting.set(true);
    try {
      const taskDocRef = doc(this._firestore, `${this._collection}/${taskId}`);
      return deleteDoc(taskDocRef);
    } finally {
      this.isDeleting.set(false);
    }
  }

  public getTodayTasks(userId: string): Observable<any[]> {
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
  }
}
