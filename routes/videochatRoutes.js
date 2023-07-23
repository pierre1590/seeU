// Generate the route for videochatController.js:
import express from "express";
import { nocache, ping, generateRTCToken, generateRTMToken, generateRTEToken  } from "../controllers/videoChatController.js";


const router = express.Router();

router.route("/ping").get(nocache, ping);

router.route("'/rtc/:channel/:role/:tokentype/:uid").get(nocache, generateRTCToken);

router.route("/rtm/:uid/").get(nocache, generateRTMToken);

router.route("/rte/:channel/:role/:tokentype/:uid").get(nocache, generateRTEToken);



export default router;