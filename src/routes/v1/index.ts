import { Router } from "express";
import authRoutes from "./authRoutes";
import auth from "../v1/admin/auth"
import adminRoutes from "./admin/adminRoutes";
import roleAuthorization from "../../middleware/roleAuthorization";
import userRoutes from "./userRoutes";
import routes from "./routes";
import { getMessages, saveMessage } from "../../controllers/chatController";
import { endCall, startCall } from "../../controllers/callController";
const router = Router();

router.use("/auth/", authRoutes)
router.use("/user", roleAuthorization(["user"]), userRoutes);


// common api
router.use("/app", roleAuthorization(["user"]), routes)

// admin routes
router.use("/admin/auth/", auth)
router.use("/admin", roleAuthorization(["admin"]), adminRoutes);



// calling 
router.post('/messages', saveMessage);
router.get('/messages/:roomId', getMessages);
router.post('/start', startCall);
router.post('/end', endCall);

export default router;