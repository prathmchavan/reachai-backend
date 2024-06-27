import express, { Router ,Request ,Response } from "express"
import authRoutes from "./authRoutes";
import providerRoutes from "./providerRoutes";

const router = Router();

router.get("/",(req: Request , res : Response)=>{
    res.send("Live")
})

router.use('/auth', authRoutes);
router.use('/provider', providerRoutes);

export default router;