import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, profile } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { username, email, profile }, { new: true });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const toggleFollow = async (req, res) => {
  const { id } = req.params; // ID of the user to follow/unfollow
  const userId = req.user.id; // ID of the current user

  try {
    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      userToFollow.followers.pull(userId);
      currentUser.following.pull(id);
    } else {
      userToFollow.followers.push(userId);
      currentUser.following.push(id);
    }

    await userToFollow.save();
    await currentUser.save();

    res.status(200).json({ success: true, message: isFollowing ? 'User unfollowed successfully' : 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};