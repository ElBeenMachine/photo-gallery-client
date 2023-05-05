import { isAdminMiddleware } from "@/utils/checkUser";
import handler from "@/utils/handler";
import User from "@/models/User";
import dbConnect from "@/utils/dcConnect";

handler.use(isAdminMiddleware).get(async (req, res) => {
    const { _id } = req.query;
    dbConnect();

    const user = await User.findOne({ _id: _id }).select({ password: 0, createdAt: 0, __v: 0 });

    if(!user) return res.status(404).json({ message: "User Not Found" });

    res.status(200).json({ message: "OK", user });
});

export default handler;