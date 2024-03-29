import languages from 'gql/utils/languages'
import genres from 'gql/utils/genres'

const newRelease = function newRelease(root, args, { viewer }) {
  return {
    languageOptions: languages.map(l => ({
      text: l.name,
      value: l.code.toUpperCase()
    })),
    genreOptions: genres.map(g => ({
      text: g,
      value: g
    }))
  }
}

export default newRelease
