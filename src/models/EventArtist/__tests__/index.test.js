import test from 'ava'
import sinon from 'sinon'
import EventArtist from '../index'
import eventArtistModel from '../model'

test.serial('EventArtist.createEventArtist should return a new EventArtist', async (t) => {
  const eventArtist = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  sinon.stub(eventArtistModel, 'createAsync').returns(eventArtist)
  const existingEventArtist = await EventArtist.createEventArtist({ id: 'asdfas', username: 'adfas' }, {})

  t.truthy(existingEventArtist)
  t.deepEqual(existingEventArtist, eventArtist.attrs)
  eventArtistModel.createAsync.restore()
})

test.serial('EventArtist.fetchByEventId should return an array of EventArtists', async (t) => {
  const eventArtist = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const mockScan = {
    where: () => ({
      equals: () => ({
        execAsync: () => ({ Items: [eventArtist], Count: 1 })
      })
    })
  }

  sinon.stub(eventArtistModel, 'scan').returns(mockScan)
  const existingEventArtist = await EventArtist.fetchByEventId({ id: 'asdfas', username: 'adfas' }, { eventId: 'asfs' })

  t.truthy(existingEventArtist)
  t.deepEqual(existingEventArtist, [eventArtist.attrs])
  eventArtistModel.scan.restore()
})

test.serial('EventArtist.fetchByPartnerId should return an array of EventArtists', async (t) => {
  const eventArtist = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const mockScan = {
    where: () => ({
      equals: () => ({
        execAsync: () => ({ Items: [eventArtist], Count: 1 })
      })
    })
  }

  sinon.stub(eventArtistModel, 'scan').returns(mockScan)
  const existingEventArtist = await EventArtist.fetchByPartnerId({ id: 'asdfas' })

  t.truthy(existingEventArtist)
  t.deepEqual(existingEventArtist, [eventArtist.attrs])
  eventArtistModel.scan.restore()
})


test.serial('EventArtist.fetchByUserId should return an array of EventArtists', async (t) => {
  const eventArtist = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const mockScan = {
    where: () => ({
      equals: () => ({
        execAsync: () => ({ Items: [eventArtist], Count: 1 })
      })
    })
  }

  sinon.stub(eventArtistModel, 'scan').returns(mockScan)
  const existingEventArtist = await EventArtist.fetchByUserId({ id: 'asdfas' })

  t.truthy(existingEventArtist)
  t.deepEqual(existingEventArtist, [eventArtist.attrs])
  eventArtistModel.scan.restore()
})

test.serial('EventArtist.updateEventArtistId should return an updated EventArtist', async (t) => {
  const eventArtist = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  sinon.stub(eventArtistModel, 'updateAsync').returns(eventArtist)
  const existingEventArtist = await EventArtist.updateEventArtist({ id: 'asdfas' }, {}, {})

  t.truthy(existingEventArtist)
  t.deepEqual(existingEventArtist, eventArtist.attrs)
  eventArtistModel.updateAsync.restore()
})
