# คู่มือการติดตั้ง แก้ไข และ Deploy โปรเจค Moonbluesstore

เอกสารนี้รวบรวมขั้นตอนที่จำเป็นสำหรับการทำงานกับโปรเจคนี้ ทั้งการนำขึ้น Git, การนำโปรเจคไปรันที่เครื่องอื่น, และการ Deploy ขึ้น Server (Vercel)

---

## 1. การนำโค้ดขึ้น Git (Push Changes)

เมื่อคุณแก้ไขโค้ดเสร็จแล้ว และต้องการบันทึกการเปลี่ยนแปลงลงใน Git Repository:

1.  **ตรวจสอบสถานะไฟล์:**
    ดูว่ามีไฟล์ไหนที่มีการเปลี่ยนแปลงบ้าง
    ```bash
    git status
    ```

2.  **เลือกไฟล์ที่จะบันทึก (Add):**
    หากต้องการเลือกทุกไฟล์ที่มีการเปลี่ยนแปลง:
    ```bash
    git add .
    ```

3.  **บันทึกการเปลี่ยนแปลง (Commit):**
    ใส่ข้อความอธิบายสั้นๆ ว่าคุณทำอะไรไปบ้าง
    ```bash
    git commit -m "คำอธิบายสิ่งที่แก้ไข เช่น เพิ่มหน้า Login หรือ แก้ไข CSS"
    ```

4.  **ส่งข้อมูลขึ้น Server (Push):**
    ```bash
    git push origin main
    ```
    *หมายเหตุ: หากมีการแก้ไขจากคนอื่นก่อนหน้านี้ อาจต้องใช้คำสั่ง `git pull` ก่อนเพื่อดึงข้อมูลล่าสุด (แนะนำ `git pull --rebase`)*

---

## 2. ขั้นตอนการติดตั้งโปรเจคที่เครื่องใหม่ (Setup New Machine)

หากต้องการนำโปรเจคไปทำต่อที่เครื่องคอมพิวเตอร์เครื่องอื่น:

### สิ่งที่ต้องมีก่อน (Prerequisites):
*   **Git**: สำหรับดึงโค้ดลงมา ([ดาวน์โหลด Git](https://git-scm.com/))
*   **Node.js**: แนะนำเวอร์ชัน LTS ล่าสุด ([ดาวน์โหลด Node.js](https://nodejs.org/))
*   **Editor**: เช่น VS Code

### ขั้นตอนการติดตั้ง:

1.  **โคลนโปรเจค (Clone):**
    เปิด Terminal หรือ Command Prompt แล้วพิมพ์คำสั่ง:
    ```bash
    git clone https://github.com/Pluypt/moonbluesstore.git
    cd moonbluesstore
    ```

2.  **ติดตั้ง Library (Install Dependencies):**
    ```bash
    npm install
    ```

3.  **ตั้งค่า Environment Variables (.env):**
    โปรเจคนี้มีการเชื่อมต่อกับ Firebase จำเป็นต้องมีคีย์สำหรับเชื่อมต่อ
    *   ให้ระวัง **อย่า** นำไฟล์ `.env` หรือคีย์ต่างๆ ขึ้น Git เพื่อความปลอดภัย
    *   สร้างไฟล์ชื่อ `.env.local` ในโฟลเดอร์หลักของโปรเจค
    *   ใส่ข้อมูลดังต่อไปนี้ (จาก Firebase Console):
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=...
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
        NEXT_PUBLIC_FIREBASE_APP_ID=...
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
        ```

4.  **เริ่มรันโปรเจค (Run Development Server):**
    ```bash
    npm run dev
    ```
    จากนั้นเปิด Browser ไปที่ `http://localhost:3000`

---

## 3. การ Deploy ขึ้น Vercel (Production)

เนื่องจากโปรเจคนี้เขียนด้วย Next.js การ Deploy ที่ง่ายและมีประสิทธิภาพที่สุดคือการใช้ **Vercel**

### วิธีที่ 1: Deploy ผ่าน GitHub (แนะนำ)
1.  สมัครสมาชิก [Vercel](https://vercel.com/) และ Login ด้วย GitHub Account
2.  ไปที่หน้า Dashboard ของ Vercel กดปุ่ม **"Add New..."** -> **"Project"**
3.  เลือก Repository `moonbluesstore` จากรายการ แล้วกด **Import**
4.  ในหน้า Configure Project:
    *   **Environment Variables:** ให้กดขยายส่วนนี้ แล้วใส่ค่า Key และ Value จากไฟล์ `.env.local` ที่เตรียมไว้ในข้อ 2 ทีละตัว
5.  กด **Deploy**
    *   Vercel จะทำการ Build และ Deploy ให้ทันที
    *   หลังจากนี้ ทุกครั้งที่คุณ Push โค้ดขึ้น GitHub (`git push origin main`) Vercel จะ Deploy เวอร์ชันใหม่ให้อัตโนมัติ

### วิธีที่ 2: Deploy ผ่าน Command Line
1.  ติดตั้ง Vercel CLI:
    ```bash
    npm i -g vercel
    ```
2.  ล็อคอิน:
    ```bash
    vercel login
    ```
3.  Deploy:
    ```bash
    vercel
    ```
    (ตอบคำถามตามที่ขึ้นมา ส่วนใหญ่กด Enter ผ่านได้เลย)
4.  Deploy ขึ้น Production (หลังจากทดสอบแล้ว):
    ```bash
    vercel --prod
    ```
