import z from "zod";

export const createTourZodSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.string().optional(),
  startDate: z.string().optional().optional(),
  endDate: z.string().optional().optional(),
  tourType: z.string(), // <- changed here
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.string().optional(),
  minAge: z.string().optional(),
  division: z.string(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
});

export const updateTourZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.string().optional(),
  startDate: z.string().optional().optional(),
  endDate: z.string().optional().optional(),
  tourType: z.string().optional(), // <- changed here
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.string().optional(),
  minAge: z.string().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
  deleteImages: z.array(z.string()).optional(),
});

export const createTourTypeZodSchema = z.object({
  name: z.string(),
});
