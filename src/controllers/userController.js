import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    // Tạo query tìm kiếm
    const searchQuery = {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.name': { $regex: search, $options: 'i' } }
      ]
    };

    // Đếm tổng số items
    const totalItems = await User.countDocuments(searchQuery);
    
    // Tính toán skip và lấy data
    const skip = (page - 1) * limit;
    const users = await User.find(searchQuery)
      .sort({ username: 1 })
      .skip(skip)
      .limit(limit)
      .select('-password'); // Không trả về password

    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit
      }
    });

  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error loading accounts' 
    });
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

export const toggleBanUser = async (req, res) => {
  try {
    console.log('Received toggle-ban request for user:', req.params.id); // Debug log

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Kiểm tra không cho phép ban ADMIN
    if (user.role === 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot ban admin users' 
      });
    }

    // Toggle trạng thái và lưu vào database
    user.isBanned = !user.isBanned;
    user.updatedAt = Date.now();
    await user.save();

    console.log('User ban status updated:', user.isBanned); // Debug log
    res.status(200).json({ 
      success: true, 
      message: user.isBanned ? 'User has been banned' : 'User has been unbanned',
      isBanned: user.isBanned 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const toggleRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Không cho phép thay đổi role của ADMIN
    if (user.role === 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot change role of an admin' 
      });
    }

    // Chỉ toggle giữa USER và MANAGER
    const newRole = user.role === 'USER' ? 'MANAGER' : 'USER';
    await User.findByIdAndUpdate(user._id, { role: newRole });

    res.json({ 
      success: true, 
      message: `User has been ${newRole === 'MANAGER' ? 'promoted to Manager' : 'demoted to User'}`,
      user: { ...user._doc, role: newRole }
    });
  } catch (error) {
    console.error('Error in toggleRole:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating role' 
    });
  }
};