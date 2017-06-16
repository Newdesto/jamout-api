import Release from '../models/Release'

const getReleaseByContentId = async function getReleaseByContentId({ userId, contentId }) {
    const { attrs: release } = await Release.getAsync({ userId, contentId })
    
    return release
}

export default getReleaseByContentId