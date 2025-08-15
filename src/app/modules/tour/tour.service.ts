import { deleteImageFromCloudinary } from "../../config/cludinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  tourSearchableFields,
  tourTypeSearchableFields,
} from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTourType = async (name: string) => {
  const existingTourType = await TourType.findOne({ name });

  if (existingTourType) {
    throw new Error("Tour type already exists!");
  }

  return await TourType.create({ name });
};

const getAllTourTypes = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourType.find(), query);

  const tourTypes = await queryBuilder
    .search(tourTypeSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tourTypes.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found");
  }

  await TourType.findByIdAndDelete(id);

  return null;
};

/* ------------------------- TOUR ROUTES ------------------------ */
const createTour = async (payload: ITour) => {
  const existingTourType = await TourType.findOne({ title: payload.title });

  if (existingTourType) {
    throw new Error("Tour type already exists!");
  }

  // const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-");
  // let slug = `${baseSlug}`;

  // let counter = 0;
  // while (await Tour.exists({ slug })) {
  //   slug = `${slug}-${counter++}`;
  // }
  // payload.slug = slug;

  return await Tour.create(payload);
};

// const getAllTourOld = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   // field filtering
//   const fields = query.fields?.split(",").join(" ") || "";

//   for (const field of excludeFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQuery = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   // const tours = await Tour.find(searchQuery)
//   //   .find(filter)
//   //   .sort(sort)
//   //   .select(fields)
//   //   .skip(skip)
//   //   .limit(limit);
//   // const totalTours = await Tour.countDocuments();

//   const filterQuery = Tour.find(filter);
//   const tours = filterQuery.find(searchQuery);
//   const allTour = await tours.sort(sort).select(fields).skip(skip).limit(limit);

//   const totalTours = await Tour.countDocuments();
//   const totalPage = Math.ceil(totalTours / limit);

//   return {
//     data: allTour,
//     meta: {
//       page: totalPage < page ? totalPage : page,
//       limit: limit,
//       total: totalTours,
//       totalPage: totalPage,
//     },
//   };
// };

const getAllTours = async (query: Record<string, string>) => {
  const tourBuilder = new QueryBuilder(Tour.find(), query);
  const tours = await tourBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .paginate();
  const [data, meta] = await Promise.all([
    tours.build(),
    tourBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new Error("Tour type not found");
  }

  if (payload.title) {
    const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    payload.slug = slug;
  }

  if (
    payload.images &&
    payload.images.length > 0 &&
    existingTour.images &&
    existingTour.images.length
  ) {
    payload.images = [...payload.images, ...existingTour.images];
  }

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    const restDBImage = existingTour.images.filter(
      (imageUrl) => !payload.deleteImages?.includes(imageUrl)
    );

    const updatedPayloadImages = (payload.images || [])
      .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
      .filter((imageUrl) => !restDBImage.includes(imageUrl));

    payload.images = [...restDBImage, ...updatedPayloadImages];
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    await Promise.all(
      payload.deleteImages.map((url) => deleteImageFromCloudinary(url))
    );
  }

  return updatedTour;
};

const deleteTour = async (id: string) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new Error("Tour type not found");
  }

  await Tour.findByIdAndDelete(id);

  return null;
};

export const TourService = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
};
