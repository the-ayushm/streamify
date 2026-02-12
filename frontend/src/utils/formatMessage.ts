export const formatMessage = (
    msg: any,
    loggedInUserId: string | undefined,
    selectedUser: any
) => {
    return {
      _id: msg._id,
      content: msg.text,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isSent: msg.senderId === loggedInUserId, 
      senderName: msg.senderId === loggedInUserId
        ? 'You'
        : selectedUser?.fullName,
      senderAvatar: msg.senderId === loggedInUserId
        ? 'Y'
        : selectedUser?.fullName?.charAt(0),
    }
}