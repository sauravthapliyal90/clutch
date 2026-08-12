import { NotFoundError } from "@shared/error/AppError"
import { usersRepository } from "./users.repository"
import { toUserDto } from "./users.dto"
import {UpdateProfileInput} from './users.type'
import { buildPaginationResult, toSkipTake } from "@shared/pagination/pagination"
import { buildCheckFunction } from "express-validator"

export const usersService = {
    async getProfile(userId: string) {
        const user = await usersRepository.findById(userId)
        if (!user) throw new NotFoundError("User not found")

        return toUserDto(user);
    },
    async updateUser(id: string, input: UpdateProfileInput){
       const updatedUser = await usersRepository.update(id, input)
       if(updatedUser) throw new NotFoundError("User is not updated")
       
       return toUserDto(updatedUser); 
    },
    async listUsers(query: any){
      const {skip, take} = toSkipTake(query)  
      const [users, total] = await usersRepository.getAllUsers(skip, take)
      return buildPaginationResult(users.map(toUserDto), total, query)
    }
}