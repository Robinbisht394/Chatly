export const sender = (loggedUser, users) => {
  // console.log(loggedUser, users);

  return users[0]._id == loggedUser._id ? users[1].name : users[0].name;
};
export const fullSenderUserName = (loggedUser, users) => {
  return users[0]._id == loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id != m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    m.sender._id != userId
  );
};

// export const SameSenderMargin = (messages, m, i, userId) => {
//   if (
//     i < messages.lenght - 1 &&
//     (messages[i + 1].sender._id != m.sender._id || m.sender._id != userId)
//   ) {
//     return 33;
//   }else if()
// };
