import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";

export const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const { cityOrCountry } = req.params;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let andFilters: any[] = [];

    const locationFilter = {
      $or: [
        { city: new RegExp(cityOrCountry, "i") },
        { country: new RegExp(cityOrCountry, "i") },
      ],
    };

    const cityCheck = await Restaurant.countDocuments(locationFilter);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }
    andFilters.push(locationFilter);

    // cuisines filter
    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((c) => new RegExp(c, "i"));
      andFilters.push({ cuisines: { $all: cuisinesArray } });
    }

    // searchQuery filter
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      andFilters.push({
        $or: [
          { restaurantName: searchRegex },
          { cuisines: { $in: [searchRegex] } },
        ],
      });
    }

    // build final query
    const finalQuery = andFilters.length > 0 ? { $and: andFilters } : {};

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(finalQuery)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(finalQuery);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
