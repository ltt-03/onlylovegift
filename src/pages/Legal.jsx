import { useParams } from 'react-router-dom';

const legalContent = {
  terms: {
    title: 'Điều khoản dịch vụ',
    content: `
      <h2>1. Giới thiệu chung</h2>
      <p>Chào mừng bạn đến với <strong>Only Love Gift</strong> (sau đây gọi tắt là "Chúng tôi"). Bằng việc truy cập, đăng ký tài khoản hoặc sử dụng dịch vụ trên trang web của chúng tôi, bạn đồng ý tuân thủ toàn bộ các Điều khoản Dịch vụ này. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.</p>
      
      <h2>2. Dịch vụ cung cấp</h2>
      <p>Only Love Gift cung cấp các sản phẩm kỹ thuật số, bao gồm mã nguồn (source code) website, các mẫu giao diện (template) quà tặng lãng mạn, và dịch vụ hỗ trợ triển khai (deploy) website tự động lên nền tảng đám mây.</p>
      
      <h2>3. Quyền sở hữu trí tuệ</h2>
      <p>Tất cả nội dung, giao diện thiết kế, mã nguồn, đồ họa và logo trên website này đều thuộc bản quyền hợp pháp của Only Love Gift. Việc bạn mua sản phẩm đồng nghĩa với việc bạn được cấp <strong>Quyền sử dụng cá nhân (Personal License)</strong>. Bạn nghiêm cấm thực hiện các hành vi sau:</p>
      <ul>
        <li>Sao chép, phân phối, bán lại, hoặc cho thuê mã nguồn dưới bất kỳ hình thức nào.</li>
        <li>Tuyên bố quyền sở hữu đối với các thiết kế thuộc Only Love Gift.</li>
      </ul>
      
      <h2>4. Trách nhiệm của người dùng</h2>
      <p>Khi sử dụng dịch vụ, bạn cam kết cung cấp thông tin chính xác. Bạn chịu hoàn toàn trách nhiệm đối với các nội dung, hình ảnh, thông điệp cá nhân hóa mà bạn tải lên hoặc khởi tạo qua hệ thống của chúng tôi. Chúng tôi nghiêm cấm việc sử dụng dịch vụ để truyền tải nội dung vi phạm pháp luật, đồi trụy hoặc vi phạm quyền riêng tư của người khác.</p>
      
      <h2>5. Miễn trừ trách nhiệm</h2>
      <p>Dịch vụ được cung cấp "nguyên trạng" (AS IS). Mặc dù chúng tôi cam kết hệ thống hoạt động ổn định, chúng tôi không chịu trách nhiệm cho các gián đoạn dịch vụ do các bên thứ ba (như nhà cung cấp máy chủ, đối tác thanh toán) gây ra.</p>

      <h2>6. Thông tin liên hệ</h2>
      <p>Nếu bạn có bất kỳ câu hỏi nào về Điều khoản này, vui lòng liên hệ với chúng tôi qua email hỗ trợ của hệ thống.</p>
    `
  },
  privacy: {
    title: 'Chính sách bảo mật',
    content: `
      <h2>1. Mục đích thu thập dữ liệu</h2>
      <p>Chúng tôi chỉ thu thập các thông tin cá nhân cơ bản (Bao gồm: Tên hiển thị, Địa chỉ Email, Ảnh đại diện Google) khi bạn đăng nhập thông qua Google OAuth. Ngoài ra, chúng tôi thu thập các dữ liệu do bạn chủ động cung cấp (hình ảnh, lời chúc, tên người nhận) để khởi tạo trang web quà tặng theo yêu cầu của bạn.</p>
      
      <h2>2. Phạm vi sử dụng thông tin</h2>
      <p>Thông tin của bạn được chúng tôi sử dụng với các mục đích:
      <ul>
        <li>Cá nhân hóa trải nghiệm người dùng và khởi tạo nội dung website quà tặng.</li>
        <li>Xác thực tài khoản và gửi email thông báo (như hóa đơn, link tải mã nguồn).</li>
        <li>Hỗ trợ khách hàng, giải đáp thắc mắc và xử lý khiếu nại.</li>
      </ul></p>
      
      <h2>3. Cam kết chia sẻ thông tin</h2>
      <p>Chúng tôi cam kết <strong>KHÔNG BÁN, KHÔNG CHO THUÊ</strong> dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào. Dữ liệu của bạn chỉ được chia sẻ một cách hạn chế và mã hóa cho các đối tác hạ tầng công nghệ thiết yếu (Vercel, dịch vụ Email) để thực hiện tính năng cốt lõi của dịch vụ.</p>
      
      <h2>4. Bảo mật dữ liệu & Quyền của người dùng</h2>
      <p>Chúng tôi áp dụng các công nghệ bảo mật chuẩn SSL để mã hóa thông tin truyền tải. Bạn có toàn quyền yêu cầu chúng tôi xóa hoàn toàn tài khoản và dữ liệu cá nhân của bạn khỏi hệ thống bất cứ lúc nào bằng cách gửi yêu cầu qua email hỗ trợ.</p>
      
      <h2>5. Chính sách Cookie</h2>
      <p>Website sử dụng Cookie để lưu trữ phiên đăng nhập và ghi nhớ tùy chọn giao diện (Sáng/Tối) của bạn. Bạn có thể vô hiệu hóa Cookie trên trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến khả năng sử dụng các tính năng của website.</p>
    `
  },
  shipping: {
    title: 'Chính sách giao nhận',
    content: `
      <h2>1. Hình thức giao hàng</h2>
      <p>Vì các sản phẩm của Only Love Gift là <strong>Sản phẩm Kỹ thuật số (Digital Products)</strong> bao gồm mã nguồn (Source Code) và Tên miền phụ (Subdomain URL), chúng tôi <strong>KHÔNG</strong> thực hiện giao hàng vật lý qua các đơn vị vận chuyển truyền thống.</p>
      
      <h2>2. Quy trình và Thời gian giao nhận</h2>
      <p>Ngay sau khi hệ thống xác nhận thanh toán thành công, sản phẩm sẽ được "giao" đến bạn ngay lập tức (Thời gian thực - Real-time) thông qua các hình thức sau:</p>
      <ul>
        <li>Hiển thị Link Website thành phẩm trực tiếp trên màn hình kết quả thanh toán.</li>
        <li>Gửi Tệp tin nén (ZIP) chứa mã nguồn và Hóa đơn điện tử tự động qua địa chỉ Email mà bạn đã cung cấp khi thanh toán.</li>
      </ul>
      
      <h2>3. Trách nhiệm của Khách hàng</h2>
      <p>Khách hàng có trách nhiệm cung cấp chính xác địa chỉ Email để nhận sản phẩm. Trong trường hợp không nhận được email do hệ thống chặn thư rác (Spam) hoặc nhập sai email, quý khách vui lòng liên hệ đội ngũ Hỗ trợ để được cấp phát lại liên kết tải xuống.</p>
      
      <h2>4. Chi phí giao hàng</h2>
      <p>Toàn bộ quá trình giao nhận sản phẩm số qua hệ thống mạng internet là <strong>Miễn phí 100%</strong>.</p>
    `
  },
  refund: {
    title: 'Chính sách đổi trả & Hoàn tiền',
    content: `
      <h2>1. Đặc thù Sản phẩm Kỹ thuật số</h2>
      <p>Do bản chất của các sản phẩm kỹ thuật số (mã nguồn có thể sao chép ngay khi tải về) và tính năng triển khai tức thì (deploy automated), các đơn hàng tại Only Love Gift mặc định là <strong>Không thể hoàn trả (Non-refundable)</strong> sau khi mã nguồn đã được gửi đến bạn.</p>
      
      <h2>2. Các trường hợp được xét duyệt Hoàn tiền</h2>
      <p>Chúng tôi đặt trải nghiệm khách hàng lên hàng đầu. Bạn sẽ được <strong>Hoàn tiền 100%</strong> trong các trường hợp ngoại lệ sau:</p>
      <ul>
        <li>Hệ thống kỹ thuật của chúng tôi bị lỗi, khiến website quà tặng của bạn không thể hiển thị sau khi thanh toán và chúng tôi không thể khắc phục sự cố trong vòng 48 giờ.</li>
        <li>Bạn bị trừ tiền nhiều lần cho cùng một đơn hàng do lỗi hệ thống thanh toán trung gian.</li>
        <li>Sản phẩm mã nguồn bàn giao bị thiếu hoặc khác biệt hoàn toàn so với mẫu thiết kế đã xem trước mà không có sự thông báo.</li>
      </ul>
      
      <h2>3. Quy trình yêu cầu Hoàn tiền</h2>
      <p>Nếu bạn đáp ứng điều kiện trên, vui lòng làm theo hướng dẫn sau:</p>
      <ol>
        <li>Gửi email yêu cầu hoàn tiền đến bộ phận Chăm sóc khách hàng trong vòng <strong>7 ngày</strong> kể từ ngày phát sinh giao dịch.</li>
        <li>Cung cấp Mã đơn hàng (Order ID), Email đăng ký và bằng chứng (Ảnh chụp màn hình lỗi).</li>
        <li>Chúng tôi sẽ xem xét và phản hồi trong vòng 1-3 ngày làm việc. Khi được chấp thuận, số tiền sẽ được hoàn trả về tài khoản gốc của bạn từ 5-7 ngày làm việc tùy thuộc vào ngân hàng.</li>
      </ol>
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
