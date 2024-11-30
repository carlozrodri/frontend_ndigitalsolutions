export interface Task {
    id?: number;
    title: string;
    description: string;
    completed?: boolean;
  }

export interface TaskFormProps {
    taskId?: number;
    task?: Task;
  }