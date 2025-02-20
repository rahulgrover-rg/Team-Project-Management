import "dotenv/config"
import mongoose from "mongoose";
import connectDB from "../config/database.config";
import RoleModel from "../models/role-permission.model";
import { RolePermissions } from "../utils/role-permission";

const seedRoles = async() => {
    console.log("Seeding roles:\n");
    try {
        await connectDB(); 

        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing existing roles");
        await RoleModel.deleteMany({}, {session});

        for(const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];

            const existingRole = await RoleModel.findOne({
                name: role
            }).session(session);

            if(!existingRole) {
                const newRole = new RoleModel({
                    name : role,
                    permissions: permissions
                });
                await newRole.save({session});
                console.log(`Role ${role} Added with permission.`);
            } else {
                console.log(`Role ${role} already exists.`);
            }
        }
        await session.commitTransaction();
        console.log("Transaction Committed");

        session.endSession();
        console.log("Session ended successfully and seeding is done.");
    } catch (error) {
        console.log("Error during seeding : ",error);
    }
}

seedRoles().catch((error)=> 
    console.log("Error running seed script: ", error)
)