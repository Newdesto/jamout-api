const MusicEvent = `
type MusicEvent {
    id: ID!,
    createdAt: String,
    partner: String,
    partnerId: ID!,
    startDate: String,
    endDate: String,
    eventName: String,
    location: String,
    description: String
  }

`
export default () => [
  MusicEvent
]
