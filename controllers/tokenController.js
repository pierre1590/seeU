import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = pkg;
import dotenv from "dotenv";

dotenv.config();


const appID = process.env.APP_ID;
const appCertificate = process.env.APP_CERTIFICATE;



const nocache = (_, resp,next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const  ping = (req, res) => {
    res.send("pong");
}



const generateRTCToken = (req, resp) => {
    resp.header('Access-Control-Allow-Origin', '*');
    
    const channelName = req.params.channel;
    if (!channelName) {
      return resp.status(400).json({ 'error': 'channel is required' });
    }
    
    let uid = req.params.uid;
    if (!uid || uid === '') {
      return resp.status(400).json({ 'error': 'uid is required' });
    }
    
    let role;
    if (req.params.role === 'publisher') {
      role = RtcRole.PUBLISHER;
    } else if (req.params.role === 'audience') {
      role = RtcRole.SUBSCRIBER
    } else {
      return resp.status(400).json({ 'error': 'role is incorrect' });
    }
    
    let expireTime = req.params.expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    
    let token;
    if (req.params.tokentype === 'userAccount') {
      token = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, uid, role, privilegeExpireTime);
    } else if (req.params.tokentype === 'uid') {
      token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpireTime);
    } else {
      return resp.status(400).json({ 'error': 'token type is invalid' });
    }
    
    return resp.json({ 'rtcToken': token });
  }
  
  const generateRTMToken = (req, resp) => {
    resp.header('Access-Control-Allow-Origin', '*');
    
    let uid = req.params.uid;
    if (!uid || uid === '') {
      return resp.status(400).json({ 'error': 'uid is required' });
    }
    
    let role = RtmRole.Rtm_User;
  
    let expireTime = req.params.expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    
    const token = RtmTokenBuilder.buildToken(appID, appCertificate, uid, role, privilegeExpireTime);
    
    return resp.json({ 'rtmToken': token });
  }
  
  const generateRTEToken = (req, resp) => {
    resp.header('Access-Control-Allow-Origin', '*');
    
    const channelName = req.params.channel;
    if (!channelName) {
      return resp.status(400).json({ 'error': 'channel is required' });
    }
    
    let uid = req.params.uid;
    if (!uid || uid === '') {
      return resp.status(400).json({ 'error': 'uid is required' });
    }
    
    let role;
    if (req.params.role === 'publisher') {
      role = RtcRole.PUBLISHER;
    } else if (req.params.role === 'audience') {
      role = RtcRole.SUBSCRIBER
    } else {
      return resp.status(400).json({ 'error': 'role is incorrect' });
    }
    
    let expireTime = req.params.expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    // build the token
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpireTime);
    const rtmToken = RtmTokenBuilder.buildToken(appID, appCertificate, uid, role, privilegeExpireTime);
    // return the token
    return resp.json({ 'rtcToken': rtcToken, 'rtmToken': rtmToken });
  }

export {nocache, ping, generateRTCToken, generateRTMToken, generateRTEToken};