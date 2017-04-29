import { charge } from 'utils/stripe'

export default {
  async reservePremium(root, { input: { id, email } }, { currentUser, User }) {
        // Immediately charge and return
    const charged = await charge({
      amount: 1999,
      currency: 'usd',
      description: 'Jamout Premium Membership',
      source: id,
      receipt_email: email,
      statement_descriptor: 'Jamout Premium',
      metadata: {
        userId: currentUser.id
      }
    })

    await User.update(currentUser.id, { didReservePremium: true })

    return charged
  }
}
