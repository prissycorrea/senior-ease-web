import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { Observable } from 'rxjs';
import { Task } from './entities/dashboard-novo.entity';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _firestore = inject(Firestore);
  private readonly _collection = 'tasks';

  public tasks = toSignal(this.getTodayTasks());
  public completedActivitiesInPercent = computed(() => {
    const total = this.tasks()?.length || 0;
    const completed = this.tasks()?.filter((task) => task.completed).length || 0;
    return (completed / total) * 100;
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

  // Criar nova tarefa
  async addTask(task: Task) {
    this.isCreating.set(true);
    try {
      const tasksRef = collection(this._firestore, this._collection);
      return addDoc(tasksRef, { ...task, createdAt: new Date() });
    } finally {
      this.isCreating.set(false);
    }
  }

  // Listar todas as tarefas ordenadas por data
  getTasks(): Observable<Task[]> {
    const tasksRef = collection(this._firestore, this._collection);
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
  }

  // Atualizar tarefa (ex: marcar como concluída)
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

  public getTodayTasks(): Observable<any[]> {
    const tasksRef = collection(this._firestore, this._collection);

    // 1. Pegamos a data de hoje no fuso local e zeramos o horário
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

    // 2. A query busca tudo que está ENTRE o início e o fim do dia na string ISO
    const q = query(
      tasksRef,
      where('period', '>=', startOfDay),
      where('period', '<=', endOfDay),
      orderBy('period', 'asc'), // Opcional: já traz na ordem do dia
    );

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
}
