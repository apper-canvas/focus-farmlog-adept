import tasksData from "../mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === id);
    if (!task) throw new Error("Task not found");
    return { ...task };
  }

  async getByFarm(farmId) {
    await this.delay();
    return this.tasks.filter(t => t.farmId === farmId).map(t => ({ ...t }));
  }

  async getPending() {
    await this.delay();
    return this.tasks.filter(t => !t.completed).map(t => ({ ...t }));
  }

  async create(taskData) {
    await this.delay();
    const newId = Math.max(...this.tasks.map(t => t.Id)) + 1;
    const newTask = {
      ...taskData,
      Id: newId,
      farmId: parseInt(taskData.farmId),
      cropId: taskData.cropId ? parseInt(taskData.cropId) : null,
      completed: false
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) throw new Error("Task not found");
    
    this.tasks[index] = {
      ...taskData,
      Id: id,
      farmId: parseInt(taskData.farmId),
      cropId: taskData.cropId ? parseInt(taskData.cropId) : null
    };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) throw new Error("Task not found");
    
    this.tasks.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const taskService = new TaskService();