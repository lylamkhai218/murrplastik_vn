# Hướng dẫn & Prompt Tự Động Hóa FTP/SFTP Deployment Cho AI Agent

Tài liệu này cung cấp **Prompt cấu trúc sẵn** và **Script mẫu** để bạn gửi cho AI Agent của dự án `murrplastik`. Agent sẽ tự động thiết lập hệ thống tự build và đẩy code lên Hostinger hPanel thông qua FTP/SFTP (FTPS bảo mật) mà không cần bạn phải thao tác thủ công.

---

## 1. Cách thức hoạt động của hệ thống tự động
Thay vì nén file, upload qua trình duyệt và giải nén thủ công trên hPanel:
1. **Build**: Project được build ra thư mục sản phẩm (thường là `dist` hoặc `build`).
2. **Read Config**: Script deploy đọc thông số FTP từ file `.env` (bảo mật, không đưa lên git).
3. **Connect & Sync**: Script kết nối đến hosting qua FTPS (FTP over TLS - mặc định của Hostinger) hoặc SFTP, tự động đồng bộ (mirror) toàn bộ thư mục `dist` lên thư mục đích (ví dụ: `public_html`).
4. **Run**: Chỉ bằng 1 lệnh duy nhất: `npm run deploy`.

---

## 2. PROMPT COPY-PASTE CHO AGENT (MURRPLASTIK)

*Hãy copy toàn bộ nội dung trong khung dưới đây và gửi cho Agent của dự án Murrplastik:*

```markdown
I want to set up an automated deployment system using FTP/SFTP to deploy this Vite/React project directly to my Hostinger hPanel hosting. 

Please perform the following steps to implement this:

1. **Install Dependencies**:
   - Install `basic-ftp` as a devDependency (`npm install -D basic-ftp`) to support promise-based secure FTP (FTPS).
   - Install `dotenv` if not already installed, so we can load credentials securely.

2. **Setup Environment Variables**:
   - Guide me on what credentials I need to provide: `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_REMOTE_DIR` (e.g., `/public_html`), and `FTP_PORT` (default is 21).
   - Create a local `.env` file (or append to the existing one) with placeholders for these variables.
   - **Crucial**: Ensure `.env` is listed in `.gitignore` so my FTP credentials are never committed to git.

3. **Create the Deployment Script (`deploy.js`)**:
   - Write a Node.js script in the root directory named `deploy.js`.
   - The script should:
     - Connect to the server using secure FTP (FTPS / explicit TLS) since Hostinger requires secure connections.
     - Clean/prepare the remote directory or directly mirror the local `dist/` directory to the remote directory.
     - Use `client.uploadFromDir("dist", process.env.FTP_REMOTE_DIR)` which uploads directories recursively.
     - Have detailed logging (e.g., showing which files are being uploaded, success/error messages).
     - Close the connection gracefully on completion or error.

4. **Update `package.json`**:
   - Add a `"deploy"` script to the `scripts` block: `"deploy": "npm run build && node deploy.js"`.

5. **Verify and Run**:
   - Once the files are created, ask me to fill in my FTP credentials in `.env`.
   - Then, run `npm run deploy` to build and deploy the application, verifying that it completes successfully without errors.

Please start by installing the packages and creating the configuration files, then guide me through the credentials.
```

---

## 3. Bản thảo mã nguồn `deploy.js` (Tham khảo)

Dưới đây là mã nguồn của script `deploy.js` mà Agent dự án Murrplastik sẽ viết (dựa trên thư viện `basic-ftp`). Nó tự động xử lý kết nối bảo mật (FTPS) và upload đè đè/đồng bộ thư mục `dist` lên Server:

```javascript
import ftp from "basic-ftp";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables từ file .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Bật log chi tiết các file đang truyền tải

    const host = process.env.FTP_HOST;
    const user = process.env.FTP_USER;
    const password = process.env.FTP_PASSWORD;
    const remoteDir = process.env.FTP_REMOTE_DIR || "/public_html";
    const port = parseInt(process.env.FTP_PORT || "21", 10);

    if (!host || !user || !password) {
        console.error("❌ Lỗi: Thiếu thông tin FTP trong file .env!");
        process.exit(1);
    }

    try {
        console.log(`🔌 Đang kết nối tới FTP server: ${host}:${port}...`);
        await client.access({
            host: host,
            user: user,
            password: password,
            port: port,
            secure: true, // Bắt buộc dùng FTPS (FTP over TLS) bảo mật cho Hostinger
            secureOptions: {
                rejectUnauthorized: false // Bỏ qua lỗi SSL tự ký nếu có
            }
        });

        console.log("✅ Kết nối FTP thành công!");
        
        // Đảm bảo thư mục đích trên server tồn tại
        console.log(`📁 Chuyển đến thư mục remote: ${remoteDir}`);
        await client.ensureDir(remoteDir);

        // Upload đè toàn bộ nội dung thư mục "dist" cục bộ lên thư mục remote
        const localDistPath = path.join(__dirname, "dist");
        console.log(`🚀 Bắt đầu upload dữ liệu từ ${localDistPath} lên ${remoteDir}...`);
        
        // uploadFromDir tự động duyệt và upload đệ quy tất cả các file/thư mục con
        await client.uploadFromDir(localDistPath);

        console.log("🎉 Deploy hoàn tất thành công!");
    } catch (err) {
        console.error("❌ Đã xảy ra lỗi trong quá trình deploy:");
        console.error(err);
        process.exit(1);
    } finally {
        client.close();
        console.log("🔌 Đã ngắt kết nối FTP.");
    }
}

deploy();
```

---

## 4. Cách lấy thông tin FTP trên Hostinger hPanel
Để điền vào file `.env`, bạn truy cập vào Hostinger hPanel:
1. Vào **Website** -> **Quản lý (Manage)**.
2. Tìm kiếm mục **Tài khoản FTP (FTP Accounts)**.
3. Tại đây bạn sẽ thấy các thông số:
   - **FTP Server (Host)**: ví dụ `ftp.domain.com` hoặc IP của host.
   - **FTP Username**: ví dụ `u123456789@domain.com`.
   - **FTP Port**: `21` (hoặc `22` nếu dùng SFTP).
   - **FTP Password**: Mật khẩu tài khoản FTP (bạn có thể đổi mới nếu quên).
4. Thư mục đích (`FTP_REMOTE_DIR`): thường là `/public_html` (nếu là trang chính) hoặc `/public_html/subfolder` (nếu là thư mục con).
