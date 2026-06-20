import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/user.repository";
import { AppException } from '../exception/app.exception';
import { HttpStatus } from "../constant/enum";

const userRepository = new UserRepository();
export class AuthenticationService {
    async login(username: string, password: string) {

        const user = await userRepository.findByUserName(username);

        if (!user) {
            throw new AppException(HttpStatus.NOT_FOUND, "User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }
        const accessToken = jwt.sign({ id: user.id, username: user.username, roles: user.roles || []}, process.env.JWT_SECRET!, { expiresIn: "1h" });
        return { accessToken };
    }
    async register(username: string, password: string, name: string, email: string, dateOfBirth: string) {
        const user = await userRepository.findByUserName(username);
        if (user) {
            throw new AppException(HttpStatus.CONFLICT, "User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await userRepository.create({
            username,
            password: hashedPassword,
            name,
            email,
            dataOfBirth: new Date(dateOfBirth)
        });
        await userRepository.assignRolesToUser(createdUser.id, ['user']);
        
        return {
            id: createdUser.id,
            username: createdUser.username,
            name: createdUser.name,
            email: createdUser.email,
            dateOfBirth: createdUser.dataOfBirth,
            roles: ['user']
        };
    }
}