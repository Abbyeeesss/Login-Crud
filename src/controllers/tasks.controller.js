import Task from "../models/tasks.model.js"

export const getTasks = async (req, res) => {
    const tasks = await Task.find({
        user: req.userId
    }).populate('user');
    res.json(tasks);
};

export const createTasks = async (req, res) => {
    const { title, description, date} = req.body;
    
    const newTask = new Task({
        title,
        description,
        date,
        user: req.userId
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
};

export const getTask = async (req, res) => {
    const tasks= await Task.findById(req.params.id).populate('user');
    if (!tasks) return res.status(404).json({ message: "Task not found" });
    res.json(tasks);
};

export const updateTasks = async (req, res) => {
    const tasks= await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!tasks) return res.status(404).json({ message: "Task not found" });
    return res.sendStatus(204);
};

export const deleteTasks = async (req, res) => {
    const tasks= await Task.findByIdAndDelete(req.params.id)
    if (!tasks) return res.status(404).json({ message: "Task not found" });
    res.json(tasks);
};