import Conversation from './../models/conversation.model.js'

export const getConversation = async (req, res) => {
    try {
        const loggedinUserId = req.user._id;
        const {userId: clickedUserId} = req.params;
        const existingConversation = await Conversation.findOne({
            participants: { $all: [loggedinUserId, clickedUserId] }
        })
        if(existingConversation){
          return res.status(200).json({
                conversationId: existingConversation._id
            })
        }

        const newConversation = await Conversation.create({
            participants: [loggedinUserId, clickedUserId]
        })
        
        return res.status(200).json({
            conversationId: newConversation._id
        })

    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch conversation!' })
    }
}