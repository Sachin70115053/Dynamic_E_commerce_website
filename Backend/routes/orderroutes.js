const express=require("express");
const { isAuthenticateUser, authrizeRoles } = require("../middleware/auth");
const { newOrder, getSingleOrder, myorder, getAllOrders, updateOrder, deleteOrder } = require("../controller/orderController");

const router=express.Router();

router.route("/order/new").post(isAuthenticateUser,newOrder);
router.route("/order/:id").get(isAuthenticateUser,getSingleOrder);
router.route("/order/me/:id").get(isAuthenticateUser,myorder);
router.route("/admin/order").get(isAuthenticateUser,authrizeRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticateUser,authrizeRoles("admin"),updateOrder).delete(isAuthenticateUser,authrizeRoles("admin"),deleteOrder);



module.exports=router;