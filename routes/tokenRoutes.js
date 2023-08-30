// Generate the route for videochatController.js:
import express from "express";
import { nocache, ping, generateRTCToken, generateRTMToken, generateRTEToken  } from "../controllers/tokenController.js";


const router = express.Router();

router.route("/ping").get(nocache, ping);

router.route('/rtctoken/:channel/:uid/:role/:expiry/:tokentype').get(nocache, generateRTCToken);

router.route("/rtmtoken/:uid/:expiry").get(nocache, generateRTMToken);

router.route("/rtetoken/:channel/:uid/:role/:expiry").get(nocache, generateRTEToken);



export default router;