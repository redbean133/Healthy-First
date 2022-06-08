# Healthy-First
HealthyFirst là ứng dụng web được phát triển nhằm hỗ trợ các chi cục an toàn vệ sinh thực phẩm  trong  công tác  quản lý các cơ sở sản xuất thực phẩm hoặc kinh doanh dịch vụ ăn uống.

Đối tượng sử dụng chính của hệ thống gồm có người quản lý và chuyên viên. Người quản lý được thực hiện tất cả chức năng và truy cập tất cả dữ liệu. Người quản lý phân công địa bàn phụ trách cho các chuyên viên. Trong khi chuyên viên phụ trách địa bàn nào thì chỉ làm việc trên dữ liệu các cơ sở thuộc địa bàn đó.

Đối tượng được quản lý trong hệ thống gồm có các cơ sở, giấy chứng nhận an toàn thực phẩm, các hoạt động, kế hoạch thanh kiểm tra và các mẫu thực phẩm được thu thập trong quá trình kiểm tra.

Hệ thống đảm bảo nghiệp vụ chính như sau:
1. Quản lý các cơ sở sản xuất thực phẩm hoặc kinh doanh dịch vụ ăn uống. Bao gồm các chức năng chính như thêm, sửa, xóa cơ sở.
2. Quản lý Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm: 
- Cấp mới, thu hồi, gia hạn, xuất bản PDF giấy chứng nhận cho các cơ sở. 
- Thống kê số lượng giấy chứng nhận được cấp theo thời gian.
- Lọc danh sách cơ sở theo các tiêu chí (đủ điều kiện / không đủ điều kiện an toàn thực phẩm).
3. Quản lý hoạt động thanh kiểm tra:
- Thêm mới hoạt động thanh kiểm tra.
- Cập nhật tình hình thanh kiểm tra theo các giai đoạn.
- Thống kê kết quả hoạt động thanh kiểm tra các cơ sở theo thời gian.
- Phân loại hoạt động thanh kiểm tra thành các loại như COMING, DOING, EXPIRED và FINISHED giúp chuyên viên quản lý hoạt động dễ dàng.
4. Quản lý các mẫu thực phẩm được thu thập trong quá trình thanh tra: Thêm, sửa, xóa mẫu thực phẩm.

Một số điểm đặc biệt trong phát triển hệ thống:
- Hệ thống tách biệt hoàn toàn mã Client và Server. Client giao tiếp với Server thông qua API.
- Các trường dữ liệu khi nhập được xử lý hợp thức (Ví dụ như mật khẩu).
- URL được định tuyến hợp lý.
- Mật khẩu được mã hóa bằng Bcrypt trước khi gửi lên Server.
- Xác thực người dùng theo phương pháp Bearer Token. RefreshToken được lưu ở Cookie.

Công nghệ sử dụng:
- Back-end: ExpressJS.
- Front-end: ReactJS.
- Database: MongoDB.

Vide DEMO: https://www.youtube.com/watch?v=vj3Wg3ssFUw
