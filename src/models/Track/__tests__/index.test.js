import test from 'ava'
import sinon from 'sinon'
import Track from '../index'
import trackModel from '../model'

test.serial('Track.fetchAll should return an array of all public tracks', async (t) => {
  const track = {
    attrs: {
      id: 'asdf9a023f-34fasf234-adids98g'
    }
  }

  const mockScan = {
    loadAll: () => ({
      where: () => ({
        equals: () => ({
          execAsync: () => ({ Items: [track], Count: 1 })
        })
      })
    })
  }
  const newTrack = new Track()

  sinon.stub(trackModel, 'scan').returns(mockScan)
  const existingTrack = await newTrack.fetchAll()

  t.truthy(existingTrack)
  t.deepEqual(existingTrack, [track.attrs])
  trackModel.scan.restore()
})

test.serial('Track.fetchByUserId should return an array of user\'s public tracks', async (t) => {
  const track = {
    attrs: {
      id: 'yoooo'
    }
  }
  const userId = '123'

  const mockScan = {
    where: () => ({
      equals: () => ({
        where: () => ({
          equals: () => ({
            execAsync: () => ({ Items: [track], Count: 1 })
          })
        })
      })
    })
  }


  const newTrack = new Track()

  sinon.stub(trackModel, 'scan').returns(mockScan)
  const existingTrack = await newTrack.fetchByUserId(userId)

  t.truthy(existingTrack)
  t.deepEqual(existingTrack, [track.attrs])
  trackModel.scan.restore()
})

test.serial('Track.fetchMyTracks should return an array of all the user\'s tracks', async (t) => {
  const track = {
    attrs: {
      id: 'yoooo'
    }
  }
  const userId = '123'

  const mockScan = {
    where: () => ({
      equals: () => ({
        execAsync: () => ({ Items: [track], Count: 1 })
      })
    })
  }


  const newTrack = new Track()

  sinon.stub(trackModel, 'scan').returns(mockScan)
  const existingTrack = await newTrack.fetchMyTracks(userId)

  t.truthy(existingTrack)
  t.deepEqual(existingTrack, [track.attrs])
  trackModel.scan.restore()
})

test.serial('Track.editTrack returns a single editted track', async (t) => {
  const track = {
    attrs: {
      id: 'adfasdf'
    }
  }
  const newTrack = new Track()

  sinon.stub(trackModel, 'updateAsync').returns(track)
  const existingTrack = await newTrack.editTrack({ userId: 'asdf' }, 'asfas', { artworkKey: 'asdfa' })
  t.truthy(existingTrack)
  t.deepEqual(existingTrack, track.attrs)
  trackModel.updateAsync.restore()
})

test.serial('Track.createTrack returns a single track', async (t) => {
  const track = {
    attrs: {
      id: 'adfasdf'
    }
  }
  const newTrack = new Track()

  sinon.stub(trackModel, 'createAsync').returns(track)
  const existingTrack = await newTrack.createTrack({ userId: 'asdf' }, 'asfas', false)
  t.truthy(existingTrack)
  t.deepEqual(existingTrack, track.attrs)
  trackModel.createAsync.restore()
})

test.serial('Track.deleteTrack returns a string for failure/success', async (t) => {
  const response = 'Deleted'
  const newTrack = new Track()

  sinon.stub(trackModel, 'destroyAsync').returns(response)
  const existingTrack = await newTrack.deleteTrack({ userId: 'asdf' }, 'asfas')
  t.truthy(existingTrack)
  t.deepEqual(existingTrack, response)
  trackModel.destroyAsync.restore()
})
