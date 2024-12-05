import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  updateFood,
} from "../controllers/foodController.js";
import multer from "multer"; // multer là một middleware cho Node.js , được sử dụng để xử lý các file tải lên (upload) trong các ứng dụng web

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
}); // định nghĩa cấu hình engine lưu trữ
const upload = multer({ storage: storage }); // khởi tạo một instance của multer với cấu hình lưu trữ đã định nghĩa.

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.put("/:id", upload.single("image"), updateFood);
foodRouter.delete("/:id", removeFood);

export default foodRouter;

/*
Cách hoạt động middleware Multer:
1. Tải lên tệp: Khi người dùng gửi một biểu mẫu có chứa tệp, phương thức 
single sẽ tìm trường tệp có tên tương ứng với fieldName.
2. Xử lý tệp: Multer sẽ xử lý tệp đó và lưu trữ nó theo cấu hình bạn đã chỉ định 
(ví dụ: vị trí lưu trữ, tên tệp, v.v.).
3. Cập nhật đối tượng req: Sau khi tệp được xử lý, đối tượng yêu cầu (req) 
sẽ được cập nhật với một thuộc tính file. Thuộc tính này sẽ chứa thông 
tin về tệp đã tải lên (như tên tệp, đường dẫn tệp, loại tệp, v.v.).
*/
