import "./About.css";
import tin from "../../Images/tin.jpg";

function About() {
  return (
    <main className="about-page">
      <section className="about-header">
        <div>
          <p className="about-eyebrow">WORKMATE</p>
          <h1>เกี่ยวกับผู้พัฒนา</h1>
          <p>ข้อมูลผู้พัฒนาระบบ WorkMate</p>
        </div>
      </section>

      <section className="about-content-card">
        <div className="about-developer">
          <div className="about-photo-wrapper">
            <img
              className="about-photo"
              src={tin}
              alt="อรัชพร นาคมอญ"
            />
          </div>

          <div className="about-info">
            <p className="about-label">DEVELOPER</p>

            <h2>อรัชพร นาคมอญ</h2>

            <p>
              <strong>รหัสนักศึกษา:</strong> 65057974
            </p>

            <p>
              <strong>คณะ:</strong> เทคโนโลยีสารสนเทศ
            </p>

            <p>
              <strong>สาขา:</strong> วิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์ ชั้นปีที่ 3
            </p>

            <p>
              <strong>มหาวิทยาลัย:</strong> มหาวิทยาลัยศรีปทุม
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;