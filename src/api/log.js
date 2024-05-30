import request from "@/utils/request.js";

export const logListService = (params) => {
    return request.get("/log", {params: params});
}