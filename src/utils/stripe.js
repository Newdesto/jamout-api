import Stripe from 'stripe'
const stripe = Stripe(process.env.STRIPE_SECRET)

export const distroSkus = {
  's': 'distro_single',
  'e': 'distro_ep',
  'a': 'distro_album'
}

export function createCustomer(args) {
  return new Promise((resolve, reject) => {
    // creates a stripe customer
    stripe.customers.create(args, (err, customer) => {
      if (err)
        reject(err)
      resolve(customer)
    })
  })
}

export function createOrder(args) {
  return new Promise((resolve, reject) => {
    stripe.orders.create(args, (error, order) => {
      if(error)
        return reject(error)
      return resolve(order)
    })
  })
}

export function payOrder(id, args) {
  return new Promise((resolve, reject) => {
    stripe.orders.pay(id, args, (error, order) => {
      if(error)
        return reject(error)
      return resolve(order)
    })
  })
}

export function setCard(customerId, stripeToken) {
  return new Promise((resolve, reject) => {
    stripe.customers.update(customerId, { card: stripeToken }, (error, customer) => {
      if(error)
        return reject(error)
      return resolve(customer.cards ? customer.cards.data[0] : customer.sources.data[0])
    })
  })
}

export function createSubscription(customerId, plan) {
  return new Promise((resolve, reject) => {
    stripe.customers.createSubscription(
      customerId,
      { plan },
      (error, subscription) => {
        if(error)
          return reject(error)
        return resolve(subscription)
      }
    )
  })
}

export function updateSubscription(customerId, subscriptionId, plan) {
    return new Promise((resolve, reject) => {
      stripe.customers.updateSubscription(
        customerId,
        subscriptionId,
        { plan },
        (error, subscription) => {
          if(error)
            return reject(error)
          return resolve(subscription)
        }
      )
    })
}

export default stripe
