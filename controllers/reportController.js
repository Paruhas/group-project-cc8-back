const { Report, Topic, Room, User } = require("../models");
const { report } = require("../routes/roomRoute");

exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Topic,
          include: [
            { model: Room, attributes: ["id", "roomName", "roomStatus"] },
            {
              model: User,
              attributes: ["id", "username", "userImg", "userStatus"],
            },
          ],
          attributes: ["id", "topicName", "topicStatus"],
        },
        {
          model: User,
          attributes: ["id", "username", "userImg", "userStatus"],
        },
      ],
      order: [["createdAt", "desc"]],
    });
    res.status(200).json({ reports });
  } catch (err) {
    next(err);
  }
};
exports.getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findOne({
      where: { id },
      include: [
        {
          model: Topic,
          include: [
            { model: Room, attributes: ["id", "roomName", "roomStatus"] },
            {
              model: User,
              attributes: ["id", "username", "userImg", "userStatus"],
            },
          ],
          attributes: ["id", "topicName", "topicStatus"],
        },
        {
          model: User,
          attributes: ["id", "username", "userImg", "userStatus"],
        },
      ],
      order: [["createdAt", "desc"]],
    });
    if (!report) return res.status(400).json({ message: "Report not found." });
    res.status(200).json({ report });
  } catch (err) {
    next(err);
  }
};
exports.createReport = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { reportContent, topicId } = req.body;
    if (!reportContent || !reportContent.trim())
      return res
        .status(401)
        .json({ message: "Content of report is required." });
    if (!topicId)
      return res
        .status(401)
        .json({ message: "ID of topic you need to report is required." });
    const topic = await Topic.findOne({
      where: { id: topicId, topicStatus: "ACTIVE" },
      include: [
        { model: Room, where: { roomStatus: "ACTIVE" } },
        { model: User, where: { userStatus: "ACTIVE" } },
      ],
    });

    if (!topic) return res.status(401).json({ message: "Topic not found." });
    const reports = await Report.findAll({ where: { topicId } });

    for (let report of reports) {
      if (report.userId === id)
        return res
          .status(400)
          .json({ message: "You have reported this topic." });
    }

    await Report.create({ reportContent, topicId, userId: id });
    res
      .status(201)
      .json({ message: "Topic report is sent to admin successfully" });
  } catch (err) {
    next(err);
  }
};
exports.updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminDescription, reportStatus } = req.body;
    const report = Report.findOne({ where: { id } });
    if (!report) return res.status(400).json({ message: "Report not found." });
    await Report.update({ adminDescription, reportStatus }, { where: { id } });
    res
      .status(200)
      .json({ message: `Report id ${id} is updated successfully.` });
  } catch (err) {
    next(err);
  }
};
