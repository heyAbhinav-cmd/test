import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import Task from './models/task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public newTask: Task = new Task();
  editTasks: Task[] = [];
  selectedTasks : Task[] = [];
  toDoList: Task[] = [];
  searchQuery: string = '';
  filteredTasks: Task[] = [];
  statusOptions: any[] = [
    { label: 'assigned', value: 'assigned' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Done', value: 'Done' }
  ];
  displayDialog: boolean = false; 
  editTaskMode: boolean = false; // Flag to determine if we are in edit mode

  constructor(private taskService: TaskService) {}

  async ngOnInit(): Promise<void> {
    await this.loadTasks();
  }

  async loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (response: any) => {
        this.toDoList = response.data;
        this.filteredTasks = [...this.toDoList];
        console.log('this is todolist', this.toDoList);
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.showToast('Failed to load tasks', 'bg-danger');
      }
    });
  }

  showDialog(task?: Task): void {
    if (task) {
      this.newTask = { ...task }; 
      this.editTaskMode = true;
    } else {
      this.newTask = new Task(); 
      this.editTaskMode = false; 
    }
    this.displayDialog = true; 
  }

  hideDialog(): void {
    this.displayDialog = false; 
  }

  async saveTask(): Promise<void> {
    if (this.newTask.description) {
      if (this.editTaskMode) {
        this.taskService.editTask(this.newTask).subscribe({
          next: (res: Task) => {
            const index = this.toDoList.findIndex(task => task._id === this.newTask._id);
            if (index !== -1) {
              this.toDoList[index] = res;
            }
            this.resetNewTask();
            this.loadTasks();
            this.showToast('Task updated successfully', 'bg-success');
          },
          error: (err) => {
            console.error('Error updating task:', err);
            this.showToast('Error updating task', 'bg-danger');
          }
        });
      } else {
        this.taskService.createTask(this.newTask).subscribe({
          next: (res: Task) => {
            // Ensure res is of type Task
            const newTask = res;
            this.toDoList.push(newTask);
            this.resetNewTask();
            this.loadTasks();
            this.showToast('Task created successfully', 'bg-success');
          },
          error: (err) => {
            console.error('Error creating task:', err);
            this.showToast('Error creating task', 'bg-danger');
          }
        });
      }
    } else {
      this.showToast('Please enter a task name', 'bg-warning');
    }
  }
  

  resetNewTask(): void {
    this.newTask.assignedTo = '';
    this.newTask.date = new Date();
    this.newTask.status = '';
    this.newTask.assignedTo = '';
    this.newTask.priority = '';
    this.newTask.ticked = false;
    this.displayDialog = false; 
  }

  editTask(task: Task): void {
    this.showDialog(task); 
  }

  doneTask(task: Task): void {
    task.status = 'Done';
    this.taskService.editTask(task).subscribe(
      res => {
        this.showToast('Task marked as done', 'bg-success');
      },
      err => {
        this.showToast('Error marking task as done', 'bg-danger');
      }
    );
  }

  submitTask(event: KeyboardEvent, task: Task): void {
    if (event.key === 'Enter') {
      this.editTask(task);
    }
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task._id).subscribe(
      res => {
        this.toDoList.splice(this.toDoList.indexOf(task), 1);
        this.showToast('Task deleted successfully', 'bg-success');
      },
      err => {
        this.showToast('Error deleting task', 'bg-danger');
      }
    );
  }

  refreshTasks(): void {
    this.loadTasks();
    this.showToast('Task list refreshed', 'bg-info');
  }

  searchTasks(): Task[] {
    if (!this.searchQuery) {
      this.toDoList = this.filteredTasks ;
      this.searchQuery = '';
      return this.toDoList;
    }
    this.toDoList = this.filteredTasks.filter(task => task.assignedTo.toLowerCase().includes(this.searchQuery.toLowerCase()));

    if(this.toDoList.length ==0){
      this.toDoList = this.filteredTasks ;
      this.showToast('Please Enter Valid Data', 'bg-info');
      this.searchQuery = '';
    }

    return this.toDoList ;
  }

  showToast(message: string, classname: string, delay = 3000): void {
    alert(message);
  }
  removeToast(message: string): void {
    alert(message);
  }
}
