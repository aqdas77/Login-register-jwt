const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("Received userId:", userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { email } = req.body;

    // Check if the user with the provided userId exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's email
    user.email = email;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Error updating email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:userId", async (req, res) => {
	try {
	  const userId = req.params.userId;
	  const user = await User.findById(userId);
  
	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }
	  await User.findByIdAndDelete(userId);
  
	  return res.status(200).json({ message: "User Deleted successfully" });
	} catch (error) {
	  console.error("Error deleting user:", error);
	  return res.status(500).json({ error: "Internal server error" });
	}
  });



module.exports = router;
