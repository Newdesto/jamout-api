import test from 'ava'
import sinon from 'sinon'
import Release from '../index'
import releaseModel from '../model'

test.serial('Release.fetchAll should return an array of releases with a status, type and tracklist', async (t) => {
  const release = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const mockScan = {
    where: () => ({
      notNull: () => ({
        where: () => ({
          notNull: () => ({
            where: () => ({
              notNull: () => ({
                execAsync: () => ({ Items: [release], Count: 1 })
              })
            })
          })
        })
      })
    })
  }

  const newRelease = new Release()

  sinon.stub(releaseModel, 'scan').returns(mockScan)
  const existingRelease = await newRelease.fetchAll()

  t.truthy(existingRelease)
  t.deepEqual(existingRelease, [release.attrs])
  releaseModel.scan.restore()
})

test.serial('Release.fetchByUserId should return an array of all a user\'s releases', async (t) => {
  const release = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const mockScan = {
    where: () => ({
      equals: () => ({
        execAsync: () => ({ Items: [release], Count: 1 })
      })

    })
  }

  const newRelease = new Release()

  sinon.stub(releaseModel, 'scan').returns(mockScan)
  const existingRelease = await newRelease.fetchByUserId('foo')

  t.truthy(existingRelease)
  t.deepEqual(existingRelease, [release.attrs])
  releaseModel.scan.restore()
})

test.serial('Release.fetchById should return a single release', async (t) => {
  const release = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const newRelease = new Release()

  sinon.stub(releaseModel, 'getAsync').returns(release)
  const existingRelease = await newRelease.fetchById('foo')

  t.truthy(existingRelease)
  t.deepEqual(existingRelease, release.attrs)
  releaseModel.getAsync.restore()
})

test.serial('Release.create should return a single release', async (t) => {
  const release = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const newRelease = new Release()

  sinon.stub(releaseModel, 'createAsync').returns(release)
  const existingRelease = await newRelease.create()

  t.truthy(existingRelease)
  t.deepEqual(existingRelease, release.attrs)
  releaseModel.createAsync.restore()
})
