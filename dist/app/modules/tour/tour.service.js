"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourService = void 0;
const cludinary_config_1 = require("../../config/cludinary.config");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const tour_constant_1 = require("./tour.constant");
const tour_model_1 = require("./tour.model");
const createTourType = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findOne({ name });
    if (existingTourType) {
        throw new Error("Tour type already exists!");
    }
    return yield tour_model_1.TourType.create({ name });
});
const getAllTourTypes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.TourType.find(), query);
    const tourTypes = yield queryBuilder
        .search(tour_constant_1.tourTypeSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tourTypes.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found");
    }
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return updatedTourType;
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found");
    }
    yield tour_model_1.TourType.findByIdAndDelete(id);
    return null;
});
/* ------------------------- TOUR ROUTES ------------------------ */
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findOne({ title: payload.title });
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
    return yield tour_model_1.Tour.create(payload);
});
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
const getAllTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const tourBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = yield tourBuilder
        .search(tour_constant_1.tourSearchableFields)
        .filter()
        .sort()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        tourBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour type not found");
    }
    if (payload.title) {
        const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-");
        let slug = `${baseSlug}`;
        let counter = 0;
        while (yield tour_model_1.Tour.exists({ slug })) {
            slug = `${slug}-${counter++}`;
        }
        payload.slug = slug;
    }
    if (payload.images &&
        payload.images.length > 0 &&
        existingTour.images &&
        existingTour.images.length) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    if (payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        const restDBImage = existingTour.images.filter((imageUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatedPayloadImages = (payload.images || [])
            .filter((imageUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter((imageUrl) => !restDBImage.includes(imageUrl));
        payload.images = [...restDBImage, ...updatedPayloadImages];
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, { new: true });
    if (payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        yield Promise.all(payload.deleteImages.map((url) => (0, cludinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour type not found");
    }
    yield tour_model_1.Tour.findByIdAndDelete(id);
    return null;
});
exports.TourService = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTours,
    updateTour,
    deleteTour,
};
