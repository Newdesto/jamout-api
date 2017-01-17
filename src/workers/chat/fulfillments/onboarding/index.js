import welcome from './welcome'
import ready from './ready'
import profileSetup from './profileSetup'
import manualOrSoundCloud from './manualOrSoundCloud'
import connectSoundCloud from './connectSoundCloud'
import onboardingManualActionsFunctions from './manual'

const onboardingActionFunctions = {
  'onboarding.welcome': welcome,
  'onboarding.welcomeAndReady': ready,
  'onboarding.profileSetup': profileSetup,
  'onboarding.profileSetup.manualOrSoundCloud': manualOrSoundCloud,
  'onboarding.profileSetup.soundcloud.connect': connectSoundCloud,
  ...onboardingManualActionsFunctions
}


export default onboardingActionFunctions
