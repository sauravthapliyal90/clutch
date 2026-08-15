// Hides host contact details from the public listing view, but includes
// them on the detail view - matches the spec's "Users should be able to
// view Host details" on the detail page specifically.
export function toMeetListDto(meet: any) {
  return {
    id: meet.id,
    title: meet.title,
    bannerImageUrl: meet.bannerImageUrl,
    location: meet.location,
    date: meet.date,
    status: meet.status,
    participantCount: meet._count?.registrations ?? 0,
    maxParticipants: meet.maxParticipants,
  };
}

export function toMeetDetailDto(meet: any) {
  return {
    id: meet.id,
    title: meet.title,
    description: meet.description,
    bannerImageUrl: meet.bannerImageUrl,
    galleryImageUrls: meet.galleryImageUrls,
    location: meet.location,
    latitude: meet.latitude,
    longitude: meet.longitude,
    date: meet.date,
    registrationDeadline: meet.registrationDeadline,
    maxParticipants: meet.maxParticipants,
    requiresVerifiedCar: meet.requiresVerifiedCar,
    status: meet.status,
    participantCount: meet._count?.registrations ?? 0,
    host: {
      name: meet.host?.user?.name,
      contact: meet.host?.contactInfo,
    },
  };
}
