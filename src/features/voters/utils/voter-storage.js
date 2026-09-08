const VOTER_ID_KEY = 'voter_id'
const VOTER_NAME_KEY = 'voter_name'

export const voterStorage = {
  getId: () => localStorage.getItem(VOTER_ID_KEY),
  getName: () => localStorage.getItem(VOTER_NAME_KEY),
  save: ({ id, name }) => {
    localStorage.setItem(VOTER_ID_KEY, id)
    localStorage.setItem(VOTER_NAME_KEY, name)
  },
  clear: () => {
    localStorage.removeItem(VOTER_ID_KEY)
    localStorage.removeItem(VOTER_NAME_KEY)
  },
}
