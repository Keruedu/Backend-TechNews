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

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || '';
    const skip = (page - 1) * limit;

    // Tạo query tìm kiếm với điều kiện chặt chẽ hơn
    const searchQuery = search ? {
      $or: [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { 'profile.name': new RegExp(search, 'i') }
      ]
    } : {};

    // Log để debug
    console.log('Search term:', search);
    console.log('Search query:', searchQuery);

    const users = await User.find(searchQuery)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(searchQuery);

    // Log kết quả để debug
    console.log('Total results:', total);
    console.log('Results for current page:', users.length);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({ 
      success: true, 
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: error.message
    });
  }
};

export const toggleBanUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy người dùng' 
      });
    }

    user.isBanned = !user.isBanned;
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({ 
      success: true, 
      data: user,
      message: user.isBanned ? 'Đã cấm người dùng' : 'Đã bỏ cấm người dùng'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
};