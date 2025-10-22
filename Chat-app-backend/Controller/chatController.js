const chatModel = require("../Model/chatModel");
const userModel = require("../Model/UserModel");

// create or access chat 1-1
const accessChat = async (req, res) => {
  const { userId } = req.body;
  const { user } = req;

  let isChat = await chatModel
    .find({
      isGroupChat: false,
      users: {
        $all: [user._id, userId],
        $size: 2,
      },
    })

    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  let chatData;
  // if chat exist then send it otherwise create newone
  if (isChat.length > 0) {
    return res
      .status(200)
      .json({ success: true, status: "success", chat: isChat[0] });
  } else {
    chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [user._id, userId],
    };
  }

  try {
    const createdChat = await chatModel.create(chatData);
    const fullchat = await chatModel
      .findOne({ _id: createdChat._id })
      .populate("users", "-password");

    return res
      .status(200)
      .json({ success: true, status: "success", chat: fullchat });
  } catch (error) {
    console.log({ api: "Access chat", error: error });
    return res.status(500).json({
      success: false,
      status: "failed",
      message: "Something  went wrong try again",
    });
  }
};

// const accessChat = async (req, res) => {
//   // 1. Destructure the target user ID from the request body.
//   const { userId } = req.body;
//   // Get the authenticated user object attached by the 'protect' middleware.
//   const { user } = req;

//   // Basic validation
//   if (!userId) {
//     return res.status(400).json({
//       success: false,
//       status: "failed",
//       message: "Target user ID not sent with request.",
//     });
//   }

//   try {
//     // 2. ✅ FIX: Robust Query to find an existing 1-on-1 chat.
//     // Use $all to check if both IDs are present, regardless of order, and $size: 2
//     // to ensure it's not a group chat. This prevents the E11000 error.
//     let isChat = await chatModel
//       .find({
//         isGroupChat: false,
//         users: { $all: [user._id, userId], $size: 2 },
//       })
//       // ✅ FIX: Populate the correct field 'users' (assuming your schema uses 'users')
//       .populate("users", "-password")
//       .populate("latestMessage");

//     // Populate the sender of the latest message
//     isChat = await userModel.populate(isChat, {
//       path: "latestMessage.sender",
//       select: "name pic email",
//     });

//     // 3. Handle Chat Existence
//     if (isChat.length > 0) {
//       // Chat found, return the first document
//       return res
//         .status(200)
//         .json({ success: true, status: "success", chat: isChat[0] });
//     }

//     // Chat not found, create a new one
//     else {
//       const chatData = {
//         chatName: "sender", // Placeholder name
//         isGroupChat: false,
//         // ✅ FIX: Pass the clean IDs directly to the array
//         users: [user._id, userId],
//       };

//       const createdChat = await chatModel.create(chatData);

//       // ✅ FIX: Use findOne() instead of find() for a single document lookup
//       const fullchat = await chatModel
//         .findOne({ _id: createdChat._id })
//         .populate("users", "-password");

//       // ✅ FIX: Return the single object (fullchat), not an array
//       return res
//         .status(200)
//         .json({ success: true, status: "success", chat: fullchat });
//     }
//   } catch (error) {
//     console.error({
//       api: "Access chat",
//       error: error.message,
//       stack: error.stack,
//     });
//     return res.status(500).json({
//       success: false,
//       status: "failed",
//       message: "Failed to access chat. Check server logs for details.",
//     });
//   }
// };

//  fetch all chats for user
const fetchAllchats = async (req, res) => {
  const userId = req.user._id;

  try {
    const chats = await chatModel
      .find({
        users: { $elemMatch: { $eq: userId } },
      })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin")
      .sort({ updatedAt: -1 });

    return res
      .status(200)
      .json({ success: true, status: "success", chats: chats });
  } catch (err) {
    console.log({ api: "fetch chats", error: err });

    return res.status(500).json({
      success: false,
      status: "success",
      error: "Something went wrong try again !",
    });
  }
};

// create a group chat
const createGroupChat = async (req, res) => {
  const { user } = req;

  if (!req.body.users)
    return res.status(400).json({
      status: "Error",
      code: "USERS_NOT_PROVIDED",
      message: "Users not provided",
    });
  // parse the users
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).json({
      status: "Error",
      code: "USER_ERROR",
      message: "Users should be more than two",
    });
  }
  users.push(req.user._id);
  try {
    const groupchat = await chatModel.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    if (!groupchat) throw new Error("Something went wrong");

    const fullGroupChat = await chatModel
      .findOne({ _id: groupchat._id })
      .popuate("users", "-password")
      .popuate("groupAdmin", "-password");

    res.status(200).json({ groupchat: fullGroupChat });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      status: true,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong try again !",
      },
    });
  }
};
// rename a chat
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  console.log("req came to", req.body);

  if (!chatName)
    return res.status(400).json({
      success: false,
      status: "Failed",
      message: "New group name is required",
    });
  try {
    const groupchat = await chatModel.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    );
    if (!groupchat) {
      return res
        .status(400)
        .json({ success: false, status: "Failed", message: "Chat Not found" });
    } else {
      return res.status(200).json(groupchat);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      status: "failed",
      message: "Something went wrong try again !",
    });
  }
};
// drop user
const dropUserFromGroup = async (req, res) => {
  const { chatId, dropUserId } = req.body;
  try {
    const groupchat = await chatModel
      .updateOne(
        { _id: chatId },
        { $pull: { user: dropUserId } },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!groupchat)
      return res
        .status(400)
        .json({ success: false, status: "Failed", message: "Chat not found" });
    return res.status(200).json(groupchat);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, status: "Failed", error: err.message });
  }
};
// add user
const addUserToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const groupChat = await chatModel
      .findByIdAndUpdate({ chatId }, { $push: { user: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (groupChat)
      return res
        .status(404)
        .json({ success: false, status: "Failed", message: "Chat not found" });
    return res.status(200).json(groupChat);
  } catch (err) {
    console.log(err, "add user group");
    return res.staus(200).json({
      success: false,
      status: "Failed",
      error: "Something went wrong try again !",
    });
  }
};

module.exports = {
  accessChat,
  fetchAllchats,
  createGroupChat,
  dropUserFromGroup,
  addUserToGroup,
  renameGroup,
};
