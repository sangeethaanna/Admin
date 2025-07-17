import apiRequest from "./apiRequest";

export const getAllCategories = (data: any) => apiRequest("getAllCategories", data);

export const addCategory = (data: any) => apiRequest("addCategory", data);

export const updateCategory = (categoryId: string, data: any) => apiRequest("updateCategory", data, categoryId);

export const deleteCategory = (categoryId: string) => apiRequest("deleteCategory", null, categoryId);