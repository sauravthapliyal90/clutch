import { ConflictError } from "@shared/error/ApiError";
import { hostsRepository } from "./hosts.repository";
import { buildPaginationResult, type PaginationParams, toSkipTake } from '../../shared/pagination/pagination';

export const hostsService = {
    async approveHost(userId: string, adminId: string, contactInfo?: string){
        const existing =await hostsRepository.findByUserId(userId);
        if(existing) throw new ConflictError('this user is already a host');

        const [, hostProfile]  = await hostsRepository.createHostProfile(userId, adminId, contactInfo);
        return hostProfile;
    },


    async listHosts(query: PaginationParams){
      const {skip, take} = toSkipTake(query);
      const [host, total] = await hostsRepository.listAll(skip, take);
      return buildPaginationResult(host, total, query);
    }

}