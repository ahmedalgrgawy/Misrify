import Team from "../models/team.model.js";
import AppError from "../errors/AppError.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";


export const createTeamMember = async (req, res, next) => {
    const { name, email, linkedIn, github, instagram, profileUrl, jobTitle } = req.body;

    const isExist = await Team.findOne({ email });
    if (isExist) {
        return next(new AppError("Team member already exists", 400));
    }

    const teamMember = new Team({ name, email, linkedIn, github, instagram, profileUrl, jobTitle });

    await teamMember.save();

    const adminsExpectLoggedInAdmin = await User.find({
        role: "admin",
        _id: { $ne: req.user._id }
    }).select("_id");

    await Notification.create({
        receivers: adminsExpectLoggedInAdmin.map(admin => admin._id), // Changed to receivers array
        sender: "Misrify Store", // Updated to Misrify Store
        content: `New team member ${name} has been added`, // Changed to content
        type: "general", // Now valid with updated schema
        isRead: false,
    });

    res.status(201).json({ success: true, message: "Team member created successfully", teamMember });
};

export const getAllTeamMembers = async (req, res, next) => {
    const teamMembers = await Team.find();

    if (!teamMembers) {
        return next(new AppError("No team members found", 404));
    }

    res.status(200).json({ success: true, teamMembers });
};

export const getTeamMemberById = async (req, res, next) => {
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
        return next(new AppError("Team member not found", 404));
    }

    res.status(200).json({ success: true, teamMember });
};

export const updateTeamMember = async (req, res, next) => {
    const { name, email, linkedIn, github, instagram, profileUrl, jobTitle } = req.body;

    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
        return next(new AppError("Team member not found", 404));
    }

    teamMember.name = name || teamMember.name;
    teamMember.email = email || teamMember.email;
    teamMember.linkedIn = linkedIn || teamMember.linkedIn;
    teamMember.github = github || teamMember.github;
    teamMember.instagram = instagram || teamMember.instagram;
    teamMember.profileUrl = profileUrl || teamMember.profileUrl;
    teamMember.jobTitle = jobTitle || teamMember.jobTitle;

    await teamMember.save();

    res.status(200).json({ success: true, message: "Team member updated successfully", teamMember });
};

export const deleteTeamMember = async (req, res, next) => {
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
        return next(new AppError("Team member not found", 404));
    }

    await teamMember.deleteOne();

    res.status(200).json({ success: true, message: "Team member deleted successfully" });
};
