import UserSchema from "./UserSchema.js";

export const createNewUser = (userObj) => {
  return UserSchema(userObj).save();
};

export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};

export const updateUser = async (email, { fName, lName, location }) => {
  const updateData = {}; // Initialize an empty object to hold the update data

  // Add fields to the updateData object only if they are present in the request
  if (fName) updateData.fName = fName;
  if (lName) updateData.lName = lName;
  if (location) updateData.location = location;
  if (email) updateData.email = email;

  try {
    // Find the user by email and update with the provided data
    const updatedUser = await UserSchema.findOneAndUpdate(
      { email: email }, // Filter by email
      updateData, // Update data
      { new: true } // Return the updated document
    );

    return updatedUser; // Return the updated user document
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error("Error updating user:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
