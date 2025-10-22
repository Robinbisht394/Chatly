// Returns the name of the other user in a 1-on-1 chat
export const sender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// Returns the full user object of the other user in a 1-on-1 chat
export const fullSenderUserName = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

// Checks if the next message is from a different sender AND the current message is NOT from the logged user.
export const isSameSender = (messages, m, i, userId) => {
  return (
    // Check if it's NOT the last message
    i < messages.length - 1 &&
    // Check if the next message is from a different sender
    messages[i + 1].sender._id !== m.sender._id &&
    // Check if the current message is NOT from the logged user (Only show avatar for receiver)
    m.sender._id !== userId
  );
};

// Checks if the current message is the last message sent by that specific user in a row.
export const isLastMessage = (messages, i, userId) => {
  // Check if it's the very last message in the chat
  if (i === messages.length - 1) return true;

  // Check if the next message is from a different user
  if (messages[i + 1].sender._id !== messages[i].sender._id) return true;

  // If the current message is the second-to-last message, and the last one is from a different user
  // This is used for padding/styling in the ScrollabelFeed
  return false;
};

// Determines the left margin for the message bubble to align it correctly
// when the sender's avatar is NOT displayed.
export const SameSenderMargin = (messages, m, i, userId) => {
  // 1. If it's the receiver's message and the avatar should NOT be shown (i.e., same sender as next message)
  //    — This ensures the bubble is indented to account for the missing avatar space.
  if (
    messages[i + 1] && // Check if next message exists
    messages[i + 1].sender._id === m.sender._id && // Next message is from the same sender
    m.sender._id !== userId // And the current message is from the receiver
  ) {
    return 38; // Space for the avatar + margin (e.g., 32px + 6px margin)
  }

  // 2. If it's the receiver's last message in a sequence (avatar shown) or my message (avatar never shown on left)
  return 0;
};
