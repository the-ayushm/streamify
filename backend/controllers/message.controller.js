import Message from "../models/message.model.js";


export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required!" });
        }

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 });
        return res.status(200).json(messages);
    } catch (error) {
        console.error("getMessages error: ", error);
        res.status(500).json({ message: "Failed to fetch messages!" });
    }
}