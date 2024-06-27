import { Request, Response } from "express";
import Provider from "../models/Provider";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import User, { IUser } from "../models/user";
import { google } from "googleapis";

interface ProvideReq extends Request {
  user?: IUser;
}
dotenv.config({ path: ".env.local" });

export const addProvider = async (req: ProvideReq, res: Response) => {
  if (!req.user) {
    return res.status(400).json({ error: "User not authenticated" });
  }
 console.log(req.user);

  try {
    const { provider, email, accessToken, refreshToken } = req.body;
    const existingProvider = await Provider.findOne({ provider, email });
  
    if (existingProvider)
      return res.status(400).json({ error: "Provider already exists" });
  
    const newProvider = new Provider({
      provider,
      email,
      accessToken,
      refreshToken,
    });
    const savedProvider = await newProvider.save();
    await User.updateOne(
      { username: req.user.id },
      { $push: { providers: savedProvider._id } }
    );
    res.json(savedProvider);
  } catch (error: string | any) {
    res.status(400).json({ error: error.message });
  }
};

export const checkAccessToken = async (req: Request, res: Response) => {
  const { accessToken } = req.body;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );

    if (
      response.data &&
      response.data.expires_in &&
      response.data.expires_in > 0
    ) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error: string | any) {
    // Google returns a 400 or 401 error if the token is invalid or expired
    res.json({ valid: false, error: error.response.data });
  }
};

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export const getAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const provider = await Provider.findOne({ refreshToken });

  if (!provider)
    return res.status(400).json({ error: "Invalid refresh token" });

  try {
    oAuth2Client.setCredentials({ refresh_token: provider.refreshToken });

    const tokenResponse = await oAuth2Client.getAccessToken();
    const newAccessToken = tokenResponse.token;

    if (!newAccessToken) {
      return res
        .status(400)
        .json({ error: "Failed to generate new access token" });
    }

    provider.accessToken = newAccessToken;
    await provider.save();

    res.json({ accessToken: newAccessToken });
  } catch (error: string | any) {
    res.status(500).json({ error: error.message });
  }
};

// export const oauth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );

// const defScopes = [
//   "https://www.googleapis.com/auth/userinfo.email",
//   " https://www.googleapis.com/auth/userinfo.profile",
//   "https://www.googleapis.com/auth/gmail.readonly",
// ];

// export const genAuthUrl = () => {};
