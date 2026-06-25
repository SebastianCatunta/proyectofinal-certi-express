import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../data/users.js";

export async function saveUserInDB(name, email, password, role, status){
    const usersFound = await User.find({email});
    if(usersFound.length > 0){
        return null;
    }
    const  hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        status
    });
    const responseUser = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
    };
    return responseUser;   
};

export async function checkUserInDB(email, password) {
    const usersFound = await User.find({email});
    const userInDB = usersFound[0];
    if(userInDB == null){
        return null;
    }

    const isPasswordCorrect = await bcrypt.compare(password,userInDB.password);
    if(!isPasswordCorrect){
        return null;
    }

   const token = jwt.sign(
    {
        userId: userInDB._id.toString(),
        name: userInDB.name,
        email: userInDB.email,
        role: userInDB.role,
        status: userInDB.status
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);
    return {
        name: userInDB.name,
        token
    };
}

export async function getUsers() {
    const usersInDB = await User.find();
    return usersInDB;
}

export async function getUserById(id) {
    const userInDB = await User.findById(id);
    return userInDB;
}

export async function updateUserInDB(id, name, email, password, role, status) {
    const userWithEmail = await User.findOne({ email });

    if (userWithEmail && userWithEmail._id.toString() !== id) {
        return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            name,
            email,
            password: hashedPassword,
            role,
            status
        },
        { new: true }
    ).select("-password");

    return updatedUser;
}

export async function deleteUserInDB(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
}

export async function updateUserRole(id, role) {
    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
    return updatedUser;
}