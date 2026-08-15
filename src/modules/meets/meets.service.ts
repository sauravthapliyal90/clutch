import { hostsRepository } from "../hosts/hosts.repository";
import { ForbiddenError, NotFoundError } from "../../shared/error/ApiError";
import { CreatemeetInput } from "./meets.type.js";
import { meetsRepository} from "./meets.repository"
import { toMeetDetailDto } from "./meets.dto";
import { buildPaginationResult, toSkipTake } from "@shared/pagination/pagination";

 export const meetsService = {
     async createMeet(userId: string, input: CreatemeetInput) {
         const hostProfile = await hostsRepository.findByUserId(userId);
         if (!hostProfile) throw new ForbiddenError("Host profile required");
         
         return meetsRepository.create(hostProfile.id, input);
        },

        async updateMeet(meetId: string, input: Partial<CreatemeetInput>){
            return meetsRepository.update(meetId, input);
        },

        async cancelMeet(meetId: string){
            return meetsRepository.softCancel(meetId);
        },

        async getMeetDetail(meetId: string){
            const meet = await meetsRepository.findById(meetId);
            if(!meet) throw new NotFoundError('Meet not found');
            return toMeetDetailDto(meet);
        },

        async listMeets(query: { page: number; limit: number; status?: string}){
            const { skip, take } = toSkipTake(query);
            const [meets, total] = await meetsRepository.listPublic(skip, take, query.status);
            return buildPaginationResult(meets.map(toMeetDetailDto), total, query)
        },
         
        async listParticipants(meetId: string){
            return meetsRepository.listParticipants(meetId);
        }
}