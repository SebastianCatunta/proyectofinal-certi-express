import { 
    getUsers, 
    getUserById, 
    saveUserInDB, 
    checkUserInDB,
    updateUserInDB,
    deleteUserInDB,
    updateUserRole
 } from "../services/userService.js";

export async function registerUser(req, res, next){
    const {name, email, password, role, status} = req.body;
    const createdUser = await saveUserInDB(name,email,password,role,status);
    if(createdUser == null){
        const error = Error("User with the same email already exists");
        error.statusCode = 400;
        return next(error);
    }
    return res.success(200,`User created succesfully`,createdUser);
}

export async function loginUser(req, res, next){
    const {email, password} = req.body;
    const responseLogin = await checkUserInDB(email, password);
    if(responseLogin == null){
        const error = Error("Invalid credentials");
        error.statusCode = 401;
        return next(error);
    }
    return res.success(200,`Succesful Login`,responseLogin);
}

export async function findUsers(req, res, next){
    let usersList = await getUsers();
    return res.success(200, "Users found", usersList);
}

export async function findUserById(req, res, next){
    const userId = req.params.id;

    const user = await getUserById(userId);
    if (!user) {
        const error = Error("User not found");
        error.statusCode = 404;
        return next(error);
    }
    return res.success(200, "User found", user);
}

export async function replaceUserById(req, res, next) {
    const userId = req.params.id;
    const { name, email, password, role, status } = req.body;

    const user = await getUserById(userId);
    if (!user) {
        const error = Error("User not found");
        error.statusCode = 404;
        return next(error);
    }

    const updatedUser = await updateUserInDB(userId, name, email, password, role, status);

    if (updatedUser === null) {
        const error = Error("User with the same email already exists");
        error.statusCode = 400;
        return next(error);
    }

    return res.success(200, "User updated successfully", updatedUser);
}

export async function deleteUserById(req, res, next) {
    const userId = req.params.id;
    
    const deletedUserResponse = await deleteUserInDB(userId);
    if (!deletedUserResponse) {
        const error = Error("User not found");
        error.statusCode = 404;
        return next(error);
    }
    return res.success(200, "User deleted successfully", deletedUserResponse);
}

export async function updateRoleById(req, res, next) {
    const userId = req.params.id;
    const { role } = req.body;

    const user = await getUserById(userId);
    if (!user) {
        const error = Error("User not found");
        error.statusCode = 404;
        return next(error);
    }
    const updatedUser = await updateUserRole(userId, role);
    return res.success(200, "User role updated successfully", updatedUser);
}