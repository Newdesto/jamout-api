import 'request'
import request from 'request-promise'

export const getMe = function getMe(token) {
  return request({
    uri: `https://api.soundcloud.com/me?oauth_token=${token}`,
    json: true
  })
}

export const getTracks = function getTracks(token) {
  return request({
    uri: `https://api.soundcloud.com/me/tracks?client_id=c02b386eecb7c75cd5ee434d35709f72&oauth_token=${token}`,
    json: true
  })
}

export const getTrack = function getTrack(id, token) {
  console.log(`https://api.soundcloud.com/me/tracks/${id}?client_id=c02b386eecb7c75cd5ee434d35709f72&oauth_token=${token}`)
  return request({
    uri: `https://api.soundcloud.com/me/tracks/${id}?client_id=c02b386eecb7c75cd5ee434d35709f72&oauth_token=${token}`,
    json: true
  })
}

export const updateTrack = function updateTrack({ id, token, updates }) {
  return request({
    method: 'PUT',
    uri: `https://api.soundcloud.com/me/tracks/${id}?client_id=c02b386eecb7c75cd5ee434d35709f72&oauth_token=${token}`,
    json: true,
    body: {
      track: updates
    }
  })
}

export const getPlaylists = function getPlaylists(token) {
  return request({
    uri: `https://api.soundcloud.com/me/playlists?oauth_token=${token}`,
    json: true
  })
}

