import mongoose from "mongoose";
import projectModel from "../models/project.models.js";

export const createProject = async ({ name, userId }) => {   // project ka name kya hai or kis particular user ne project create kiya hai 
    if (!name) {
        throw new Error('Name is Required')
    }
    if (!userId) {
        throw new Error('UserId is Required')
    }

    const project = await projectModel.create({
        name,
        users: [userId]
    })
    return project;
}


export const getAllProjectByUserId = async ({ userId }) => {

    if (!userId) {
        throw new Error('UserId is required')
    }


    const allUserProjects = await projectModel.find({ users: userId })

    return allUserProjects

}


export const addUsersToProject = async ({ projectId, users, userId }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("invalid projectId")
    }

    if (!users) {
        throw new Error("users are required")
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }

    if (!userId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("invalid userId")
    }

    const project = await projectModel.findOne({ _id: projectId, users: userId })

    if (!project) {
        throw new Error("user not belong to this project")
    }

    const updatedProject = await projectModel.findOneAndUpdate({

        _id: projectId
    }, {
        $addToSet: {
            users: {
                $each: users
            }
        }

    }, {
        new: true
    })
    return updatedProject

}


export const getProjectById = async({projectId})=>{

    if (!projectId) {
    throw new Error("projectId is required")
}

if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId")
}

const project = await projectModel.findOne({
    _id: projectId
}).populate('users')

return project;
}