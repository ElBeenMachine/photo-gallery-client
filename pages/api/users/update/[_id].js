import { isAdminMiddleware } from "@/utils/checkUser";
import handler from "@/utils/handler";
import User from "@/models/User";
import dbConnect from "@/utils/dcConnect";

handler.use(isAdminMiddleware).post(async (req, res) => {
    const { _id } = req.query;
    dbConnect();

    const user = await User.findOne({ _id }).select();
    if(!user) return res.status(404).json({ message: "User Not Found" });
    if(user.email == "ollie@beenhamow.co.uk") return res.status(401).json({ message: "You are not allowed to make changes to this user." });

    await User.findOneAndUpdate({ _id }, { email: req.body.email, fname: req.body.fname, lname: req.body.lname, username: req.body.username, role: req.body.role });


    res.status(200).json({ message: "User Updated Successfully" });
});

export default handler;