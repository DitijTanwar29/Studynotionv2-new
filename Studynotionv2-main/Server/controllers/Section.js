const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try{
        //data fetch
        const {sectionName, courseId} = req.body;
        //data validate
        if (!sectionName || !courseId) {
            return res.json(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update the course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent:newSection._id,
                                                }
                                            },
                                            {new:true}
        ).populate({
        path:"courseContent",
        populate: {
            path: "subSection",
            },
        })
        .exec();
        //return response
        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            data:updatedCourseDetails,
        })

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:'Unable to create Section, please try again',
            error:error.message,
        })
    }
};

exports.updateSection = async (req, res) => {
    try{

        //  data fetch
        const {sectionName, sectionId} = req.body;
        // validate data 
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                status:false,
                message:'All fields are required',
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true} );
        //return res
        return res.status(200).json({
            success:true,
            message:'Section Updated Successfully',
        });
    } catch(err) {
        return res.status(500).json({
            success:false,
            message:'Unable to update Section, please try again',
            error:err.message,
        });
    }
};

exports.deleteSection = async (req, res) => {
    try{
        // get ID - assumint that we are sending ID in params
        const {sectionId} = req.params;
        const {courseId} = req.params;
        //use findByIdAndDelete
        console.log("sectionId : ",sectionId);
        console.log("courseId : ", courseId);
        await Section.findByIdAndDelete(sectionId);
        //TODO [TESTING] : Do we need to delete section from the course schema ?? 
        updatedCourseContent = await Course.findByIdAndDelete(sectionId);
        await Course.findByIdAndUpdate({courseId},
                                            {courseContent: updatedCourseContent},
                                            {new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:'Section Deleted Successfully',
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:'Unable to delete Section, please try again',
            error:err.message,
        });
    }
};