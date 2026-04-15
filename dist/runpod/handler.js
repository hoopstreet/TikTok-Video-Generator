module.exports.handler = async (event) => {
    console.log("📥 JOB RECEIVED:", JSON.stringify(event, null, 2));
    return {
        status: "success",
        message: "Manual Recovery Handler Active",
        data: event
    };
};
