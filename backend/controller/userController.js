import { UserModel } from "../postgres/postgres.js";

// GET /employees
export const getAllEmp = async (req, res) => {
  try {
    const usersData = await UserModel.findAll();

    if (!usersData || usersData.length === 0) {
      return res.status(404).json({ error: "No employees found in database" });
    }

    return res.status(200).json(usersData);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /employees
export const addEmp = async (req, res) => {
  const { name, email, designation, empId } = req.body;

  if (!name || !email || !designation || !empId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await UserModel.findOne({ where: { empId } });

    if (existing) {
      return res.status(409).json({ message: "Employee already exists" });
    }

    await UserModel.create({ name, email, designation, empId });

    return res.status(201).json({ message: "New employee added successfully" });
  } catch (error) {
    console.error("Error adding employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /employees/:empId
export const updateEmp = async (req, res) => {
  const { empId } = req.params;
  const updateData = req.body;

  try {
    const emp = await UserModel.findOne({ where: { empId } });

    if (!emp) {
      return res.status(404).json({ message: "Employee not found in database" });
    }

    const [updatedRows] = await UserModel.update(updateData, { where: { empId } });

    if (updatedRows === 0) {
      return res.status(400).json({ message: "No changes made to employee" });
    }

    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /employees/:empId
export const deleteEmp = async (req, res) => {
  const { empId } = req.params;

  try {
    const emp = await UserModel.findOne({ where: { empId } });

    if (!emp) {
      return res.status(404).json({ message: "Employee not found in database" });
    }

    await UserModel.destroy({ where: { empId } });

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
