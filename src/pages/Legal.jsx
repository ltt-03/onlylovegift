import { useParams } from 'react-router-dom';

const legalContent = {
  terms: {
    title: 'Điều khoản dịch vụ',
    content: `
      <h2>1. Giới thiệu chung</h2>
      <p>Chào mừng bạn đến với <strong>Only Love Gift</strong> (Đại diện quản lý: <strong>Lê Thanh Tùng</strong>). Bằng việc truy cập, đăng ký tài khoản hoặc sử dụng dịch vụ trên trang web của chúng tôi, bạn đồng ý tuân thủ toàn bộ các Điều khoản Dịch vụ này. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.</p>
      
      <h2>2. Dịch vụ cung cấp</h2>
      <p>Only Love Gift cung cấp các sản phẩm kỹ thuật số, bao gồm mã nguồn (source code) website, các mẫu giao diện (template) quà tặng lãng mạn trực tuyến, và dịch vụ tự động tạo liên kết (link) website để người dùng gửi tặng.</p>
      
      <h2>3. Quyền sở hữu trí tuệ</h2>
      <p>Tất cả nội dung, giao diện thiết kế, mã nguồn thuộc Only Love Gift đều được bảo hộ. Việc bạn mua sản phẩm đồng nghĩa với việc bạn được cấp <strong>Quyền sử dụng cá nhân</strong>. Nghiêm cấm sao chép, phân phối, bán lại mã nguồn của chúng tôi nhằm mục đích thương mại.</p>
      
      <h2>4. Trách nhiệm của người dùng</h2>
      <p>Bạn chịu hoàn toàn trách nhiệm đối với các nội dung, hình ảnh, thông điệp cá nhân hóa mà bạn tải lên. Nghiêm cấm việc sử dụng dịch vụ để truyền tải nội dung vi phạm pháp luật, đồi trụy hoặc vi phạm quyền riêng tư.</p>

      <h2>5. Thông tin liên hệ giải quyết tranh chấp</h2>
      <p>Mọi thắc mắc hoặc tranh chấp liên quan đến điều khoản, xin vui lòng liên hệ trực tiếp với cá nhân chịu trách nhiệm vận hành: <strong>Lê Thanh Tùng</strong>.</p>
      <ul>
        <li><strong>Điện thoại/Zalo:</strong> 0848290617</li>
        <li><strong>Email:</strong> tunglecode@gmail.com</li>
      </ul>
    `
  },
  privacy: {
    title: 'Chính sách bảo mật',
    content: `
      <h2>1. Mục đích và phạm vi thu thập dữ liệu</h2>
      <p>Chúng tôi chỉ thu thập các thông tin cá nhân cơ bản (Tên, Địa chỉ Email) để quản lý tài khoản và hỗ trợ tạo trang web quà tặng. Các nội dung bạn tải lên (hình ảnh, lời chúc) chỉ được dùng duy nhất cho mục đích khởi tạo website của bạn.</p>
      
      <h2>2. Cam kết bảo vệ thông tin</h2>
      <p>Chúng tôi (Đại diện: Lê Thanh Tùng) cam kết <strong>KHÔNG BÁN, KHÔNG CHO THUÊ</strong> dữ liệu cá nhân của khách hàng cho bên thứ ba. Dữ liệu của bạn được lưu trữ an toàn và chỉ chia sẻ cho các đối tác hạ tầng công nghệ (ví dụ: máy chủ lưu trữ) để duy trì hoạt động.</p>
      
      <h2>3. Quyền lợi của khách hàng</h2>
      <p>Khách hàng có quyền yêu cầu trích xuất, chỉnh sửa hoặc xóa vĩnh viễn dữ liệu cá nhân cũng như các hình ảnh, website đã tạo khỏi hệ thống của chúng tôi bất cứ lúc nào.</p>
      
      <h2>4. Đơn vị thu thập và quản lý thông tin</h2>
      <p>Website được điều hành và quản lý bởi cá nhân: <strong>Lê Thanh Tùng</strong></p>
      <ul>
        <li><strong>Hotline CSKH:</strong> 0848290617</li>
        <li><strong>Email hỗ trợ:</strong> tunglecode@gmail.com</li>
      </ul>
    `
  },
  shipping: {
    title: 'Chính sách vận chuyển & Giao nhận',
    content: `
      <h2>1. Hình thức giao hàng</h2>
      <p>Only Love Gift là nền tảng cung cấp <strong>sản phẩm/dịch vụ kỹ thuật số (Digital Products) trực tuyến</strong> (cụ thể là website quà tặng và liên kết URL). Do đó, chúng tôi <strong>KHÔNG</strong> áp dụng hình thức vận chuyển, giao nhận hàng hóa vật lý qua các đơn vị chuyển phát nhanh.</p>
      
      <h2>2. Quy trình và Thời gian giao nhận sản phẩm online</h2>
      <p>Sản phẩm sẽ được "giao" đến bạn ngay lập tức (Thời gian thực - Real-time) sau khi hệ thống ghi nhận thanh toán thành công thông qua 2 hình thức:</p>
      <ul>
        <li><strong>Hiển thị trực tiếp:</strong> Cung cấp liên kết (Link URL) của trang web quà tặng trực tiếp trên màn hình kết quả thanh toán thành công để bạn có thể sao chép và gửi ngay cho người nhận.</li>
        <li><strong>Gửi qua Email:</strong> Gửi thông tin truy cập, link website và Hóa đơn điện tử tự động qua địa chỉ Email mà bạn đã cung cấp khi thanh toán.</li>
      </ul>
      
      <h2>3. Xử lý sự cố giao nhận kỹ thuật số</h2>
      <p>Trong trường hợp bạn đã thanh toán nhưng không nhận được liên kết website trên màn hình hoặc qua email (có thể do nhập sai email hoặc email vào mục Spam), xin vui lòng liên hệ ngay với chúng tôi để được cấp phát lại sản phẩm:</p>
      <ul>
        <li><strong>Quản lý kỹ thuật (Lê Thanh Tùng):</strong> 0848290617</li>
        <li><strong>Email:</strong> tunglecode@gmail.com</li>
      </ul>
    `
  },
  refund: {
    title: 'Chính sách đổi trả & Hoàn tiền',
    content: `
      <h2>1. Đặc thù Sản phẩm Kỹ thuật số</h2>
      <p>Do bản chất của các sản phẩm kỹ thuật số trực tuyến (liên kết website có thể được sử dụng và chia sẻ ngay lập tức sau khi tạo thành công), các đơn hàng tại Only Love Gift mặc định là <strong>Không áp dụng chính sách đổi trả (Non-returnable)</strong>.</p>
      
      <h2>2. Chính sách Hoàn tiền 100%</h2>
      <p>Nhằm đảm bảo quyền lợi tuyệt đối cho khách hàng, chúng tôi sẽ hoàn trả 100% số tiền giao dịch trong các trường hợp ngoại lệ sau đây:</p>
      <ul>
        <li><strong>Lỗi hệ thống:</strong> Đã trừ tiền trong tài khoản ngân hàng của bạn nhưng hệ thống của chúng tôi không tạo được liên kết website quà tặng và không thể khắc phục sự cố trong vòng 24 giờ.</li>
        <li><strong>Thanh toán trùng lặp:</strong> Bạn bị trừ tiền nhiều lần cho cùng một giao dịch mua hàng.</li>
        <li><strong>Sản phẩm lỗi:</strong> Website được tạo ra không hoạt động, bị lỗi hiển thị hình ảnh/nội dung hoàn toàn khác biệt so với cam kết và không thể sửa chữa.</li>
      </ul>
      
      <h2>3. Quy trình yêu cầu Hoàn tiền</h2>
      <p>Nếu bạn gặp phải một trong các trường hợp trên, vui lòng thực hiện các bước sau để được hoàn tiền:</p>
      <ol>
        <li>Liên hệ trực tiếp qua số <strong>Hotline/Zalo: 0848290617 (Gặp Tùng)</strong> hoặc gửi email tới <strong>tunglecode@gmail.com</strong> trong vòng <strong>7 ngày</strong> kể từ ngày thanh toán.</li>
        <li>Cung cấp hình ảnh biên lai thanh toán và ảnh chụp màn hình báo lỗi hệ thống.</li>
        <li>Chúng tôi sẽ đối soát và thực hiện lệnh hoàn tiền về đúng tài khoản ngân hàng/ví điện tử gốc của bạn trong thời gian tối đa từ 2 - 5 ngày làm việc.</li>
      </ol>
    `
  },
  payment: {
    title: 'Hướng dẫn thanh toán',
    content: `
      <h2>1. Các phương thức thanh toán chấp nhận</h2>
      <p>Nhằm mang lại sự tiện lợi và tự động hóa cao nhất, Only Love Gift hỗ trợ các hình thức thanh toán sau:</p>
      <ul>
        <li><strong>Chuyển khoản Ngân hàng (Quét mã VietQR):</strong> Hỗ trợ tất cả các ngân hàng nội địa tại Việt Nam. </li>
        <li><strong>Ví điện tử:</strong> Hỗ trợ thanh toán nhanh qua Momo hoặc VNPay.</li>
      </ul>
      
      <h2>2. Quy trình thanh toán tự động</h2>
      <p>Quy trình thanh toán được thiết kế để diễn ra tự động 100%:</p>
      <ol>
        <li>Sau khi bạn chọn mẫu quà tặng và tùy chỉnh nội dung, hệ thống sẽ đưa bạn đến trang Thanh toán.</li>
        <li>Màn hình sẽ hiển thị <strong>Mã QR thanh toán</strong> cùng số tiền chính xác và nội dung chuyển khoản đặc biệt (Mã đơn hàng).</li>
        <li>Bạn mở ứng dụng Ngân hàng hoặc Ví điện tử, quét mã QR (số tiền và nội dung sẽ tự động được điền). Vui lòng <strong>KHÔNG</strong> thay đổi nội dung chuyển khoản để hệ thống nhận diện tự động.</li>
        <li>Ngay khi giao dịch chuyển khoản thành công, hệ thống của chúng tôi sẽ tự động xác nhận trong vòng 1-3 phút và ngay lập tức trả kết quả website quà tặng cho bạn.</li>
      </ol>
      
      <h2>3. Hỗ trợ sự cố thanh toán</h2>
      <p>Trong trường hợp bạn đã chuyển tiền thành công nhưng hệ thống chưa tự động cập nhật hoặc bị treo do lỗi mạng, xin đừng lo lắng. Vui lòng chụp lại biên lai chuyển khoản và liên hệ ngay với chúng tôi để được kích hoạt đơn hàng thủ công nhanh chóng:</p>
      <ul>
        <li><strong>Hotline CSKH (Lê Thanh Tùng):</strong> 0848290617</li>
        <li><strong>Email:</strong> tunglecode@gmail.com</li>
      </ul>
    `
  }
};

export default function Legal() {
  const { pageId } = useParams();
  const page = legalContent[pageId] || legalContent.terms;

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '800px', minHeight: '60vh' }}>
      <div className="card" style={{ padding: '50px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '30px', borderBottom: '2px solid var(--color-border)', paddingBottom: '15px' }}>
          {page.title}
        </h1>
        <div 
          style={{ lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </div>
    </div>
  );
}
