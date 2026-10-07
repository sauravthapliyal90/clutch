import { hostsRepository } from "../hosts/hosts.repository";
import { ForbiddenError, NotFoundError } from "../../shared/error/ApiError";
import { CreatemeetInput } from "./meets.type.js";
import { meetsRepository } from "./meets.repository"
import { toMeetDetailDto } from "./meets.dto";
import { buildPaginationResult, toSkipTake } from "@shared/pagination/pagination";
import { uploadsProvider } from "@modules/uploads/uploads.provider";

export const meetsService = {

    async createMeet(userId: string, input: CreatemeetInput) {
        const hostProfile = await hostsRepository.findByUserId(userId);
        if (!hostProfile) throw new ForbiddenError("Host profile required");



        return meetsRepository.create(hostProfile.id, input);
    },

    async updateMeet(meetId: string, input: Partial<CreatemeetInput>) {
        return meetsRepository.update(meetId, input);
    },

    async cancelMeet(meetId: string) {
        
        return meetsRepository.softCancel(meetId);
    },

    async getMeetDetail(meetId: string) {
        const meet = await meetsRepository.findById(meetId);
        if (!meet) throw new NotFoundError('Meet not found');
        console.log("meet in service----->", meet);
        let bannerImageUrl = null
        if (meet.bannerImageKey) {

            bannerImageUrl = await uploadsProvider.generatePresignedGetUrl(meet.bannerImageKey)
        }
        return {
            ...meet,
            bannerImageUrl
        }
        // return toMeetDetailDto(meet);
    },

    async listMeets(query: { page: number; limit: number; status?: string }) {
        const { skip, take } = toSkipTake(query);
        const [meets, total] = await meetsRepository.listPublic(skip, take, query.status);
      console.log("meets in service---------->", meets);
        const meetsWithImage = await Promise.all(
            meets.map(async (meet) => {
                let bannerImageUrl = null
                if (meet.bannerImageKey) {

                    bannerImageUrl = await uploadsProvider.generatePresignedGetUrl(meet.bannerImageKey)
                }
                return {
                    ...meet,
                    bannerImageUrl

                }
            })
        )


        return buildPaginationResult(meetsWithImage.map(toMeetDetailDto), total, query)
    },

    async listParticipants(meetId: string) {
        return meetsRepository.listParticipants(meetId);
    },

    async listHostMeets(hostId: string) {
        const hostRecords = await meetsRepository.listHostMeets(hostId);
        const meets = hostRecords.flatMap((record) => record.meets);
        const meetsWithImage = await Promise.all(
            meets.map(async(meet) => {
                let bannerImageUrl = null
                if (meet.bannerImageKey) {
                    bannerImageUrl = await uploadsProvider.generatePresignedGetUrl(meet.bannerImageKey)
                }
                return {
                    ...meet,
                    bannerImageUrl
                }
            })
        )

        return meetsWithImage;
    }

    // async fetchMeetDetials(meetId: string){
    //    const meetDetails = await meetsRepository.findMeetDetialById(meetId);

    //     if(!meetDetails) throw new  
    // }
}