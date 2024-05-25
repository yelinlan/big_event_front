import request from "@/utils/request.js";


export const articleCategoryListService = () => {
    return request.get("/category");
}

export const articleCategoryAddService = (params) => {
    return request.post("/category", params);
}

export const articleCategoryUpdateService = (params) => {
    return request.put("/category", params);
}

export const articleCategoryDeleteService = (id) => {
    return request.delete("/category?id=" + id);
}

export const articleListService = (params) => {
    return request.get("/article", {params: params});
}

export const articleUpdateService = (params) => {
    return request.put("/article", params);
}
export const articleAddService = (params) => {
    return request.post("/article", params);
}
export const articleDeleteService = (id) => {
    return request.delete("/article?id=" + id);
}