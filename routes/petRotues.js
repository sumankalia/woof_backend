const express = require("express");
const petController = require("../controllers/petsController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/images")) {
      fs.mkdirSync("public/images");
    }

    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".png" && ext !== ".jpeg" && ext !== ".jpg") {
      return cb(new Error("Only videos are allowed!"));
    }

    cb(null, true);
  },
});

const router = express.Router();

//get all pets
router.get("/all", petController.getAll);

router.get("/get/:id", petController.getOne);

router.get("/category/:categoryId", petController.getByCategory);

//post create pet
router.post(
  "/create",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "additionalImages",
      maxCount: 5,
    },
  ]),
  petController.create
);

//post create pet
router.put(
  "/update/:id",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "additionalImages",
      maxCount: 5,
    },
  ]),
  petController.update
);

router.delete("/delete/:id", petController.delete);

module.exports = router;
