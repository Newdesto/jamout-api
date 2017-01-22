import test from 'ava'
import sinon from 'sinon'
import Track from '../index'

test('Track.fetchAll should return an array of all public tracks', async (t) => {
  const track = {
    attrs: {
      id: 'asdf9a023f-34fasf234-adids98g',
      createdAt: '2017-01-21T05:38:45.233Z',
      isPublic: true,
      playCount: 0,
      status: 'done',
      title: 'Savage Mode',
      type: 'original',
      user: { id: '123456789' },
      userId: '123456789',
      updatedAt: '2017-02-21T05:38:45.233Z',
      audioKey: 'aksjdfasnflajsf',
      artworkKey: 'asdfasfsa'
    }
  }

  const mockScan = {
    usingIndex: () => ({
      execAsync: () => ({ Items: [track], Count: 1 })
    })
  }

  sinon.stub(Track, 'scan').returns(mockScan)
  // t.is(response, 'response')
  Track.scan.restore()
})
