import User from 'models/User/model'

const onboardingWelcomeClicked = async function onboardingWelcomeClicked(message) {
    // channelId === viewerId
    await User.updateAsync({ id: message.channelId, didBotWelcome: true })
}

const onboardingTeamJamoutConnected = async function onboardingTeamJamoutConnected(message) {
    // channelId === viewerId
    await User.updateAsync({ id: message.channelId, didBotExplainTeamJamout: true })
}

const onboardingJamoutCommunityConnected = async function onboardingJamoutCommunityConnected(message) {
    // channelId === viewerId
    await User.updateAsync({ id: message.channelId, didBotExplainJamoutCommunity: true }) 
}

const actionHandlers = {
    '@@jamout/onboarding/welcome/READY_CLICKED': onboardingWelcomeClicked,
    '@@jamout/onboarding/TeamJamoutConnection/CONNECT_CLICK': onboardingTeamJamoutConnected,
    '@@jamout/onboarding/JamoutCommunityConnection/CONNECT_CLICK': onboardingJamoutCommunityConnected
}

export default actionHandlers