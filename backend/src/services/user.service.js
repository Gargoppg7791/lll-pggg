const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const jwtProvider = require("../config/jwtProvider");

const createUser = async (userData) => {
    try {
        let { firstName, lastName, email, password, role, mobile } = userData;

        const isUserExist = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (isUserExist) {
            throw new Error("user already exists with email: " + email);
        }

        if (password) {
            password = await bcrypt.hash(password, 8);
        }

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
                role,
                mobile
            }
        });

        console.log("user ", user);

        return user;
    } catch (error) {
        console.log("error - ", error.message);
        throw new Error(error.message);
    }
}

const findUserById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new Error("user not found with id: " + userId);
        }
        return user;
    } catch (error) {
        console.log("error:------- ", error.message);
        throw new Error(error.message);
    }
}

const getUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            throw new Error("user not found with email: " + email);
        }

        return user;
    } catch (error) {
        console.log("error - ", error.message);
        throw new Error(error.message);
    }
}

const getUserProfileByToken = async (token) => {
    try {
        const userId = jwtProvider.getUserIdFromToken(token);

        console.log("user id", userId);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                ratings: true,
                reviews: true,
                orderItems: true,
                address: true,
                cart: true,
                cartItems: true,
                payments: true,
                order: true
            }
        });

        if (!user) {
            throw new Error("user not exist with id: " + userId);
        } else {
            user.password = null;
        }

        return user;
    } catch (error) {
        console.log("error ----- ", error.message);
        throw new Error(error.message);
    }
}

const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        console.log("error - ", error);
        throw new Error(error.message);
    }
}

const findOrCreateGoogleUser = async (profile) => {
    try {
        const { googleId, displayName, email } = profile;

        let user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId,
                    firstName: displayName,
                    email,
                    password: null,
                    mobile: ''
                }
            });
        }

        return user;
    } catch (error) {
        console.log("error - ", error.message);
        throw new Error(error.message);
    }
}

module.exports = {
    createUser,
    findUserById,
    getUserProfileByToken,
    getUserByEmail,
    getAllUsers,
    findOrCreateGoogleUser
};