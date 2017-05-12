import MessageModel from './model'

export const createMessage = async function createMessage(message) {
    const { attrs } =  await MessageModel.createAsync(message)
    return attrs
}