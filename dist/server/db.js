const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
);

async function updateVideoStatus(videoId, status, url = null) {
    const { data, error } = await supabase
        .from('videos') // Make sure your table is named 'videos'
        .upsert({ id: videoId, status: status, video_url: url });
    if (error) console.error('Supabase Error:', error);
    return data;
}

module.exports = { updateVideoStatus };
