const { Report, Topic } = require("../models");
exports.getAllReports = (req, res, next) => {
  try {
    const reports = Report.findAll({
        include: {
            model: Topic
        },
        order: [["createdAt", "desc"]],
    });
    res.status(200).json({ reports });
  } catch (err) {
    next(err);
  }
};
exports.getReportById = (req, res, next) => {
  try {
    const { id } = req.params;
    const report = Report.findOne({ 
        where: { id }, 
        include: {
        model: Topic
        },
        order: [["createdAt", "desc"]], 
    });
    if (!report) return res.status(400).json({ message: "Report not found." });
    res.status(200).json({ report });
  } catch (err) {
    next(err);
  }
};
exports.createReport = (req, res, next) => {
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
    const topic = Topic.findOne({ where: { id: topicId } });
    if (!topic) return res.status(401).json({ message: "Topic not found." });
    const reports = Report.findAll({where: {topicId}})
    if (reports) {
        for (let report of reports) {
            if (report.reportStatus ==="REJECT" || report.reportStatus ==="RECONSIDER") {
                await Report.create({ reportContent, topicId, userId: id, reportStatus: "RECONSIDER"})
                return res.status(201).json({ message: "Topic report is sent to admin successfully" });
            }
        }
    }
    await Report.create({ reportContent, topicId, userId: id })
    res.status(201).json({ message: "Topic report is sent to admin successfully" });
  } catch (err) {
    next(err);
  }
};
exports.updateReportStatus = (req, res, next) => {
    try {
      const { id } = req.params;
      const {adminDescription, reportStatus}
      const report = Report.findOne({ where: { id } });
      if (!report) return res.status(400).json({ message: "Report not found." });
      await Report.update({adminDescription, reportStatus}, {where:{id}})
      res.status(200).json({message: `Report id ${id} is updated successfully.` });
    } catch (err) {
      next(err);
    }
  };