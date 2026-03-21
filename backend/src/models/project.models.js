import mongoose from 'mongoose';


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: [true, 'project name must be uniquee'],
    },
    users: [

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    ]
})

 const Project = mongoose.model("Project", projectSchema)


export default Project;


