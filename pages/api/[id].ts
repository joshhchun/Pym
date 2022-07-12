import dbConnect from "../../utils/initDB";
import Post from "../../models/Post";
import { useRouter } from "next/router";

// Function to update the expiration time
function updateExpire() {
    var date = new Date(); // Now
    date.setDate(date.getDate() + 15); // Set now + 15 days as the new date
    return date;
}

// API Endpoint to retrieve post data from the database
export default async function handler(req, res) {
    const router = useRouter();
    let { id } = router.query;
    // Connect to DB
    await dbConnect();
    // Retrieve post data
    try {
        const post = await Post.findOne({ shortId: req.params.id });
        console.log(post);
        res.status(200).json({
            value: post.value,
            group: post.group,
            language: post.language,
        });
        // If a user visits a post, reset its expiration date
        post.expire = updateExpire();
        await post.save();
    } catch (e) {
        console.log("No Post with that ID!");
        res.json(null);
    }
}
