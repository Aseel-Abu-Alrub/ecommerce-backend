import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../services/cloudinery.js";
import { pagination } from "../../services/pagination.js";

export const createCategories = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  if (await categoryModel.findOne({ name })) {
    // return res.status(409).json({message:"category name already exists"})
    return next(new Error("category name already exists", { cause: 409 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/categories`,
    }
  );

  const category = await categoryModel.create({
    name,
    slug: slugify(name),
    image: { secure_url, public_id },
    createdBy: req.user._id,
  });
  return res.status(201).json({ message: "success", category });
};
export const getAllcategories = async (req, res) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  const categories = await categoryModel
    .find({})
    .skip(skip)
    .limit(limit)
    .populate("subcategory");
  return res.status(200).json({ message: "success", categories });
};

export const getspecificCategories = async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  return res.status(200).json({ message: "success", category });
};

export const updateCategories = async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    //return res.status(404()).json({message:`invalid category id ${req.params.id}`})
    return next(
      new Error(`invalid category id ${req.params.id}`, { cause: 404 })
    );
  }

  if (req.body.name) {
    if (
      await categoryModel
        .findOne({ name: req.body.name, _id: { $ne: category._id } })
        .select("name")
    ) {
      // return res.status(409).json({message:`category ${req.body.name} already exists`})
      return next(
        new Error(`category ${req.body.name} already exists`, { cause: 409 })
      );
    }
    category.name = req.body.name;
    category.slug = slugify(req.body.name);
  }

  if (req.body.status) {
    category.status = req.body.status;
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/categories`,
      }
    );

    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }
  category.updateddBy = req.user._id;
  category.createdBy = req.user._id;
  await category.save();
  return res.status(200).json({ message: "success" });
};

export const getActiveCategory = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const category = await categoryModel
    .find({ status: "Active" })
    .skip(skip)
    .limit(limit)
    .select();

  return res
    .status(200)
    .json({ message: "success", count: category.length, category });
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findByIdAndDelete(id);

  if (!category) {
    return next(new Error("category not found", { cause: 404 }));
  }
  await productModel.deleteMany({ categoryId: id });
  return res.status(202).json({ message: "success" });
};
