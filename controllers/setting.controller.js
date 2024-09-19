import { v2 as cloudinary } from "cloudinary";
import Banner from "../models/banner.model.js";


const createBanner = async (req, res) => {
  try {
    const { title } = req.body;
    let { imgUrl } = req.body;

    if (imgUrl) {
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      imgUrl = uploadedResponse.secure_url;
    }
    const newbanner = new Banner({ title, imgUrl });
    await newbanner.save();

    res.status(200).json(newbanner);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const editBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    let { imgUrl } = req.body;

    let banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ error: "banner not found" });
    }
    if (imgUrl.includes("base64")) {
      if (banner.imgUrl) {
        await cloudinary.uploader.destroy(
          banner.imgUrl.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      imgUrl = uploadedResponse.secure_url;
    }
    
    banner.title = title || banner.title;
    banner.imgUrl = imgUrl || banner.imgUrl;
    banner = await banner.save();

    res.status(200).json(banner);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBanners = async (req, res) => {
  console.log("ssssssssssss")
  try {
    const bannerList = await Banner.find().sort({
        createdAt: -1,
      });
    if(bannerList === null){
      return res.status(404).json({ error: "banner not found" });
    }
    res.status(200).json(bannerList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "banner not found" });
    }

    if (banner.imgUrl) {
      const imgId = banner.imgUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getBanners,
  createBanner,
  editBanner,
  deleteBanner
};
