/**
 * Starts a local dynalite instance for development.
 */
import dynalite from 'dynalite' // eslint-disable-line import/no-extraneous-dependencies
import vogels from 'io/vogels'

import User from 'models/User/model'
import Partner from 'models/Partner/model'

import userData from './data/user'
import partnerData from './data/partner'

export const startDynalite = function startDynalite() {
  const dynaliteServer = dynalite({ path: './.jamout-db', createTableMs: 50 })
  return new Promise((resolve, reject) => {
    dynaliteServer.listen(4567, (err) => {
      if (err) {
        reject(err)
      }

      resolve()
    })
  })
}

export const createTables = function createTables() {
  return new Promise((resolve, reject) => {
    vogels.createTables((err) => {
      if (err) {
        reject(err)
      }

      vogels.dynamoDriver().listTables(null, (listErr, { TableNames }) => {
        if (listErr) {
          reject(listErr)
        }

        resolve(TableNames)
      })
    })
  })
}

export const loadTestData = async function loadTestData() {
  // Load the User test data.
  await Promise.all(userData.map(user => User.createAsync(user)))

  // Load the Partner test data.
  await Promise.all(partnerData.map(partner => Partner.createAsync(partner)))
}
