export interface Task {
  id?: number;
  title: string;
  project: string;
  type: string;
  deadline: string;
  planned: string;
  isSelected?: boolean;
  isEditing?: boolean;
  originalValues?: Partial<Task>;
}
