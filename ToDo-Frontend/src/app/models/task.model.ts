class Task {
  _id: string;
  assignedTo: string;
  status: string;
  date: Date;
  priority: string;
  description: string;
  ticked: boolean;

  constructor() {
    this._id = '';
    this.description = '';
    this.date = new Date();
    this.status = '';
    this.assignedTo = '';
    this.priority = '';
    this.ticked = false;
  }
}

export default Task;


