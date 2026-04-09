import mongoose from "mongoose";
import Task from "../models/tasks.model.js";

function requireUserId(req, res) {
    const uid = req.userId;
    if (!uid || !mongoose.Types.ObjectId.isValid(uid)) {
        res.status(401).json({ message: "Unauthorized" });
        return null;
    }
    return new mongoose.Types.ObjectId(uid);
}

export const getTasks = async (req, res) => {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const tasks = await Task.find({ user: userId }).populate("user");
    res.json(tasks);
};

export const createTasks = async (req, res) => {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { title, description, date } = req.body;

    const newTask = new Task({
        title,
        description,
        ...(date && { date: new Date(date) }),
        user: userId,
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
};

export const getTask = async (req, res) => {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOne({ _id: id, user: userId }).populate("user");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
};

export const updateTasks = async (req, res) => {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid task id" });
    }

    const { title, description, date } = req.body;

    const $set = { title, description };
    if (date) {
        $set.date = new Date(date);
    }

    const task = await Task.findOneAndUpdate(
        { _id: id, user: userId },
        { $set },
        { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.json(task);
};

export const deleteTasks = async (req, res) => {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOneAndDelete({
        _id: id,
        user: userId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
};