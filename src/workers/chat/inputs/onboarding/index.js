import welcomeButton from './welcomeButton'
import readyButton from './readyButton'
import gotItButton from './gotItButton'
import manualOrSoundCloudButtons from './manualOrSoundCloudButtons'
import manualProfileSetup from './manual'

const importHandlers = {
  'onboarding.WelcomeButton': welcomeButton,
  'onboarding.ReadyButton': readyButton,
  'onboarding.GotItButton': gotItButton,
  'onboarding.ManualOrSoundCloudButtons': manualOrSoundCloudButtons,
  ...manualProfileSetup
}

export default importHandlers
