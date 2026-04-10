export interface Task {
  id?: string;
  task: string;
  period: string;
  completed: boolean;
  createdAt: Date;
  userId?: string;
}

export interface GroupTasks {
  date: string;
  tasks: Task[];
}

export type ViewMode = 'dia' | 'semana' | 'mes';
