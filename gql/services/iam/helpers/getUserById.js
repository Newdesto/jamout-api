const getUserById = User => async function getUserById(id) {
  const Item = await User.getAsync(id)
  
  if (!Item) {
    throw new Error("User doesn't exist.")
  }

  return Item.attrs
}

export default getUserById
