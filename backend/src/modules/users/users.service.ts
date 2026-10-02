import { NotFoundError } from "@shared/error/ApiError"
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
      console.log("skip and take of admin log --------->>>>>>",skip, take);  
      const [users, total] = await usersRepository.getAllUsers(skip, take)
      
      console.log("total and user admin log --------->>>>>>",total, users);
      return buildPaginationResult(users.map(toUserDto), total, query)
    }
}