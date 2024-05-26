import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;
    try {

        //check if the text belongs to the user or not
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId],
                },
            },
        });

        if(!chat) return res.status(404).json({message: "chat not found"});

        //CREATE MESSAGE
        const messgae = await prisma.message.create({
            data: {
                text: text,
                chatId: chatId,
                userId: tokenUserId,
            },
        });

        //UPDATE THE SEENBY ARRAY (only userid)
        await prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
                seenBy: [tokenUserId], //did not use push here because it need to remove other user's id
                lastMessage: text,
            },
        });

        res.status(200).json(messgae);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to add message"})
    }
}
