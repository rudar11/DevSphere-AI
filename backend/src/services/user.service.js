import userModel from "../models/user.models.js";


export const createUser = async ({
    email, password
}) => {

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        email,
        password: hashedPassword
    });
    return user;

};

//Yeh function current logged-in user ko hata ke baaki sab users return karta hai.
export const getAllUser = async ({ userId }) => {

    const users = await userModel.find({
        _id: { $ne: userId }
    });
    return users;
}




