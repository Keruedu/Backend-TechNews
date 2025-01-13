import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Category from "../models/categoryModel.js";

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

export const getStatistics = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        // Thực hiện từng query riêng biệt để dễ debug
        try {
            const totalUsers = await User.countDocuments();
            console.log('Total users:', totalUsers);  // Debug log

            const totalPosts = await Post.countDocuments();
            console.log('Total posts:', totalPosts);  // Debug log

            const totalCategories = await Category.countDocuments();
            console.log('Total categories:', totalCategories);  // Debug log

            const adminCount = await User.countDocuments({ role: 'ADMIN' });
            const managerCount = await User.countDocuments({ role: 'MANAGER' });
            const userCount = await User.countDocuments({ role: 'USER' });
            const bannedCount = await User.countDocuments({ isBanned: true });

            const approvedCount = await Post.countDocuments({ status: 'APPROVED' });
            const pendingCount = await Post.countDocuments({ status: 'PENDING' });
            const rejectedCount = await Post.countDocuments({ status: 'REJECTED' });

            const stats = {
                totalUsers,
                totalPosts,
                totalCategories,
                userStats: {
                    admin: adminCount,
                    manager: managerCount,
                    user: userCount,
                    banned: bannedCount
                },
                postStats: {
                    approved: approvedCount,
                    pending: pendingCount,
                    rejected: rejectedCount
                }
            };

            console.log('Stats compiled successfully:', stats);  // Debug log

            return res.json({
                success: true,
                data: stats
            });

        } catch (dbError) {
            console.error('Database Error:', dbError);  // Debug log
            throw new Error(`Database operation failed: ${dbError.message}`);
        }

    } catch (error) {
        console.error('Error in getStatistics:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

export const getRegistrationStats = async (req, res) => {
  try {
    const { range } = req.query;
    let startDate;
    const now = new Date();

    switch (range) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const registrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        registrations
      }
    });
  } catch (error) {
    console.error('Error in getRegistrationStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registration statistics'
    });
  }
};