const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userModel = require("./Models/user.model");
const routeModel = require("./Models/route.model");
const linkModel = require("./Models/link.model");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
mongoose.connect(
  `mongodb+srv://santhoshs19032003:${process.env.MONGODB_PASSWORD}@bundle-link.bextvcw.mongodb.net/?retryWrites=true&w=majority`
);
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`listening on http://localhost:${port}`));

app.get("/", (req, res) => {
  return res.status(200).send("Welcome Home");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const data = await userModel.create({
      name,
      email,
      password,
      mobile,
    });
    await data.save();
    return await res.status(200).send(data);
  } catch (error) {
    res.status(501).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userModel.find({ email: email, password: password });
    if (data.length !== 0) {
      return await res.status(200).send({ email, id: data[0]._id });
    } else {
      return await res.status(400).send({ login: "login failed" });
    }
  } catch (error) {
    return res.send(error).status(500);
  }
});

app.post("/create-route", async (req, res) => {
  try {
    const { userId, userRouteName } = req.body;
    const check = await routeModel.find({ userRouteName: userRouteName });
    if (check.length == 0) {
      const check = await routeModel.find({ userId: userId });
      if (check.length != 0) {
        return res.status(409).json("One Email id One Route");
      }
      const data = await routeModel.create({
        userId,
        userRouteName,
      });
      await data.save();
      return await res.status(200).send(data);
    } else {
      return res.status(409).json("Route already exists");
    }
  } catch (error) {
    return res.status(501).send(error);
  }
});

app.get("/get-route", async (req, res) => {
  try {
    const { userId } = req.query;
    let routes = await routeModel.find({ userId: userId });
    return res.status(200).send(routes[0]);
  } catch (error) {
    return res.status(501).send(error);
  }
});

app.post("/create-links", async (req, res) => {
  try {
    const { RouteId, userRouteName, linksArray } = req.body;

    const data = await linkModel.create({
      RouteId,
      userRouteName,
      linksArray,
    });
    await data.save();
    return res.status(200).send(data);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("Duplicate titles are not allowed.");
    }
    return res.status(501).send(error);
  }
});

app.get("/get-links", async (req, res) => {
  try {
    const { RouteId } = req.query;
    const data = await linkModel.find({ RouteId, active: true });
    return res.status(200).send(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.put("/update-link", async (req, res) => {
  try {
    const { RouteId, title, updatedTitle, updatedLink } = req.body;

    const linkDocument = await linkModel.findOne({
      RouteId,
      "linksArray.title": title,
    });

    if (!linkDocument) {
      return res.status(404).send("Link not found");
    }

    const linkIndex = linkDocument.linksArray.findIndex(
      (link) => link.title === title
    );

    linkDocument.linksArray[linkIndex].title = updatedTitle;
    linkDocument.linksArray[linkIndex].link = updatedLink;

    await linkDocument.save();

    return res.status(200).send("Link updated successfully");
  } catch (error) {
    console.error("Error updating link:", error);
    return res.status(500).send("Internal Server Error");
  }
});
app.delete("/delete-link", async (req, res) => {
  try {
    const { title, RouteId } = req.body;

    if (!title || !RouteId) {
      return res.status(400).send("Title and RouteId are required");
    }

    await linkModel.deleteMany({
      "linksArray.title": title,
      RouteId: RouteId,
    });

    res.send("Link deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
