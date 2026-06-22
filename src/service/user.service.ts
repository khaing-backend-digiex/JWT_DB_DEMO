
import { UserRepository } from "../repository/user.repository";
import type { User } from "../interface/user.interface";
import type { CreateUserRequest, UpdateUserRequest } from "../dto/request/user.create.request";
import type { UserResponse } from "../dto/response/user.response";
import { AppException } from '../exception/app.exception';
import { HttpStatus } from "../constant/http-status.enum";
import * as bcrypt from "bcrypt";


export class UserService {
    private userRepository: UserRepository = new UserRepository();


    async createUser(request: CreateUserRequest) {
        const { dataOfBirth } = request;
        const hashedPassword = await bcrypt.hash(request.password, 10);
        const userExists = await this.userRepository.findByUserName(request.username);
        if (userExists) {
            throw new AppException(HttpStatus.BAD_REQUEST, 'User name already exists');
        }

        const createdUser = await this.userRepository.create({
            ...request,
            password: hashedPassword,
            dataOfBirth: new Date(dataOfBirth)
        });
        
        const rolesToAssign = request.roles || ['user'];
        await this.userRepository.assignRolesToUser(createdUser.id, rolesToAssign);
        
        createdUser.roles = rolesToAssign;
        return this.formatUserResponse(createdUser);
    }

    async getUsers(LIMIT: number, OFFSET: number)
    {
        const users = await this.userRepository.findAll(LIMIT, OFFSET);
        return users;   
    }
    
    async getUser(id: string) {
        const user = await this.userRepository.findByUserName(id);
        if (!user) {
            throw new AppException(HttpStatus.NOT_FOUND, 'User not found');
        }
        return this.formatUserResponse(user);
    }

    async updateUser(id: string, request: UpdateUserRequest) {
        const existingUser = await this.userRepository.findByUserName(id);
        if (!existingUser) {
            throw new AppException(HttpStatus.NOT_FOUND, 'User not found');
        }
        const updatedUser = await this.userRepository.update({
            ...existingUser,
            ...request,
            dataOfBirth: request.dataOfBirth ? new Date(request.dataOfBirth) : existingUser.dataOfBirth,
        });

        if (request.roles) {
            await this.userRepository.removeRolesFromUser(updatedUser.id);
            await this.userRepository.assignRolesToUser(updatedUser.id, request.roles);
            updatedUser.roles = request.roles;
        } else {
            updatedUser.roles = existingUser.roles || [];
        }

        return this.formatUserResponse(updatedUser);
    }

    async deleteUser(id: string) {
        const existingUser = await this.userRepository.findByUserName(id);
        if (!existingUser) {
            throw new AppException(HttpStatus.NOT_FOUND, 'User not found');
        }
        const deletedUser = await this.userRepository.delete(existingUser.id);
        return this.formatUserResponse(deletedUser);
    }

    private formatUserResponse(user: User): UserResponse {
        return {
            id: user.id.toString(),
            username: user.username,
            name: user.name,
            email: user.email,
            dataOfBirth: user.dataOfBirth.toISOString().split('T')[0]!,
            roles: user.roles || [],
        };
    }
}