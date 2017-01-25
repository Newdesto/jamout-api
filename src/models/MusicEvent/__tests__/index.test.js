import test from 'ava'
import sinon from 'sinon'
import MusicEvent from '../index'
import musicEventModel from '../model'

test.serial('MusicEvent.createEventArtist should return a new MusicEvent', async (t) => {
  const musicEvent = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const newMusicEvent = new MusicEvent()

  sinon.stub(musicEventModel, 'createAsync').returns(musicEvent)
  const existingMusicEvent = await newMusicEvent.createMusicEvent({ id: 'asdfas', username: 'adfas' }, {})

  t.truthy(existingMusicEvent)
  t.deepEqual(existingMusicEvent, musicEvent.attrs)
  musicEventModel.createAsync.restore()
})

test.serial('MusicEvent.fetchAll should return an array of music events', async (t) => {
  const musicEvent = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const mockScan = {
    loadAll: () => ({
      execAsync: () => ({ Items: [musicEvent], Count: 1 })
    })
  }
  const newMusicEvent = new MusicEvent()

  sinon.stub(musicEventModel, 'scan').returns(mockScan)
  const existingMusicEvent = await newMusicEvent.fetchAll()

  t.truthy(existingMusicEvent)
  t.deepEqual(existingMusicEvent, [musicEvent.attrs])
  musicEventModel.scan.restore()
})

test.serial('MusicEvent.fetchByPartnerId should return an array of music events', async (t) => {
  const musicEvent = { attrs: { id: 'asdf9a023f-34fasf234-adids98g' } }

  const mockScan = {
    where: () => ({
      equals: () => ({
        execAsync: () => ({ Items: [musicEvent], Count: 1 })
      })
    })
  }
  const newMusicEvent = new MusicEvent()

  sinon.stub(musicEventModel, 'scan').returns(mockScan)
  const existingMusicEvent = await newMusicEvent.fetchByPartnerId('asdfasdf')

  t.truthy(existingMusicEvent)
  t.deepEqual(existingMusicEvent, [musicEvent.attrs])
  musicEventModel.scan.restore()
})

test.serial('Sort music Events sorts the events(newest to oldest)', (t) => {
  const items = [{ attrs: { createdAt: '2017-01-18T22:13:07.406Z' } }, { attrs: { createdAt: '2017-02-18T22:13:07.406Z' } }]
  const sortedItems = [{ createdAt: '2017-02-18T22:13:07.406Z' }, { createdAt: '2017-01-18T22:13:07.406Z' }]
  const newMusicEvent = new MusicEvent()
  const newSortedItems = newMusicEvent.sortMusicEvents(items)
  t.truthy(sortedItems)
  t.deepEqual(newSortedItems, sortedItems)
})
