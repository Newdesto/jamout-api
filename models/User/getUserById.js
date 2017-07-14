const getUserById = async function getUserById(id) {
  const Item = await this.getAsync(id)
  
  if (!Item) {
    throw new Error("User doesn't exist.")
  }

  return Item.attrs
}

export default getUserById
